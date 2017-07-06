var sociometricAnalysisApp = angular.module('sociometricAnalysis', ['ngRoute', 'ngResource', 'ngMaterial', 'ngMessages',
 'material.svgAssetsCache', 'ngCookies'])

sociometricAnalysisApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/home', {
				templateUrl: 'partials/home.html'
			}).
			otherwise({
				redirectTo: '/home'
			});
	}
]);
