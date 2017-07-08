var sociometricAnalysisApp = angular.module('sociometricAnalysis', ['ngRoute', 'ngResource', 'ngMaterial', 'ngMessages',
 'material.svgAssetsCache', 'ngCookies'])
 .config(['$routeProvider',
	function($routeProvider) {
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
	}
]);

/*sociometricAnalysisApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default').primaryPalette('indigo');
})*/