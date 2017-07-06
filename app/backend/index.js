var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var MongoClient = require("mongodb").MongoClient;

var app = express();
app.use(bodyParser.json());
app.use(cors());

var db;

MongoClient.connect("mongodb://root:sociometric-analysis@ds151082.mlab.com:51082/sociometric-analysis", function(err, database) {
	if (err) return console.log(err);
	db = database;

	app.listen(3000, function() {
		console.log("Listening on 3000");
	})
})


