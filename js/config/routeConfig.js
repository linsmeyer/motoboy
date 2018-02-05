angular.module("motoboy").config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when("/os", {
		templateUrl: "view/os.html",
		controller: "osCtrl",
		resolve: {
			credenciais: function (credenciaisAPI) {
				return credenciaisAPI.getCredenciais();
			}			
		}
	});
	$routeProvider.when("/osAdmin", {
		templateUrl: "view/osAdmin.html",
		controller: "osAdminCtrl",
		resolve: {
			credenciais: function (credenciaisAPI) {
				return credenciaisAPI.getCredenciais();
			}			
		}
	});
	$routeProvider.when("/osPagamentos", {
		templateUrl: "view/osPagamentos.html",
		controller: "osPagamentosCtrl",
		resolve: {
			credenciais: function (credenciaisAPI) {
				return credenciaisAPI.getCredenciais();
			}			
		}
	});
	$routeProvider.when("/osPrestacao", {
		templateUrl: "view/osPrestacao.html",
		controller: "osPrestacaoCtrl",
		resolve: {
			credenciais: function (credenciaisAPI) {
				return credenciaisAPI.getCredenciais();
			}			
		}
	});
	$routeProvider.when("/osAltera", {
		templateUrl: "view/osAltera.html",
		controller: "osAlteraCtrl",
		resolve: {
			credenciais: function (credenciaisAPI) {
				return credenciaisAPI.getCredenciais();
			}			
		}
	});
	$routeProvider.when("/userCan", {
		templateUrl: "view/userCan.html",
		controller: "userCanCtrl",
		resolve: {
			credenciais: function (credenciaisAPI) {
				return credenciaisAPI.getCredenciais();
			}			
		}
	});
	$routeProvider.when("/indicacoes", {
		templateUrl: "view/indicacoes.html",
		controller: "indicacoesCtrl",
		resolve: {
			credenciais: function (credenciaisAPI) {
				return credenciaisAPI.getCredenciais();
			}			
		}
	});
	$routeProvider.when("/logout/", {
		templateUrl: "view/empty.html",
		controller: "logoutCtrl"
	});
	$routeProvider.when("/os-detalhes/:id", {
		templateUrl: "view/osDetalhes.html",
		controller: "osDetalhesCtrl",
		resolve: {
			credenciais: function (credenciaisAPI) {
				return credenciaisAPI.getCredenciais();
			}			
		}
	});
	$routeProvider.when("/confirmar-email/:code", {
		templateUrl: "view/confirmEmail.html",
		controller: "confirmEmailCtrl"
	});
	$routeProvider.when("/recuperar-senha/:code", {
		templateUrl: "view/recuperar-senha.html",
		controller: "recuperarSenhaCtrl"
	});
	$routeProvider.when("/guess/", {
		templateUrl: "view/guess.html",
		controller: "unAuthCtrl"
	});

	$routeProvider.otherwise({redirectTo: "/guess"});



	
}]);

angular.module("motoboy").config(function ($httpProvider){
		$httpProvider.interceptors.push('authInterceptor');
});
