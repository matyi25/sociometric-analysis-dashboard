sociometricAnalysisApp.controller('SidebarCtrl', function ($scope, $mdSidenav, $mdToast, $rootScope, socialLoginService, SociometricAnalysis) {
	$scope.getUserInfo = function() {
		return SociometricAnalysis.getUserInfo();
  	}

	$scope.toast = function(message) {
		var toast = $mdToast.simple().content('You clicked ' + message).position('bottom right');
		$mdToast.show(toast);
	};

	$scope.logout = function() {
		$rootScope.$broadcast("loadingEvent",true);
		socialLoginService.logout();
	}
	
	$scope.data = {
	sidenav: {
	  sections: [{
		name: 'Start new analysis process',
		expand: false,
		actions: [{
		  name: 'Upload the data file',
		  icon: 'settings',
		  link: 'Action 1'
		}]
	  }, {
		name: 'Completed analysis processes',
		expand: false,
		actions: [{
		  name: 'List available analysis processes',
		  icon: 'settings',
		  link: 'Action 3'
		}]
	  }]
	}
  }

	
});