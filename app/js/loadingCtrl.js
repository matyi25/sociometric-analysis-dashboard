sociometricAnalysisApp.controller('LoadingCtrl', function ($scope, $rootScope,$mdDialog, SociometricAnalysis) {
	$rootScope.$on("loadingEvent",function(ev, isOn) {
		if(isOn) {
			$mdDialog.show({
			  contentElement: '#loadingDialog',
			  parent: angular.element(document.body),
			  targetEvent: ev
			});
		}
		else {
			$mdDialog.hide();
		}
	});
});