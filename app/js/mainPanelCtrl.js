sociometricAnalysisApp.controller('MainPanelCtrl', function($scope, $http, $location, $rootScope, $mdSidenav, $mdToast, $mdDialog, socialLoginService, SociometricAnalysis) {
	var activeContent = "default.html";
	var activeChartId = undefined;

	// move to different controller
    $scope.userAnalysisData = {
        nodes: new vis.DataSet(),
        edges: new vis.DataSet()
    };
    $scope.userAnalysisOptions = {

    };

    $scope.userAnalysisData.nodes.add([
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'}]);

    $scope.userAnalysisData.edges.add([
        {id: 1, from: 1, to: 2},
        {id: 2, from: 3, to: 2}
    ]);

	$scope.channelAnalysisData = [];
	$scope.channelAnalysisLabels = [];
	$scope.channelAnalysisName = [];
	$scope.channelAnalysisOptions = {
		legend: {
			display: true
		},
		title: {
            display: true,
            text: 'Channel analysis'
        }
	};

	var logout = function() {
		$rootScope.$broadcast("loadingEvent",true);
		socialLoginService.logout();
		$location.path('/login');
	}

	$scope.getUserInfo = function() {
		return SociometricAnalysis.getUserInfo();
	}

	$scope.onMenuClick = function(link) {
		if(link=='logout') {
			logout();
		}
		else {
			activeContent = link+".html";
		}
	}

	$scope.toggleSidenav = function(menu) {
		$mdSidenav(menu).toggle();
	}

	$scope.loading = function (condition) {
		$rootScope.$broadcast("loadingEvent",condition);
	}

	$scope.getInclude = function() {
		return 'partials/'+ activeContent;
	}

	$scope.getAnalysis = function(id, key) {
		if(id == 0) {
			activeContent = 'channel-analysis.html';
			if($scope.channelAnalysisData.length == 0 && $scope.channelAnalysisLabels.length == 0 && $scope.channelAnalysisName.length == 0) {
				$scope.loading(true);
				SociometricAnalysis.backendGetChannels.get(function(data) {
					SociometricAnalysis.setChannelsData(data);

					$scope.channelAnalysisLabels = data[key]['x'];
					$scope.channelAnalysisData = [data[key]['y']];
					$scope.channelAnalysisName = [key + " - " + data[key]['users'] + ' users'];
					$scope.loading(false);
				})
			}
			else {
				$scope.channelAnalysisLabels = SociometricAnalysis.getChannelsData()[key]['x'];
				$scope.channelAnalysisData = [SociometricAnalysis.getChannelsData()[key]['y']];
				$scope.channelAnalysisName = [key + " - " + SociometricAnalysis.getChannelsData()[key]['users'] + ' users'];
			}
		}
		if(id == 1) {
			activeContent = 'user-analysis.html';
		}
	}

	$scope.onSubmit = function(files)	{
		$scope.loading(true);

		$scope.channelAnalysisData = [];
		$scope.channelAnalysisLabels = [];
		$scope.channelAnalysisName = [];

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
					$scope.data.dataMenu.forEach(function cb(element, index, array) {
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
		mainMenu: [{
			name: 'Start new analysis process',
			link: 'upload',
			icon: 'create'
		}, {
			name: 'Browse old analysis processes',
			link: 'browse',
			icon: 'filter_list'
		}, {
			name: 'Logout',
			link: 'logout',
			icon: 'power_settings_new'
		}],
		dataMenu: [{
			name: 'Channels',
			id: 0,
			expand: false,
			actions: undefined
		  }, {
			name: 'Users',
			id: 1,
			expand: false,
			actions: undefined
		}],
		analysisMenu: [{
			name: 'Back',
			message: 'Back',
			icon: 'undo',
			link: 'analysis'
		}]
	}
});