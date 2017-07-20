sociometricAnalysisApp.controller('MainPanelCtrl', function($scope, $http, $location, $rootScope, $mdSidenav, $mdToast, $mdDialog, socialLoginService, SociometricAnalysis) {
	var activeContent = "default.html";

	$scope.barLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
	$scope.barSeries = ['Series A', 'Series B'];

	$scope.barData = [
		[65, 59, 80, 81, 56, 55, 40],
		[28, 48, 40, 19, 86, 27, 90]
	];

	$scope.barOptions = {
		legend: {
			display: true
		}
	};

	$scope.getUserInfo = function() {
		return SociometricAnalysis.getUserInfo();
	}

	$scope.onMenuClick = function(link) {
		if(link=='logout') {
			logout();
		}
		else {
			activeContent = link;
		}
	}

	var logout = function() {
		$rootScope.$broadcast("loadingEvent",true);
		socialLoginService.logout();
		$location.path('/login');
	}

	$scope.toggleSidenav = function(menu) {
		$mdSidenav(menu).toggle();
	}
	$scope.toast = function(message) {
		var toast = $mdToast.simple().content('You clicked ' + message).position('bottom right');
		$mdToast.show(toast);
	};
	$scope.toastList = function(message) {
		var toast = $mdToast.simple().content('You clicked ' + message + ' having selected ' + $scope.selected.length + ' item(s)').position('bottom right');
		$mdToast.show(toast);
	};
	$scope.toggle = function(item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) list.splice(idx, 1);
		else list.push(item);
	};
	$scope.loading = function (condition) {
		$rootScope.$broadcast("loadingEvent",condition);
	}

	$scope.getInclude = function() {
		return 'partials/'+ activeContent;
	}

	$scope.onSubmit = function(files)	{
		$scope.loading(true);

		var formData = new FormData();
		var uid = SociometricAnalysis.getUserInfo().uid;

		if(!files[0].isRemote){
			formData.append('files[]', files[0].lfFile);
		}
		$http.post('http://localhost:3000/upload/'+uid, formData, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
		}).then(function(result) {
				$scope.loading(false)
				if(result.status == 200) {
					$scope.data.analysis.sections.forEach(function cb(element, index, array) {
						switch(element.id){
							case 0: element.actions = result.data.channels; break;
							case 1: element.actions = result.data.users; break;
						}
					});
					SociometricAnalysis.setInputDataInfo(result.data);
					activeContent = "analysis.html";
				} else {
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element(document.querySelector("#general-view")))
							.clickOutsideToClose(true)
							.title("ERROR WHILE UPLOADING")
							.textContent("Wrong input data format. Check the documentation for correct format and try reuploading correct file format.")
							.ariaLabel("Alert")
							.ok("Got it!")
					);
				}                   
			}, function(err) {
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element(document.querySelector("#general-view")))
							.clickOutsideToClose(true)
							.title("ERROR WHILE UPLOADING")
							.textContent("There has been an error while uploading the file, try again later: " + err.toString())
							.ariaLabel("Alert")
							.ok("Got it!")
				);
			}
		);
	};


	$scope.data = {
		toolbar: {
			menus: [{
				name: 'Menu',
				icon: 'message',
				width: '4',
				actions: [{
					name: 'Start new analysis process',
					link: 'upload.html',
					icon: 'create'
				}, {
					name: 'Browse old analysis processes',
					link: 'browse.html',
					icon: 'filter_list'
				}, {
					name: 'Logout',
					link: 'logout',
					icon: 'power_settings_new'
				}]
			}]
		}, 
		analysis: {
		  sections: [{
			name: 'Channels',
			id: 0,
			expand: false,
			actions: undefined
		  }, {
			name: 'Users',
			id: 1,
			expand: false,
			actions: undefined
		  }]
		},
		content: {
			lists: [{
				name: 'Dashboard',
				menu: {
					name: 'Menu 1',
					icon: 'settings',
					width: '4',
					actions: [{
						name: 'Action 1',
						message: 'Action 1',
						completed: true,
						error: true
					}]
				}
			}]
		}
	}
});