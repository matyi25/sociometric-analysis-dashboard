var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require('multer');
var exec = require("child_process").exec;
var MongoClient = require("mongodb").MongoClient;

var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/upload'));

var db;
var analysisDataDb;
var analysisDataDbName = "analysisDataDb";
var UPLOAD_PATH = "\\public\\uploads\\";
var analysisScript = "python -W ignore " + __dirname + "\\read_and_analyse_data.py " + __dirname + UPLOAD_PATH;

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + UPLOAD_PATH);
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var upload = multer({ "storage": storage });


MongoClient.connect("mongodb://root:sociometric-analysis@ds151082.mlab.com:51082/sociometric-analysis", function(err, db) {
	if (err) return console.log(err);
	analysisDataDb = db.collection(analysisDataDbName)

	app.listen(3000, function() {
		console.log("Listening on 3000");
	})
});
 
app.post('/upload/:userId',upload.single('file'),function(req,res){
	exec(analysisScript + req.params.userId + ".txt [3]", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/channelAnalysis/:userId', function(req,res){
	exec(analysisScript + req.params.userId + ".txt [0]", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/userAnalysis/:userId', function(req,res){
	exec(analysisScript + req.params.userId + ".txt [1]", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/reactionTimeAnalysis/:userId', function(req,res){
	exec(analysisScript + req.params.userId + ".txt [2]", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.post('/saveAnalysisData/:userId', function(req,res){
	analysisDataDb.find({"userId":req.params.userId, "id": req.body.id}).toArray(function(err, docs) {
		if(docs[0] == undefined) {
			exec(analysisScript + req.params.userId + ".txt [0,1,2,3]", function(error, stdout, stderr) {
				if (!error) {
					var data = {};
					var rawAnalysisResults = stdout.split(/\r?\n/).slice(0,-1);

					for (var i = 0; i < rawAnalysisResults.length; i++) {
						data[i] = JSON.parse(rawAnalysisResults[i]);
					};

					analysisDataDb.insert({"userId": req.params.userId,"id":req.body.id, "data": data }, {w:1}, function(err, result) {
						if(err) res.json({"status": "error"});
						else if(result.result.ok == 1) {
							res.status(200);
							res.json({"status": "OK"});
						}
					});
				} else {
					res.json({"status": "error"});
				}
			});
		} else {
			res.json({"status": "exists"});
		}
	})

});

app.get('/savedAnalysisDataIds/:userId', function(req, res) {
	analysisDataDb.find({"userId":req.params.userId}).toArray(function(err, docs) {
		var dataIds = [];

		for (var i = 0; i < docs.length; i++) {
			dataIds[i] = docs[i].id;
		}
		res.json(dataIds);
	})
});

app.get('/savedAnalysisData/:userId/:id', function(req, res) {
	analysisDataDb.find({"userId":req.params.userId, "id": req.params.id}).toArray(function(err, docs) {
		if(err) res.json({"status": "error"});
		else res.json(docs[0]);
	})
});

app.delete("/deleteSavedAnalysisData/:userId/:id", function(req, res) {
	analysisDataDb.remove({"userId": req.params.userId,"id":req.params.id}, {w:1}, function(err, result) {
		if(err) console.log(err);
		else if(result.result.ok == 1) {
			res.json({"resp": "OK"});
		}
	});
});