sociometricAnalysisApp.controller('LoginCtrl', function ($scope,$mdDialog, $interval, SociometricAnalysis) {
	if(SociometricAnalysis.getIsLoggedIn()) {
		$mdDialog.show({
			  contentElement: '#login-dialog',
			  parent: angular.element(document.body),
			  targetEvent: ev
			});
	}
	else {
		$mdDialog.hide();
	}


	$scope.username = "A";
	$scope.password = "B";
	
	$scope.login = function() {

	}

	$scope.close = function() {

	}

	
});