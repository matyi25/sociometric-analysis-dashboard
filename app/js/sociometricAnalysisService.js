sociometricAnalysisApp.factory("SociometricAnalysis", function ($resource, $filter, $timeout, $q, $cookieStore) {
	var isLoggedIn = false;
	var userInfo = {};
	var backendBaseUrl = "http://localhost:3000/";
	var inputDataInfo = {};


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

	this.getInputDataInfo = function() {
		return inputDataInfo;
	}

	this.setInputDataInfo = function(data) {
		inputDataInfo = data;
	}

	this.backendGetChannels = $resource(backendBaseUrl+"channels");

	return this;
});
