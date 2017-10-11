sociometricAnalysisApp.controller('MainPanelCtrl', function($scope, $http, $location, $timeout, $rootScope, $mdSidenav, $mdToast, $mdDialog, socialLoginService, SociometricAnalysis) {
	
	var daysArray = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
	var activeContent = "default.html";
	var activeChartId = undefined;

	// --- User Analysis ---
	var userAnalysisSelectedData = {};
	$scope.userAnalysisStats = {};
    $scope.userAnalysisData = {};
    $scope.userAnalysisOptions = {
    	edges:{
		    arrows: {
		      to:     {enabled: true, scaleFactor:1, type:'arrow'},
		    },
		    dashes: true
		}
    };

    // --- Channel Analysis ---
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

	// --- Reaction Time Analysis: Users medians ---
	$scope.reactionTimeMediansActiveUser = undefined
	$scope.reactionTimeMediansAnalysisData = [];
	$scope.reactionTimeMediansAnalysisLabels = [];
	$scope.reactionTimeMediansAnalysisName = [];

	$scope.reactionTimeMediansAnalysisOptions = {
		legend: {
			display: true
		},
		title: {
            display: true,
            text: 'Users reaction time analysis: medians'
        }
	};

	// --- Reaction Time Analysis: channel list ---
	$scope.reactionTimeUserAnalysisData = [];
	$scope.reactionTimeUserAnalysisLabels = [];
	$scope.reactionTimeUserAnalysisName = [];

	$scope.reactionTimeUserAnalysisOptions = {
		legend: {
			display: true
		},
		title: {
            display: true,
            text: 'User reaction time analysis'
        }
	};


	var logout = function() {
		$rootScope.$broadcast("loadingEvent",true);
		socialLoginService.logout();
		$location.path('/login');
	}

	var compareKeys = function(a, b) {
		var aKeys = Object.keys(a).sort();
		var bKeys = b.sort();
		return JSON.stringify(aKeys) === JSON.stringify(bKeys);
	}

	$scope.getUserInfo = function() {
		return SociometricAnalysis.getUserInfo();
	}

	$scope.onMainMenuClick = function(link) {
		if(link=='logout') {
			logout();
		}
		else {
			activeContent = link+".html";
		}
	}

	$scope.onSubMenuClick = function (link) {
		if (activeContent == 'default.html') {
			activeContent = 'default.html';
		} else if (activeContent == 'reaction-time-analysis-drilldown.html') {
			activeContent = 'reaction-time-analysis.html';
		} else {
			activeContent = 'analysis.html';
		}
	}

	$scope.loading = function (condition) {
		$rootScope.$broadcast("loadingEvent",condition);
	}

	$scope.getInclude = function() {
		return 'partials/'+ activeContent;
	}

	$scope.getAnalysis = function(id, key) {
		var uid = SociometricAnalysis.getUserInfo().uid;
		if(id == 0) {
			activeContent = 'channel-analysis.html';
			if($scope.channelAnalysisData.length == 0 && $scope.channelAnalysisLabels.length == 0 && $scope.channelAnalysisName.length == 0) {
				$scope.loading(true);
				SociometricAnalysis.backendGetChannelAnalysis.get({"userId": uid}, function(data) {
					SociometricAnalysis.setChannelAnalysisData(data);

					$scope.channelAnalysisLabels = data[key]['x'];
					$scope.channelAnalysisData = [data[key]['y']];
					$scope.channelAnalysisName = [key + " - " + data[key]['users'] + ' users'];
					$scope.loading(false);
				})
			}
			else {
				$scope.channelAnalysisLabels = SociometricAnalysis.getChannelAnalysisData()[key]['x'];
				$scope.channelAnalysisData = [SociometricAnalysis.getChannelAnalysisData()[key]['y']];
				$scope.channelAnalysisName = [key + " - " + SociometricAnalysis.getChannelAnalysisData()[key]['users'] + ' users'];
			}
		}
		if(id == 1) {
			if(angular.equals({}, $scope.userAnalysisData)) {
				$scope.loading(true);
				SociometricAnalysis.backendGetUserAnalysis.get({"userId": uid}, function(data) {
				 	SociometricAnalysis.setUserAnalysisData(data);

				 	$scope.userAnalysisStats['title'] = key;
				 	$scope.userAnalysisStats['stats'] = data[key]['stats'];

					$scope.userAnalysisData['nodes'] = new vis.DataSet();
					$scope.userAnalysisData['nodes'].add(data[key]['graph']['nodes']);

					$scope.userAnalysisData['edges'] = new vis.DataSet();
					$scope.userAnalysisData['edges'].add(data[key]['graph']['links']);
					
					$scope.loading(false);
					activeContent = 'user-analysis.html';
				})
			}
			else {
			 	$scope.userAnalysisStats['title'] = key;
			 	$scope.userAnalysisStats['stats'] = SociometricAnalysis.getUserAnalysisData()[key]['stats'];

				$scope.userAnalysisData['nodes'] = new vis.DataSet();
				$scope.userAnalysisData['nodes'].add(SociometricAnalysis.getUserAnalysisData()[key]['graph']['nodes']);

				$scope.userAnalysisData['edges'] = new vis.DataSet();
				$scope.userAnalysisData['edges'].add(SociometricAnalysis.getUserAnalysisData()[key]['graph']['links']);
				activeContent = 'user-analysis.html';
			}
		}
		if(id == 2) {
			$scope.reactionTimeMediansActiveUser = key;
			$scope.reactionTimeMediansAnalysisName = [key +  ' user median'];
			activeContent = 'reaction-time-analysis.html';

			if($scope.reactionTimeMediansAnalysisLabels.length == 0 && $scope.reactionTimeMediansAnalysisData.length == 0 ) {
				
				$scope.loading(true);
				SociometricAnalysis.backendGetReactionTimeAnalysis.get({"userId": uid}, function(data) {
				 	SociometricAnalysis.setReactionTimeAnalysisData(data);

				 	$scope.reactionTimeMediansAnalysisLabels = data['medians'][key]['x'];
					$scope.reactionTimeMediansAnalysisData = [data['medians'][key]['y']];
					$scope.loading(false);
				})
			}
			else {
				$scope.reactionTimeMediansAnalysisLabels = SociometricAnalysis.getReactionTimeAnalysisData()['medians'][key]['x'];
				$scope.reactionTimeMediansAnalysisData = [SociometricAnalysis.getReactionTimeAnalysisData()['medians'][key]['y']];
			}
		}

	}

	$scope.onSubmit = function(file)	{
		$scope.loading(true);

		$scope.channelAnalysisData = [];
		$scope.channelAnalysisLabels = [];
		$scope.channelAnalysisName = [];
		$scope.userAnalysisData = {};


		var formData = new FormData();
		var uid = SociometricAnalysis.getUserInfo().uid;

		if(!file[0].isRemote){
			formData.append('file', file[0].lfFile, uid + '.txt');
		}
		$http.post('http://localhost:3000/upload/' + uid, formData, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
		}).then(function(result) {
				$scope.loading(false)
				SociometricAnalysis.setChannels(result.data.channels);
				SociometricAnalysis.setUsers(result.data.users);
				if(result.status == 200) {
					$scope.data.dataMenu.forEach(function cb(element, index, array) {
						switch(element.id){
							case 0: element.actions = result.data.channels; break;
							case 1: element.actions = daysArray; break;
							case 2: element.actions = result.data.users; break;
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

	$scope.onNodeSelect = function(properties) {
		var tempList = [];
		for (var i = 0; i < properties.edges.length; i++) {
			var tempEdge = {}
			tempEdge['from'] = $scope.userAnalysisData['nodes']['_data'][$scope.userAnalysisData['edges']['_data'][i]['from']]['label'];
			tempEdge['to'] = $scope.userAnalysisData['nodes']['_data'][$scope.userAnalysisData['edges']['_data'][i]['to']]['label'];
			tempEdge['value'] = $scope.userAnalysisData['edges']['_data'][i]['value'];

			tempList.push(tempEdge);
		}
		$timeout(function() {
			userAnalysisSelectedData = tempList;
		}, 100);
    };

    $scope.onChartClick = function(evt) {
    	console.log(evt);
    	channelsData = SociometricAnalysis.getReactionTimeAnalysisData()['channels'];
    	for(var channel in channelsData) {
    		if(compareKeys(channelsData[channel],[evt[0]["_model"]["label"], $scope.reactionTimeMediansActiveUser])) {
    			$scope.reactionTimeUserAnalysisLabels = channelsData[channel][$scope.reactionTimeMediansActiveUser]['x'];
    			$scope.reactionTimeUserAnalysisData = [channelsData[channel][$scope.reactionTimeMediansActiveUser]['y']];
    			$scope.reactionTimeUserAnalysisName = ['Reaction time with user: ' + evt[0]["_model"]["label"] + ' for: ' + $scope.reactionTimeMediansActiveUser];
    			
    			$timeout(function() {
					activeContent = 'reaction-time-analysis-drilldown.html';
				}, 100);
    			break;
    		}
    	}
    };

    $scope.getUserAnalysisSelectedData = function() {
    	return userAnalysisSelectedData;
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
			name: 'Channel analysis',
			id: 0,
			expand: false,
			actions: undefined
		  }, {
			name: 'User analysis',
			id: 1,
			expand: false,
			actions: undefined
		}, {
			name: 'Users reaction time analysis',
			id: 2,
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