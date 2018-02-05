angular.module("motoboy").controller('osAdminCtrl', function($scope, $http, $location, $timeout, 
  $rootScope, configUrl){
	
	
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var param = function(obj) {
		var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

		for(name in obj) {
			value = obj[name];

			if(value instanceof Array) {
				for(i=0; i<value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			}
			else if(value instanceof Object) {
				for(subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			}
			else if(value !== undefined && value !== null)
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}

		return query.length ? query.substr(0, query.length - 1) : query;
	};

	$http.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];
	
	
  $scope.userside = localStorage.nome;
  $rootScope.userside = localStorage.nome;

  $scope.places = 1;

  $scope.pagos = [
    {id:0, descricao:'Não'},
    {id:1, descricao:'Sim'},
  ];


  $scope.endereco_entrega = [];

  $scope.adicionarEntrega = function (endereco_entrega) {
    $scope.endereco_entrega.push(angular.copy(endereco_entrega));
  };

  $scope.dbValor = [];
  $scope.dbInp = function (i) {
    $scope.dbValor[i] = !$scope.dbValor[i];
  };

  $scope.moreOnePlace = function () {
    $scope.places++;
    console.log($scope.places);
  };

  $scope.enderecos = {
   rua: [],
   num:[]
  };

  $scope.addFormField = function() {
    $scope.enderecos.rua.push('');
    $scope.enderecos.num.push('');
  }

  $scope.addFormField();

  $scope.removeFormField = function(enderecos) {
    
      $scope.enderecos.num.pop();
      $scope.enderecos.rua.pop();

          
  };

  $scope.indVincular = function(i){
      $scope.cliente.indicacao = i;

  };

  $scope.criterioDeBusca ={
        
    cliente:false,
    search:'',
  
    operador:false,
  
  
    pagamento:false,
  
  
    motoboy:false,
  
  
    created_at:false,
        
  };
  $scope.criteriou=false;

  $scope.buscarOsCriterio = function(crit){
      if(crit.search.length > 0 && (crit.cliente == true || crit.operador==true || crit.pagamento==true || crit.created_at == true)){
      $http({
              url: configUrl.baseUrl+"/os-criterio",
              method: "POST",
              data: crit,
              headers: {user_token: localStorage.token}
          })
          .then(function(response) {
                //$scope.criteriou=true;
                $scope.currentPage = 1;

                $scope.osData = response.data.data;
                $scope.os = response.data;

                $scope.total = response.data.total;
                $scope.totalPages = response.data.last_page;
                $scope.pages = [];

                for ( var i = 1; i <= $scope.totalPages; i++ ) {
                 $scope.pages.push(i); 
                
                }


              }, 
              function(response) { // optional
                 
              }
          );
      }else{
        carregarOs();
      }
  };

  $scope.carregarOsPaginadaCrit = function (crit, page) {



      $http({
              url: configUrl.baseUrl+"/os-criterio?page="+page,
              method: "POST",
              data: crit,
              headers: {user_token: localStorage.token}
          })
          .then(function(response) {
                
                $scope.currentPage = 1;

                $scope.osData = response.data.data;
                $scope.os = response.data;

                $scope.total = response.data.total;
                $scope.totalPages = response.data.last_page;
                $scope.pages = [];

                for ( var i = 1; i <= $scope.totalPages; i++ ) {
                 $scope.pages.push(i); 
                
                }


              }, 
              function(response) { // optional
                 
              }
          );
      

      };

  $scope.halitarCampos = function(){
    $scope.habilitarCampos = !$scope.habilitarCampos;
  };

    var carregarIndicacoes = function(){

      $http({
      method: 'GET',
      url:configUrl.baseUrl+'/indicacoes-all',
      headers: {
        user_token: localStorage.token
      }
      }).success(function(data){
          $scope.indicacao= data;

      }).error(function (data){

      });

    };
    
    carregarIndicacoes()
      
    $scope.loading = true;

     $timeout(function() {
         $scope.loading= false;
       }, 500);


    $('#myModal4').modal('hide');

    $('#myModal2').modal('hide');

    $('#myModal').modal('hide');


     $scope.modal = function(){
        $('#myModal').modal();

     };


    $scope.clientes = [
            
    ];

    $scope.clienteFound = function(selected) {

        $scope.cliente = {};
          
          if(!(typeof selected == 'undefined')){
          $http({
          method: 'GET',
          url:configUrl.baseUrl+'cliente-avulso/'+selected.originalObject.id,
          headers: {
            user_token: localStorage.token
          }
          }).success(function(data){
            console.log(data);
            $scope.cliente= data[0];
         $scope.cliente.indicacao = { id: data[0].indicacao.id, nome: data[0].indicacao.nome };
            $scope.osCliente = data[0].os;
            if(data[0].cpf == 0)
              $scope.cliente.cpf = '';

            
            $scope.achouOs=true;

          }).error(function (data){
             $scope.cliente = {};
          });
        }
      };

      $scope.populaCampo = function(cliente) {
        console.log(cliente);
        console.log(cliente.endereco.enderecos_entrega.length);
        
        for(var i=0; i<cliente.endereco.enderecos_entrega.length;i++){
           $scope.addFormField();
           $scope.enderecos.rua[i] = cliente.endereco.enderecos_entrega[i].endereco_entrega;
           $scope.enderecos.num[i] = cliente.endereco.enderecos_entrega[i].numero_entrega;
        }
        $scope.removeFormField();

        $scope.osCad.endereco_entrega = cliente.endereco.endereco_entrega;
        $scope.osCad.numero_entrega = cliente.endereco.numero_entrega;
        $scope.osCad.descricao = cliente.endereco.observacao;
        $scope.osCad.tipoPg = cliente.tipoPg;
        $scope.osCad.retorno = cliente.endereco.retorno;
        
	$scope.osCad.endereco_retirada = cliente.endereco.endereco_retirada;
	$scope.osCad.numero_retirada = cliente.endereco.numero_retirada;

$scope.checkForm2();
        
      };

    $scope.populaModal = function(o) {

        $scope.osModal = o;
	$scope.osModal.valorComissao = o.valor * o.comissaoP;
console.log($scope.osModal.valorComissao);
        if(o.obs_interna === null){
          $scope.osModal.obs_interna = { obs_interna: 'Sem observação interna'};
        }
        console.log(o);

      };
    
    var carregarClientes = function(){

      $http({
      method: 'GET',
      url:configUrl.baseUrl+'/clientes',
      headers: {
        user_token: localStorage.token
      }
      }).success(function(data){
          $scope.clientes= data;

      }).error(function (data){

      });

    };

    

    $scope.os =[];

    var carregarUser = function(){

      $http({
      method: 'GET',
      url:configUrl.baseUrl+'/get-user',
      headers: {
        user_token: localStorage.token
      }
      }).success(function(data){
        $rootScope.user = data[0];
        $scope.user= data[0];
 
        
        if(data[0].regra.id != 1)
          carregarClientes();
    
        console.log($scope.loading);

      }).error(function (data){
        //return $location.path('logout');
      });

    };

    carregarUser();

    


    $scope.dados = [];
    $scope.token = localStorage.token;
    
    $rootScope.user = $scope.user;



    var carregarOs = function () {
        $http({
        method: 'GET',
        url: configUrl.baseUrl+'/os',
        headers: {
          user_token: localStorage.token
        }
       }).success(function (data) {
          $scope.osData = data.data;
          $scope.os = data;

          $scope.total = data.total;
          $scope.totalPages = data.last_page;
          $scope.pages = [];

          for ( var i = 1; i <= $scope.totalPages; i++ ) {
           $scope.pages.push(i); 
          }

          console.log(data.data);
        }).error(function (data, status) {
          //$location.path('login');
        });
      };

    carregarOs();

    $scope.currentPage = 1;

    $scope.carregarOsPaginada = function (page) {



      $scope.lastPage = $scope.currentPage;
      $scope.currentPage = page;

      

            $http({
            method: 'GET',
            url: configUrl.baseUrl+'/os?page='+page,
            headers: {
              user_token: localStorage.token
            }
            }).success(function (data) {
                $scope.osData = data.data;
                $scope.os = data;

                $scope.total = data.total;
                $scope.totalPages = data.last_page;
                $scope.pages = [];

                for ( var i = 1; i <= $scope.totalPages; i++ ) {
                 $scope.pages.push(i); 
                }


              }).error(function (data, status) {
                //$location.path('login');
              });

      

      };

    
    var carregarMotoboy = function () {
        $http({
      method: 'GET',
      url: configUrl.baseUrl+'motoboys',
      headers: {
        user_token: localStorage.token
      }
    }).success(function (data) {
          $scope.motoboys = data;
          console.log(data);
        }).error(function (data, status) {
          //$location.path('login');
        });
      };

      
    carregarMotoboy();

     var carregarStatus = function () {
        $http({
      method: 'GET',
      url: configUrl.baseUrl+'status',
      headers: {
        user_token: localStorage.token
      }
    }).success(function (data) {
          $scope.statuss = data;
        }).error(function (data, status) {
          //$location.path('login');
        });
      };

      
    carregarStatus();

     $scope.result1 = '';
    $scope.options1 = null;
    $scope.details1 = '';

    $scope.buscarCliente = function (user) {
        
    };

    $scope.salvarOs = function (osModal) {
      osModal.email = false;
        if(osModal.motoboy == null)
        {
          osModal.motoboy_id=0;
        }
        else
        {
            if(typeof osModal.motoboy.id != 'undefined')
            {
                osModal.motoboy_id = osModal.motoboy.id;    
            }
            else
            {
                osModal.motoboy_id = 0;
            }
        }

        
        osModal.status_id = osModal.status.id;

        osModal.observacao = osModal.endereco.observacao;
        osModal.obs_int = osModal.obs_interna.obs_interna;
        

        
        

        $http({
              url: configUrl.baseUrl+"/os-update",
              method: "POST",
              data: osModal,
              headers: {user_token: localStorage.token}
          })
          .then(function(response) {
                 
              carregarOs();
          
              $('#myModal2').modal('hide');

              }, 
              function(response) { // optional
                 
              }
          );
    };

    $scope.salvarOsEmail = function (osModal) {
        osModal.email = true;
        if(osModal.motoboy == null)
        {
          osModal.motoboy_id=0;
        }
        else
        {
            if(typeof osModal.motoboy.id != 'undefined')
            {
                osModal.motoboy_id = osModal.motoboy.id;    
            }
            else
            {
                osModal.motoboy_id = 0;
            }
        }

        
        osModal.status_id = osModal.status.id;

        osModal.observacao = osModal.endereco.observacao;
        osModal.obs_int = osModal.obs_interna.obs_interna;

        $http({
              url: configUrl.baseUrl+"/os-update",
              method: "POST",
              data: osModal,
              headers: {user_token: localStorage.token}
          })
          .then(function(response) {
                 
              carregarOs();
          
              $('#myModal2').modal('hide');

              }, 
              function(response) { // optional
                 
              }
          );
    };
    

   $scope.attValorComissao = function (o) {
        
	   	$scope.osModal.valorComissao =o.valor * o.comissaoP;
    };


    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

     $scope.saveMotoboy = function (motoboy_id, o_id) {
        
        saveOsWithMotoboy = {
          motoboy_id: motoboy_id,
          o_id: o_id
        };
        


        $http({
              url: configUrl.baseUrl+"/os-motoboy",
              method: "POST",
              data: saveOsWithMotoboy,
              headers: {user_token: localStorage.token}
          })
          .then(function(response) {
                 
                 carregarOs();


              }, 
              function(response) { // optional
                 
              }
          );
        
    };

    $scope.saveStatus = function (status, o_id) {
        
        saveOsWithStatus = {
          status: status,
          o_id: o_id
        };
        


        $http({
              url: configUrl.baseUrl+"/os-status",
              method: "POST",
              data: saveOsWithStatus,
              headers: {user_token: localStorage.token}
          })
          .then(function(response) {
                 
                 carregarOs();


              }, 
              function(response) { // optional
                 
              }
          );
        
    };

    $scope.deletarOs = function (id) {
  

        $http({
              url: configUrl.baseUrl+"/os-delete/"+id,
              method: "GET",
              headers: {user_token: localStorage.token}
          })
          .then(function(response) {
                 
                 carregarOs();


              }, 
              function(response) { // optional
                 
              }
          );
        
    };

    $scope.validate= {
      show:false,
      msg:""
    };

    $scope.cliente = {};
    $scope.chamarMotoboy = function (cliente,osCad,enderecos) {


       var nome = (document.getElementById('ex6_value').value);
    
          if(typeof cliente.id )
          osCad.nome = cliente.nome;
          if(cliente.endereco)
            osCad.endereco = cliente.endereco;
          else
            osCad.endereco = '';

          if(cliente.telefone)
            osCad.telefone = cliente.telefone;
          else
            osCad.telefone = '';

          if(cliente.celular)
            osCad.celular = cliente.celular;
          else
            osCad.celular = '';

          if(cliente.numero)
            osCad.numero = cliente.numero;
          else
            osCad.numero = '';

          if(cliente.cidade)
            osCad.cidade = cliente.cidade;
          else
            osCad.cidade = '';

          if(cliente.estado)
          osCad.estado = cliente.estado;
          else
            osCad.estado = '';

          if(cliente.cpf)
          osCad.cpf = cliente.cpf;
          else
            osCad.cpf = '';

          if(cliente.email)
          osCad.email = cliente.email;
          else
            osCad.email = '';

          if(cliente.complemento)
          osCad.complemento = cliente.complemento;
          else
            osCad.complemento = '';


          if(cliente.indicacao)
            osCad.indicacao = cliente.indicacao.id;
          else
            osCad.indicacao = 1;

          if(cliente.sobrenome)
          osCad.sobrenome = cliente.sobrenome;
          else
            osCad.sobrenome = '';


          osCad.nome = nome;
          osCad.valor = $scope.valor;
          osCad.distancia = $scope.totalDistance;

          console.log(cliente);
        
     
       
          

          
          
        

        if(osCad.retorno)
          {
            if(osCad.retorno == true)
              osCad.retorno=true;
            else
              osCad.retorno = false;
          }
          else{
            osCad.retorno = false;
          }

        osCad.enderecos = enderecos.rua;
        osCad.enderecosNumeros = enderecos.num;

        $http({
              url: configUrl.baseUrl+"/os-create",
              method: "POST",
              data: osCad,
              headers: {user_token: localStorage.token}
          })
          .then(function(response) {
              $scope.validate.show=false;
                   $scope.osCad = {};
                   $scope.cliente = {};
                   $scope.showValor =false;

                   document.getElementById('ex6_value').value = '';
                  carregarOs();
                  carregarClientes();

                  $scope.msgShow = true;
                  $scope.message=response.data.message;

                  while($scope.enderecos.rua.length > 0){

                    $scope.enderecos.rua.pop();
                  }
                  while($scope.enderecos.num.length > 0){
                    
                    $scope.enderecos.num.pop();
                  }
  
                  $scope.addFormField();

                  $scope.achouOs=false;

              }, 
              function(response) { // optional
                
                  $scope.validate= {
                    show:true,
                    msg: response.data
                  };
              }
          );



        
    };

   

    $scope.limparOs = function () {

        $scope.osCad= {};
        $scope.msgShow = false;
        
    };

    /********** INICIO DA GOOGLE API ***************************/
  var minimunDistance = 6;
  var minimunPrice  = 15.00;

  $scope.showValor = false;


var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() { 
  directionsDisplay = new google.maps.DirectionsRenderer();
  var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);
  
    var options = {
        zoom: 5,
    center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    
  
  
}

      initialize();

      $scope.osCad = {
        tipoPg: 'VISTA',
        endereco_entrega: undefined,
        endereco_retirada: undefined
      };



       $scope.checkForm2 = function(){
        // && $scope.osCad.endereco_retirada != 'undefined'
        if($scope.osCad.endereco_entrega != 'undefined' && $scope.osCad.endereco_entrega != '' && $scope.enderecos.rua.length > 0)
        {
        $timeout(function() {
               $scope.showValorProcessando= true;
        
        $scope.totalDistance=0;
        $scope.valor=0;
        for(val =0; val< $scope.enderecos.rua.length; val++){
          console.log($scope.enderecos.rua[val]);
        
        var enderecoPartida = $scope.osCad.endereco_retirada;
        var enderecoChegada = $scope.enderecos.rua[val];
        

        var request = {
          origin: enderecoPartida,
          destination: enderecoChegada,
          travelMode: google.maps.TravelMode.DRIVING
        };
        
        directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
          }
           
           computeTotalDistance(result);

             $scope.$digest();
         

        });

      }
      }, 1000);
      }
      };
        


      function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = Math.round(total / 1000.0);
        $scope.totalDistance = $scope.totalDistance + total;
        $scope.valor = $scope.valor+calculateFreightValue(total);
       
        if($scope.osCad.retorno === true){
          if($scope.totalDistance < 8)
            $scope.valor = $scope.valor + 5.00;
          else
            $scope.valor = $scope.valor + Math.round($scope.totalDistance*0.50);
            $scope.totalDistance = $scope.totalDistance*2;
        }else{
          
        }
        $scope.showValor = true;
      }

      function calculateFreightValue(totalDistance) {
          var valueFreight = 0;
          if(totalDistance <= minimunDistance)
            valueFreight = minimunPrice;
          else if(totalDistance > minimunDistance) {
            valueFreight = (minimunPrice + ((totalDistance - minimunDistance) * 1));
          }

          return valueFreight;
        }




/********** FIM DA GOOGLE API ***************************/
      
      


      $scope.androidOs = function (id) {    

      	// Executa a função que inicializa o objeto de dados do local de retirada
      	createMapObjcts();
		initWebSocketConnection();
		
			
          $http({
                url: configUrl.baseUrl+"/os-android/"+id,
                method: "GET",
                headers: {user_token: localStorage.token}
            })
            .then(function(response) {
	
      				carregarOs();


                }, 
                function(response) { // optional
                   
                }
            );
          
      };
      

      $scope.salvarOsAndroid = function (osModal, osid) {
          
    	  console.log(osModal.id);
    	  console.log(osid);
    	  
          var Myoptions = [];
          var Mydata = JSON.parse(JSON.stringify(osModal));
          $.each(Mydata, function(k, v) {
              // alert('each');                         
              Myoptions[k] = v;
              //console.log(Mydata);
              
              
          });
          
          

          var Myoptions2 = [];
          $.each(Myoptions.endereco.enderecos_entrega, function(k, v) {        	  
        	  Myoptions2[k] = {endereco: "",numero: ""};        	  
              // alert('each');
        	  if(Myoptions.endereco.enderecos_entrega[k].endereco_entrega){
        		  Myoptions2[k].endereco = Myoptions.endereco.enderecos_entrega[k].endereco_entrega.replace(", Brasil", "");
        		  Myoptions2[k].numero = Myoptions.endereco.enderecos_entrega[k].numero_entrega;
        	  }else{
                  Myoptions2[k] = v;  
        	  }
          });
          


			console.log("initWebSocketConnection Myoptions2");
			console.log(Myoptions2);
			
          
          
          
          /*
           * 
			* $$hashKey: "007"
			complemento: ""
			details: Object
			endereco: "Avenida Washignton Luís - Campo Belo, São Paulo - SP, Brasil"
			endereco_error: false
			nomeContato: "okokok"
			nomeContato_error: false
			numero: 444
			numero_error: false
			observacoes: ""
           */

			console.log("initWebSocketConnection endereco");
			console.log(Myoptions.endereco);
			

			console.log("initWebSocketConnection enderecos_entrega");
			console.log(Myoptions.endereco.enderecos_entrega);
			
			/*
	        $scope.osCad.descricao = Myoptions.endereco.observacao;
	        $scope.osCad.tipoPg = Myoptions.tipoPg;
	        $scope.osCad.retorno = Myoptions.endereco.retorno;
	        */
	
	      	// Executa a função que inicializa o objeto de dados do local de retirada
	      	// createMapObjcts();
			
			/*
    		

    		var entrega = [{
    			$$hashKey: "007",
    			complemento: "",
    			details: [{}],
    			endereco: Myoptions.endereco.endereco_entrega,
    			nomeContato: "okokok",
    			numero: Myoptions.endereco.numero_entrega,
    			observacoes: "",
    			options: null,
    		}];
    		
    		*/
			

    		var retirada = {
    			endereco: Myoptions.endereco.endereco_retirada,
    			numero: Myoptions.endereco.numero_retirada,
    			observacoes: Myoptions.observacao,
    		};
    		

    		$scope.Cliente = Myoptions.user.nome;
    		$scope.telefone = Myoptions.user.telefone;  		

    		$scope.OsId = Myoptions.id;

    		$scope.created_at = Myoptions.created_at;
    		$scope.updated_at = Myoptions.updated_at;
    		$scope.distancia = Myoptions.distancia;
    		
    		$scope.status_id = Myoptions.status.id;
    		$scope.status_descricao = Myoptions.status.descricao;

    		$scope.pago = Myoptions.pago;
    		$scope.tipoPg = Myoptions.tipoPg;
    		$scope.valorSugerido = Myoptions.valor;
    		$scope.valorComissao = Myoptions.valorComissao;
    		$scope.comissaoP = Myoptions.comissaoP;

    		$scope.indicacao_id = Myoptions.indicacao_id;
    		$scope.indicacao_type = Myoptions.indicacao_type;
    		$scope.indicacao_created_at = Myoptions.indicacao.created_at;
    		$scope.indicacao_updated_at = Myoptions.indicacao.updated_at;
    		$scope.indicacao_id = Myoptions.indicacao.id;
    		$scope.indicacao_nome = Myoptions.indicacao.nome;
    		$scope.indicacao_tipo = Myoptions.indicacao.tipo;
    		$scope.indicacao_user_id = Myoptions.indicacao.user_id;
    		$scope.indicacao_user_type = Myoptions.indicacao.user_type;					


            if(Myoptions.motoboy == null)
            {
            	Myoptions.motoboy=0;
            }
            
    		$scope.motoboy = Myoptions.motoboy;
    		$scope.motoboy_id = Myoptions.motoboy_id;
    		$scope.motoboy_email = Myoptions.motoboy.email;
    		$scope.motoboy_pago = Myoptions.motoboy_pago;    		

    		$scope.local_retirada = retirada;    		
    		$scope.locais_entrega = Myoptions2;
    				
    				
			//console.log("initWebSocketConnection osModal");
			//console.log(osModal);


            
            
			//console.log("initWebSocketConnection validaCampos");
			//console.log(Myoptions);
			
			initWebSocketConnection();

          $http({
              url: configUrl.baseUrl+"/os-androidupdate",
              method: "POST",
              data: osModal,
              headers: {user_token: localStorage.token}
            })
            .then(function(response) {

                carregarOs();
            
                $('#myModal2').modal('hide');

                }, 
                function(response) { // optional
                   
                }
            );
      };
      
  	/**
  	 * Esta função inicializa o objeto de dados do local de retirada
  	 */
  	function createMapObjcts(){
  		
  		var retirada = {
  			endereco: "Avenida Washignton Luís - Campo Belo, São Paulo - SP, Brasil",
  			numero: 444,
  			complemento: "",
  			nomeContato: "okokok",
  			observacoes: "muita calma nesta hora",
  			details: "",
  			options: null
  		};
  		
  		$scope.local_retirada = retirada;
  		

  		var entrega = [{
  			$$hashKey: "007",
  			complemento: "",
  			details: [{}],
  			endereco: "Avenida São João - República, São Paulo - SP, Brasil",
  			nomeContato: "okokok",
  			numero: 333,
  			observacoes: "",
  			options: null,
  		}];
  		
  		$scope.locais_entrega = entrega;
		$scope.totalFrete = 22;
  	};      
 	
  	/**
	 *
	 *
	 */
	function initWebSocketConnection() {
		//var host = "ws://54.149.249.5:9000/echobot";
		//var host = "ws://52.24.170.241:9000/echobot";
		// var host = "ws://52.24.34.94:9000/echobot";
		var host = "ws://62.75.159.141:9000/echobot";
		try {
			socket = new WebSocket(host);

			console.log('WebSocket - status ' + socket.readyState);

			socket.onopen = function(msg) {
				console.log('Welcome - status ' + this.readyState);
			};

			socket.onmessage = function(msg) {
				
				var data = JSON.parse(msg.data);

				if(data.status == 'connected') {
					
					var objData = {
						'webSocketId': data.websocket_id,
						/*
						'confirmed': "false",
						'valorSugerido': $scope.valorSugerido,
						'valorComissao': $scope.valorComissao,
						'tipoPg': $scope.tipoPg,
						'Cliente': $scope.Cliente,
						'telefone': $scope.telefone,
						'pago': $scope.pago,
						'OsId': $scope.OsId,
						'tipoServico': "Documentos",
						'startAddress': $scope.local_retirada,
						'waypoints': $scope.locais_entrega
						*/
						

						'confirmed': "wait",
						'Cliente': $scope.Cliente,
			    		'telefone': $scope.telefone,  		
	
			    		'OsId': $scope.OsId,
	
			    		'created_at': $scope.created_at,
			    		'updated_at': $scope.updated_at,
			    		'distancia': $scope.distancia,
			    		
			    		'status_id': $scope.status_id,
			    		'status_descricao': $scope.status_descricao,
	
			    		'pago': $scope.pago,
			    		'tipoPg': $scope.tipoPg,
			    		'valorSugerido': $scope.valorSugerido,
			    		'valorComissao': $scope.valorComissao,
			    		'comissaoP': $scope.comissaoP,
	
			    		'indicacao_id': $scope.indicacao_id,
			    		'indicacao_type': $scope.indicacao_type,
			    		'indicacao_created_at': $scope.indicacao_created_at,
			    		'indicacao_updated_at': $scope.indicacao_updated_at,
			    		'indicacao_id': $scope.indicacao_id,
			    		'indicacao_nome': $scope.indicacao_nome,
			    		'indicacao_tipo': $scope.indicacao_tipo,
			    		'indicacao_user_id': $scope.indicacao_user_id,
			    		'indicacao_user_type': $scope.indicacao_user_type,					
	
			    		'motoboy': $scope.motoboy,
			    		'motoboy_id': $scope.motoboy_id,
			    		'motoboy_pago': $scope.motoboy_pago,    		
	
			    		'startAddress': $scope.local_retirada,    		
			    		'waypoints': $scope.locais_entrega,
						'tipoServico': "Retirada",				

					};	
					
					

		    		

		    		
					
					/*
					startAddress: Object
					tipoServico: "Documentos"
					valorSugerido: 22
					waypoints: Array[1]
					*/
					
					
					console.log("initWebSocketConnection objData");
					console.log(objData);

					/*
					try {
						socket.send(objData);
						console.log('Sent: '+msg);
					} catch(ex) {
						console.log(ex);
					}
					*/

					$http.post("/disqmotoboy-api/notify/mototoboys", objData)
						.success(function(data, status, headers, config) {
							
							console.log("initWebSocketConnection data");
							console.log(data);
							

							console.log("initWebSocketConnection status");
							console.log(status);
							

							console.log("initWebSocketConnection headers");
							console.log(headers);
							

							console.log("initWebSocketConnection config");
							console.log(config);							
							

						})
						.error(function(data, status, headers, config) {
							if(status == 406) {
								console.log("error");
							}
						});
					
				}

				console.log("Received: "+msg.data);
				


				var objData = {
					'cod_motoboy': $scope.motoboy_id,
					'osid': $scope.OsId,
					'vlr_servico': $scope.valorSugerido,
					'dsc_tipo_servico': "Retirada",
					'obj_local_retirada': $scope.local_retirada,
					'arr_locais_entrega': $scope.locais_entrega
				};
				

				console.log("POST /disqmotoboy-api/service/confirmadmin");
				console.log(objData);	

				$http.post("/disqmotoboy-api/service/confirmadmin", objData)
					.success(function(data, status, headers, config) {

					})
					.error(function(data, status, headers, config) {
						if(status == 406) {
							console.log("error");
						}
					});

				};
				

				socket.onclose   = function(msg) {
					console.log('Disconnected - status ' + this.readyState);
					
					
			};

			socket.onclose   = function(msg) {
				console.log('Disconnected - status ' + this.readyState);
			};
			
		
			// http://disqmotoboy.com.br/disqmotoboy-api/websocket/send/message/?status=message&id_ws=u5623cec2cedef&id_usuario=1&installationId=c22be870-9e81-479a-8117-144978e67898&nome_usuario=Ivo+Linsmeyer+Filho&celular=%2884%29+2222+1&operadora=Oi&valor_corrida=177%2C70&osid=0&tmp_estimado=20

		}
		catch(ex){
			console.log(ex);
		}
		
	}
	
	/**
	 * 
	 * 
	
	startAddress
	complemento: ""
	details: Object
	endereco: "Bauru - SP, Brasil"
	endereco_error: false
	nomeContato: "okoook"
	nomeContato_error: false
	numero: 222
	numero_error: false
	observacoes: ""
	options: null
	
	Array
(
    [alert] => Você recebeu uma solicitação de corrida!
    [confirmed] => false
    [startAddress] => Array
        (
            [complemento] => 
            [details] => Array
                (
                    [address_components] => Array
                        (
                            [0] => Array
                                (
                                    [long_name] => Bauru
                                    [short_name] => Bauru
                                    [types] => Array
                                        (
                                            [0] => locality
                                            [1] => political
                                        )

                                )

                            [1] => Array
                                (
                                    [long_name] => Bauru
                                    [short_name] => Bauru
                                    [types] => Array
                                        (
                                            [0] => administrative_area_level_2
                                            [1] => political
                                        )

                                )

                            [2] => Array
                                (
                                    [long_name] => São Paulo
                                    [short_name] => SP
                                    [types] => Array
                                        (
                                            [0] => administrative_area_level_1
                                            [1] => political
                                        )

                                )

                            [3] => Array
                                (
                                    [long_name] => Brasil
                                    [short_name] => BR
                                    [types] => Array
                                        (
                                            [0] => country
                                            [1] => political
                                        )

                                )

                        )

                    [adr_address] => 
                    [formatted_address] => Bauru - SP, Brasil
                    [geometry] => Array
                        (
                            [viewport] => Array
                                (
                                    [La] => Array
                                        (
                                            [I] => -48.97623010000001
                                            [j] => -49.20486729999999
                                        )

                                    [Pa] => Array
                                        (
                                            [I] => -22.4077264
                                            [j] => -22.1679883
                                        )

                                )

                        )

                    [icon] => https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png
                    [id] => d5c80b8caf178c294a888fab1012ffbc0c347a18
                    [name] => Bauru
                    [place_id] => ChIJIaLaDZxov5QRoDShb482HCU
                    [reference] => CnRvAAAAb2KzXZqOYddhTOLy4ApGDrggzAeyndOsSCHUczdRSCJfjhLrMCdc0crdIjhGOiZuYRDZu7cytw_2txD86SpIVuquD3XM5_cWtXeL_0qePXPYnM42r4jXVMwqrjuoB6AWs42a9SD_laoYAsatbbAVLhIQ3MLVXsMCzxvYQOxOwsgbTxoUzPHBJ0exphyp7uv_0myhkHONwoE
                    [scope] => GOOGLE
                    [types] => Array
                        (
                            [0] => locality
                            [1] => political
                        )

                    [url] => https://maps.google.com/maps/place?q=Bauru+-+SP,+Brasil&ftid=0x94bf689c0ddaa221:0x251c368f6fa134a0
                    [vicinity] => Bauru
                )

            [endereco] => Bauru - SP, Brasil
            [endereco_error] => false
            [nomeContato] => okoook
            [nomeContato_error] => false
            [numero] => 222
            [numero_error] => false
            [observacoes] => 
        )

    [tipoServico] => Documentos
    [valorSugerido] => 132
    [waypoints] => Array
        (
            [0] => Array
                (
                    [complemento] => 
                    [endereco] => Jaú - SP, Brasil
                    [endereco_error] => false
                    [nomeContato] => uuuu
                    [nomeContato_error] => false
                    [numero] => 333
                    [numero_error] => false
                    [observacoes] => 
                )

            [1] => Array
                (
                    [complemento] => 
                    [endereco] => Bauru - SP, Brasil
                    [endereco_error] => false
                    [nomeContato] => iiiii
                    [nomeContato_error] => false
                    [numero] => 444
                    [numero_error] => false
                    [observacoes] => 
                )

        )

    [webSocketId] => u561e357828682
)
	

	 */

	/**
	 * Esta função inicializa o objeto de dados do local de retirada
	 */
	function createObjRetirada(){
		var item = {
			endereco: "",
			numero: "",
			complemento: "",
			nomeContato: "",
			observacoes: "",
			details: "",
			options: null
		};

		$scope.local_retirada = item;
	};

	/**
	 * Esta função adiciona mais um objeto de local de entrega
	 */
	addMoreLocal = function() {
		var item = {
			endereco: "",
			numero: "",
			complemento: "",
			nomeContato: "",
			observacoes: "",
			details: "",
			options: null
		};

		locais_entrega.push(item);
		setTimeout(function(){
			var campos = document.querySelectorAll('.campos-alvos');
			Array.prototype.forEach.call(campos, function(element, i){
				element.addEventListener('change', function(e){
					return changedCampos(this)
				});
			})
		},500)
	}

	/**
	 * Esta função remove um objeto de local de entrega baseado em um indice
	 *
	 * @param {Integer} index - Posição do objeto no array de locais de entrega
	 */
	removeLocal = function(index) {
		// remove o objeto
		locais_entrega.splice(index, 1);
		// refaz a rota
		traceRoute();
	}

	function changedCampos(element) {
		if(element.value){
			element.classList.remove('error');
		}
	}

	/**
	 * Esta função cria a rota baseada no local de retirada e locais de entrega informados
	 */
	traceRoute = function() {
		setTimeout(function(){

			var campos = document.querySelectorAll('.campos-alvos');
			Array.prototype.forEach.call(campos, function(element, i){
				element.addEventListener('change', function(e){
					return changedCampos(this)
				});
			})

			// pega o endereço de retirada
			var enderecoPartida = local_retirada.endereco;
			// pega o ultimo endereço de entrega
			var enderecoChegada = locais_entrega[locais_entrega.length-1].endereco;

			// prepara o objeto de requisição de rota
			var request = {
				origin: enderecoPartida,
				destination: enderecoChegada,
				travelMode: google.maps.TravelMode.DRIVING
			};

			console.log(request);

			// verifica se existem pontos de parada no meio do caminho
			if(locais_entrega.length > 1) {
				var wp = [];

				// percorro o array de locais de entrega
				$.each(locais_entrega, function(i, item) {
					// se o indice atual do laço for diferente do ultimo do array...
					if(i != (locais_entrega.length-1)) {
						// guardo o endereço
						wp.push({location: item.endereco});
					}
				});

				// adiciono a propriedade 'waypoints' no objeto de
				// requisição de rota com todos os pontos de parada
				request.waypoints = wp;
			}

			// faz a requisiço da rota para o google maps
			directionsService.route(request, function(result, status) {
				// caso o google maps consiga identificar a rota...
				if (status == google.maps.DirectionsStatus.OK) {
					// renderiza a rota no mapa
					directionsDisplay.setDirections(result);
					// calcula o percurso da rota
					calculateDistance(result);
				}
			});
		},500)
	}

	checkCampos = function(indice){
		
		if(indice){
			if(locais_entrega[(indice-1)].endereco){
				locais_entrega[(indice-1)].endereco_error = false;
			}

			if(locais_entrega[(indice-1)].numero){
				locais_entrega[(indice-1)].numero_error = false;
			}

			if(locais_entrega[(indice-1)].nomeContato){
				locais_entrega[(indice-1)].nomeContato_error = false;
			}
				
			return;
		}

		if(local_retirada.endereco){
			local_retirada.endereco_error = false;
		}

		if(local_retirada.numero){
			local_retirada.numero_error = false;
		}

		if(local_retirada.nomeContato){
			local_retirada.nomeContato_error = false;
		}
	}
	
	
	function validaCampos(campos){
		
		var rejected = 0;
		Array.prototype.forEach.call(campos, function(element, i){
			if(!element.value){
				element.classList.add('error');
				rejected = true;
			}	
		})
        

		if(!local_retirada.numero){
			local_retirada.numero_error = true;
			rejected = true;
		}

		if(!local_retirada.nomeContato){
			local_retirada.nomeContato_error = true;
			rejected = true;
		}

		locais_entrega.forEach(function(local){

			if(!local.numero){
				local.numero_error = true;
				rejected = true;
			}

			if(!local.nomeContato){
				local.nomeContato_error = true;
				rejected = true;
			}
		})


		if(rejected){
			return false;
		}

		return true;
	}
	
});
