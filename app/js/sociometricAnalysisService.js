sociometricAnalysisApp.factory("SociometricAnalysis", function ($resource, $filter, $timeout, $q, $cookieStore) {
	var isLoggedIn = false;
	var userInfo = {};


	this.getIsLoggedIn = function() {
		return isLoggedIn;
	}

	this.setIsLoggedIn = function(state) {
		isLoggedIn = state;
	}

	this.getUserInfo = function() {
		return userInfo;
	}

	this.setUserInfo = function(data) {
		userInfo = data;
	}

	return this;
});
