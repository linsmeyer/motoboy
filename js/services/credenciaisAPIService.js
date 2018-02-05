angular.module("motoboy").service("credenciaisAPI", function ($location, $http, configUrl, $rootScope) {
	
	this.getCredenciais = function () {
		
		if(!(typeof localStorage.token == 'undefined' || localStorage.token == "")){
				
//		
				$http({
					method: 'GET',
					url:configUrl.baseUrl+'credentials-check',
					headers: {
						user_token: localStorage.token
					}
				}).success(function(data){
					if(!$rootScope.user)
					{
						$http({
							method: 'GET',
							url:configUrl.baseUrl+'get-user',
							headers: {
								user_token: localStorage.token
							}
						}).success(function(data){
							$rootScope.user = data;
							
							return $rootScope.user;
						}).error(function (data){
							// return $location.path('logout');
						});

					
					}
				})
				.error(function(data){
					
					//return $location.path('logout');

				});
			
	};
}
});

