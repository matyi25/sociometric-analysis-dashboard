var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require('multer');
var MongoClient = require("mongodb").MongoClient;

var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/upload'));

var db;

MongoClient.connect("mongodb://root:sociometric-analysis@ds151082.mlab.com:51082/sociometric-analysis", function(err, database) {
	if (err) return console.log(err);
	db = database;

	app.listen(3000, function() {
		console.log("Listening on 3000");
	})
})

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname +'/public/uploads');
		//modify upload dest
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
		//modify file name
	}
});
var upload = multer({ "storage": storage });
var type = upload.array('files[]');

app.post('/upload/:userId',type,function(req,res){
	res.sendStatus(200);
});


