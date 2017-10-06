sociometricAnalysisApp.controller('LoginCtrl', function ($scope, $rootScope, $timeout, $location, socialLoginService, SociometricAnalysis) {
	$rootScope.$on('event:social-sign-in-success', function(event, userDetails){
		 $timeout(function() {
            SociometricAnalysis.setIsLoggedIn(true);
			SociometricAnalysis.setUserInfo(userDetails);
			$location.path('/home');
        }, 500);
	})

	$rootScope.$on('event:social-sign-out-success', function(event, logoutStatus){
		if(SociometricAnalysis.getIsLoggedIn()){
			$rootScope.$broadcast("loadingEvent",false);
        	SociometricAnalysis.setIsLoggedIn(false);
			SociometricAnalysis.setUserInfo({});	
        }
	})
});