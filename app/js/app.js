var sociometricAnalysisApp = angular.module('sociometricAnalysis', ['ngRoute', 'ngResource', 'ngMaterial', 'ngMessages',
  'ngCookies', 'socialLogin', 'lfNgMdFileInput', 'chart.js'])
 .config(['$routeProvider','$mdThemingProvider', 'socialProvider',
	function($routeProvider, $mdThemingProvider, socialProvider) {
		$routeProvider.
			when('/login', {
				templateUrl: 'partials/login.html',
				controller: 'LoginCtrl'
			}).
			when('/home', {
				templateUrl: 'partials/home.html'
			}).
			otherwise({
				redirectTo: '/login'
			});

		$mdThemingProvider.theme('default').primaryPalette('indigo');
		socialProvider.setGoogleKey("500653865250-h3a2fe2r7nhc3j7hd288516sqvspl8t3.apps.googleusercontent.com");
		//socialProvider.setLinkedInKey("YOUR LINKEDIN CLIENT ID");
		socialProvider.setFbKey({appId: "1712936775385607", apiVersion: "v2.10"})

	}
]);

sociometricAnalysisApp.directive('visNetwork', function() {
	return {
		restrict: 'E',
		require: '^ngModel',
		scope: {
			ngModel: '=',
			onSelect: '&',
			options: '='
		},
		link: function(scope, element, attrs) {
			var network = new vis.Network(element[0], scope.ngModel, scope.options || {});

            network.on('select', function(params) {
         		scope.onSelect({properties: params});
			});
			scope.$watch('ngModel',function(newValue) {
				network.setData(newValue);
    		});
		}
	}
});
