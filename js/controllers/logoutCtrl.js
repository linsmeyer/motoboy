angular.module('motoboy').controller('logoutCtrl',
		function ($scope,$location, $rootScope, configUrl){
			$rootScope.user = "";
			$scope.user = "";

			localStorage.removeItem('token');
			
			
			window.location ='http://disqmotoboy.com.br';
				

			

	});
