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

var UPLOAD_PATH = "\\public\\uploads\\";
var dataCheckerScript = "python -W ignore " + __dirname + "\\check_data.py " + __dirname + UPLOAD_PATH;
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


MongoClient.connect("mongodb://root:sociometric-analysis@ds151082.mlab.com:51082/sociometric-analysis", function(err, database) {
	if (err) return console.log(err);
	db = database;

	app.listen(3000, function() {
		console.log("Listening on 3000");
	})
});
 

/*app.listen(3000, function() {
	console.log("Listening on 3000");
})*/

app.post('/upload/:userId',upload.single('file'),function(req,res){
	exec(dataCheckerScript + req.params.userId + ".txt", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/channelAnalysis/:userId', function(req,res){
	exec(analysisScript + req.params.userId + ".txt 0", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/userAnalysis/:userId', function(req,res){
	exec(analysisScript + req.params.userId + ".txt 1", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/reactionTimeAnalysis/:userId', function(req,res){
	exec(analysisScript + req.params.userId + ".txt 2", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});



