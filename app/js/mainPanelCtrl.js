sociometricAnalysisApp.controller('MainPanelCtrl', function($scope, $http, $location, $timeout, $rootScope, $mdDialog, socialLoginService, SociometricAnalysis) {
	
	if(!SociometricAnalysis.getIsLoggedIn()) {
		$location.path("/login");
	}

	var newUpload = false;
	var savedAnalysisDataIds = [];
	var daysArray = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
	var activeContent = "default.html";
	var activeChartId = undefined;

	// --- User Analysis ---
	var userAnalysisSelectedData = [];
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
		}
	};

	// --- Reaction Time Analysis: channel list ---
	$scope.reactionTimeUserAnalysisData = [];
	$scope.reactionTimeUserAnalysisLabels = [];
	$scope.reactionTimeUserAnalysisName = [];

	$scope.reactionTimeUserAnalysisOptions = {
		legend: {
			display: true
		}
	};

	var logout = function() {
		clearData();
		$rootScope.$broadcast("loadingEvent",true);
		socialLoginService.logout();
		$location.path('/login');
	}

	var browse = function(link) {
		var uid = SociometricAnalysis.getUserInfo().uid;
		$rootScope.$broadcast("loadingEvent",true);

		SociometricAnalysis.backendGetSavedAnalysisDataIds.query({"userId": uid},function(data) {
			savedAnalysisDataIds = data; 
			activeContent = link+".html";
			$scope.loading(false);
		});
	}

	var compareKeys = function(a, b) {
		var aKeys = Object.keys(a).sort();
		var bKeys = b.sort();
		return JSON.stringify(aKeys) === JSON.stringify(bKeys);
	}

	var fillAnalysisMenuActions = function(channels, users) {
		$scope.data.dataMenu.forEach(function cb(element, index, array) {
			switch(element.id){
				case 0: element.actions = channels; break;
				case 1: element.actions = daysArray; break;
				case 2: element.actions = users; break;
			}
		});
	}

	var clearData = function() {
		SociometricAnalysis.setChannelAnalysisData(undefined);
		SociometricAnalysis.setUserAnalysisData(undefined);
		SociometricAnalysis.setReactionTimeAnalysisData(undefined);
		SociometricAnalysis.setChannels(undefined);
		SociometricAnalysis.setUsers(undefined);
		userAnalysisSelectedData = [];
	}

	$scope.getSavedAnalysisDataIds = function() {
		return savedAnalysisDataIds;
	}

	$scope.getUserInfo = function() {
		return SociometricAnalysis.getUserInfo();
	}

	$scope.getInclude = function() {
		return 'partials/'+ activeContent;
	}

	$scope.getUserAnalysisSelectedData = function() {
		return userAnalysisSelectedData;
	};

	$scope.getSavedAnalysisData = function(id) {
		$scope.loading(true);
		var uid = SociometricAnalysis.getUserInfo().uid;

		SociometricAnalysis.backendGetSavedAnalysisData.get({"userId": uid, "id": id},function(data) {
			var analysisData = data["data"];
			SociometricAnalysis.setChannels(analysisData[3]["channels"]);
			SociometricAnalysis.setUsers(analysisData[3]["users"]);
			fillAnalysisMenuActions(analysisData[3]["channels"],analysisData[3]["users"]);

			SociometricAnalysis.setChannelAnalysisData(analysisData[0]);
			SociometricAnalysis.setUserAnalysisData(analysisData[1]);
			SociometricAnalysis.setReactionTimeAnalysisData(analysisData[2]);

			activeContent = "analysis.html";
			$scope.loading(false);
		});
	}

	$scope.deleteSavedAnalysisData = function(id) {
		var uid = SociometricAnalysis.getUserInfo().uid;

		var confirmDeletion = $mdDialog.confirm()
		  .title('Do you really want us to delete your data?')
		  .textContent('Your data with saved id: '+ id)
		  .ariaLabel('Data deletion')
		  .ok('Please do it!')
		  .cancel('No, thanks');

		$mdDialog.show(confirmDeletion).then(function() {
			SociometricAnalysis.backendDeleteSavedAnalysisData.delete({"id":id, "userId":uid }, function(data){
				if(data.resp != "OK") {
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element(document.querySelector('#general-view')))
							.clickOutsideToClose(true)
							.title('ERROR WHILE DELETING DATA IN DB')
							.textContent('The data deleting in the DB was unsuccessful due to an error. Pleas try again.')
							.ariaLabel('Alert')
							.ok('Got it!')
					);
				} else {
					var temp = [];
					for (var i = 0; i < savedAnalysisDataIds.length; i++) {
						if(savedAnalysisDataIds[i] != id) {
							temp.push(savedAnalysisDataIds[i]);
						}
					}
					savedAnalysisDataIds = temp;
				}
			});
		});
	}

	$scope.onMainMenuClick = function(link) {
		if(link=='logout') {
			logout();
		}
		else if (link=="browse") {
			browse(link);
		}
		else {
			activeContent = link+".html";
		}
	}

	$scope.onSubMenuClick = function (ev, link) {
		if (link == 'back') {
			if (activeContent == 'default.html' || activeContent == 'browse.html') {
				activeContent = 'default.html';
			} else if (activeContent == 'reaction-time-analysis-drilldown.html') {
				activeContent = 'reaction-time-analysis.html';
			} else {
				activeContent = 'analysis.html';
			}
		} else if (link == 'save') {
			var uid = SociometricAnalysis.getUserInfo().uid;

			if (!newUpload){
				$mdDialog.show(
					$mdDialog.alert()
						.parent(angular.element(document.querySelector("#general-view")))
						.clickOutsideToClose(true)
						.title("ERROR")
						.textContent("You haven't uploaded a new file yet. You can save the process after you have uploaded a new file. You cannot save already saved data.")
						.ariaLabel("Alert")
						.ok("Got it!")
				);
			} else {
				    var dialog = $mdDialog.prompt()
				    	.parent(angular.element(document.querySelector("#general-view")))
				    	.title('Save analysis data')
				    	.textContent('What is the name you would want to save your data?')
				    	.placeholder('Data name')
				    	.ariaLabel('Data name')
				    	.initialValue('')
				    	.targetEvent(ev)
				    	.ok('Save it!')
				    	.cancel('Cancel');

				$mdDialog.show(dialog)
					.then(function(id) {
						$scope.loading(true);
						SociometricAnalysis.backendSaveAnalysisData.save({"userId": uid}, {"id": id} ,function(data) {
							$scope.loading(false);

							if(data['status'] == 'exists') {
								$mdDialog.show(
									$mdDialog.alert()
										.parent(angular.element(document.querySelector("#general-view")))
										.clickOutsideToClose(true)
										.title("ERROR")
										.textContent("The name for the analysis data already exists in the DB. Please pick a different one.")
										.ariaLabel("Alert")
										.ok("Got it!")
								);
							} else if (data['status'] == 'error') {
								$mdDialog.show(
									$mdDialog.alert()
										.parent(angular.element(document.querySelector("#general-view")))
										.clickOutsideToClose(true)
										.title("ERROR")
										.textContent("There was an error during the data saving to the database. Please try again later")
										.ariaLabel("Alert")
										.ok("Got it!")
								);
							}
						});
					}, function() {
					
				});
			}
		}
	}

	$scope.loading = function (condition) {
		$rootScope.$broadcast("loadingEvent",condition);
	}

	$scope.getAnalysis = function(id, key) {
		var uid = SociometricAnalysis.getUserInfo().uid;

		if(id == 0) {
			activeContent = 'channel-analysis.html';
			if(SociometricAnalysis.getChannelAnalysisData() == undefined) {
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
			if(SociometricAnalysis.getUserAnalysisData() == undefined) {
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

			if(SociometricAnalysis.getReactionTimeAnalysisData() == undefined) {
				
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
		clearData();
		newUpload = true;

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
				if(result.status == 200) {
					SociometricAnalysis.setChannels(result.data.channels);
					SociometricAnalysis.setUsers(result.data.users);

					fillAnalysisMenuActions(aresult.data.channels,result.data.users);
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
			var tempEdge = {};
			tempEdge['from'] = $scope.userAnalysisData['nodes']['_data'][$scope.userAnalysisData['edges']['_data'][properties.edges[i]]['from']]['label'];
			tempEdge['to'] = $scope.userAnalysisData['nodes']['_data'][$scope.userAnalysisData['edges']['_data'][properties.edges[i]]['to']]['label'];
			tempEdge['value'] = $scope.userAnalysisData['edges']['_data'][properties.edges[i]]['value'];

			tempList.push(tempEdge);
		}
		$timeout(function() {
			userAnalysisSelectedData = tempList;
		}, 100);
	};

	$scope.onChartClick = function(evt) {
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
			link: 'back'
		},
		{
			name: 'Save',
			message: 'Save',
			icon: 'save',
			link: 'save'
		}]
	}
});