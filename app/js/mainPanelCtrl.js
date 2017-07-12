sociometricAnalysisApp.controller('MainPanelCtrl', function($scope, $http, $rootScope, $mdSidenav, $mdToast, SociometricAnalysis) {
	var activeContent = "default.html";

	$scope.barLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  	$scope.barSeries = ['Series A', 'Series B'];

  	$scope.barData = [
    	[65, 59, 80, 81, 56, 55, 40],
    	[28, 48, 40, 19, 86, 27, 90]
  	];



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
	$scope.loading = function () {
		$rootScope.$broadcast("loadingEvent",true);
	}

	$scope.getInclude = function() {
		return 'partials/'+ activeContent;
	}

	$rootScope.$on("activeContent",function(ev, content) {
		activeContent = content;
	});	

	$scope.onSubmit = function(files){
		var formData = new FormData();
		var uid = SociometricAnalysis.getUserInfo().uid;
		if(!files[0].isRemote){
			formData.append('files[]', files[0].lfFile);
		}
		$http.post('http://localhost:3000/upload/'+uid, formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
         }).then(function(result){
                // do sometingh                   
            },function(err){
                // do sometingh
        });
	};


	$scope.data = {
		title: 'Dashboard',
		toolbar: {
			menus: [{
				name: 'Menu 1',
				icon: 'message',
				width: '4',
				actions: [{
					name: 'Action 1',
					message: 'Action 1',
					completed: true,
					error: true
				}]
			}]
		},
		content: {
			lists: [{
				name: 'Main Panel',
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