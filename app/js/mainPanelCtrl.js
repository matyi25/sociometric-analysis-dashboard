sociometricAnalysisApp.controller('MainPanelCtrl', function($scope, $rootScope, $mdSidenav, $mdToast) {
	var activeContent = "default.html";
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

	$scope.onSubmit = function(){
		var formData = new FormData();
		angular.forEach($scope.files,function(obj){
			if(!obj.isRemote){
				formData.append('files[]', obj.lfFile);
			}
		});
		console.log(formData);
		/*
		$http.post('./upload', formData, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).then(function(result){
			// do sometingh                   
		},function(err){
			// do sometingh
		});*/
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