var sociometricAnalysisApp = angular.module('sociometricAnalysis', ['ngRoute', 'ngResource', 'ngMaterial', 'ngMessages',
  'ngCookies', 'socialLogin', 'lfNgMdFileInput'])
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
		//socialProvider.setFbKey({appId: "YOUR FACEBOOK APP ID", apiVersion: "API VERSION"})

	}
]);
