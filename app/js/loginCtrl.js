sociometricAnalysisApp.controller('LoginCtrl', function ($scope, $rootScope, $timeout, socialLoginService, SociometricAnalysis) {
	$scope.username = "A";
	$scope.password = "B";
	
	$rootScope.$on('event:social-sign-in-success', function(event, userDetails){
		 $timeout(function() {
            SociometricAnalysis.setIsLoggedIn(true);
			SociometricAnalysis.setUserInfo(userDetails);
        }, 500);
	})

	$rootScope.$on('event:social-sign-out-success', function(event, logoutStatus){
		console.log(logoutStatus)
		if(SociometricAnalysis.getIsLoggedIn()){
			$rootScope.$broadcast("loadingEvent",false);
        	SociometricAnalysis.setIsLoggedIn(false);
			SociometricAnalysis.setUserInfo({});	
        }
	})
});