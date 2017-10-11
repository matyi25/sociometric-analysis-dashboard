sociometricAnalysisApp.factory("SociometricAnalysis", function ($resource, $filter, $timeout, $q, $cookieStore) {
	var isLoggedIn = false;
	var userInfo = {};
	var backendBaseUrl = "http://localhost:3000/";
	var inputDataInfo = {};
	var channelAnalysisData = {};
	var userAnalysisData = {};
	var reactionTimeAnalysisData = {};
	var channels = [];
	var users = [];


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
	this.backendSave = $resource(backendBaseUrl+"save/:userId");

	return this;
});
