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
var IM_DATA_FILENAME = "im_data.txt";
var dataCheckerScript = "python -W ignore " + __dirname + "\\check_data.py " + __dirname + UPLOAD_PATH + IM_DATA_FILENAME;
var analysisScript = "python -W ignore " + __dirname + "\\read_and_analyse_data.py " + __dirname + UPLOAD_PATH + IM_DATA_FILENAME + " ";

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + UPLOAD_PATH);
		//modify upload dest
	},
	filename: function (req, file, cb) {
		cb(null, IM_DATA_FILENAME);
		//modify file name
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

app.post('/upload',upload.single('file'),function(req,res){
	exec(dataCheckerScript, function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/channelAnalysis', function(req,res){
	exec(analysisScript + "0", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/userAnalysis', function(req,res){
	exec(analysisScript + "1", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});

app.get('/reactionTimeAnalysis', function(req,res){
	exec(analysisScript + "2", function(error, stdout, stderr) {
		if (!error) {
			res.status(200);
			res.json(JSON.parse(stdout));
		} else {
			res.sendStatus(201);
		}
	});
});



