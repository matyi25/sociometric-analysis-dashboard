sociometricAnalysisApp.factory("SociometricAnalysis", function ($resource, $filter, $timeout) {
	var isLoggedIn = false;
	var userInfo = undefined;
	var backendBaseUrl = "http://localhost:3000/";
	var channelAnalysisData = undefined;
	var userAnalysisData = undefined;
	var reactionTimeAnalysisData = undefined;
	var channels = undefined;
	var users = undefined;


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

	this.setChannelAnalysisData = function(data) {
		channelAnalysisData = data;
	}

	this.getChannelAnalysisData = function() {
		return channelAnalysisData;
	}

	this.setUserAnalysisData = function(data) {
		userAnalysisData = data;
	}

	this.getUserAnalysisData = function() {
		return userAnalysisData;
	}

	this.setReactionTimeAnalysisData = function (data) {
		reactionTimeAnalysisData = data;
	}

	this.getReactionTimeAnalysisData = function () {
		return reactionTimeAnalysisData;
	}

	this.setChannels = function(data) {
		channels = data;
	}

	this.getChannels = function() {
		return channels;
	}

	this.setUsers = function(data) {
		users = data;
	}

	this.getUsers = function() {
		return users;
	}	

	this.backendGetChannelAnalysis = $resource(backendBaseUrl+"channelAnalysis/:userId");
	this.backendGetUserAnalysis = $resource(backendBaseUrl+"userAnalysis/:userId");
	this.backendGetReactionTimeAnalysis = $resource(backendBaseUrl+"reactionTimeAnalysis/:userId");
	this.backendSaveAnalysisData = $resource(backendBaseUrl+"saveAnalysisData/:userId");
	this.backendGetSavedAnalysisDataIds = $resource(backendBaseUrl+"savedAnalysisDataIds/:userId");
	this.backendGetSavedAnalysisData = $resource(backendBaseUrl+"savedAnalysisData/:userId/:id");
	this.backendDeleteSavedAnalysisData = $resource(backendBaseUrl+"deleteSavedAnalysisData/:userId/:id");

	return this;
});
