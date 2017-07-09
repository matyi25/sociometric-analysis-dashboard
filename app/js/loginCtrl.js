sociometricAnalysisApp.controller('LoginCtrl', function ($scope, $rootScope, socialLoginService, SociometricAnalysis) {
	$scope.username = "A";
	$scope.password = "B";
	
	$rootScope.$on('event:social-sign-in-success', function(event, userDetails){
		console.log(userDetails)
	})

	$rootScope.$on('event:social-sign-out-success', function(event, logoutStatus){

	})

	//socialLoginService.logout()
	
});