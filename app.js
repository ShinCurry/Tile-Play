var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();
var session = require("express-session");
var cookieParser = require("cookie-parser");

var app = express();
config = require('./config.js');
var init = require('./init.js');
var db = new sqlite3.Database(config.database.dbName);

var data = {
	isLogin : false,
	tiles : {}
}

init.run(function() {
	getDataFromDB();
});

// database setter and getter function implement
function getDataFromDB() {
	db.serialize(function() {
		db.each("SELECT * FROM tileground", function(err, row) {
			if (row.name == "original") data.tiles = JSON.parse(unescape(row.data));
		});
	});
}
function setDataToDB(t) {
	var db = new sqlite3.Database(config.database.dbName);
	db.serialize(function() {
		db.run('UPDATE tileground SET data="' + escape(JSON.stringify(t)) + '" WHERE name="original"');
		tiles = t;
	});
}


// BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret : config.session.secret,
	name : config.session.secret,
	cookie : { maxAge : 5 * 60 * 1000 },
	resave : false,
	saveUninitialized : true,
}));
// Static file
app.use(express.static('public'));



// Main page
app.get('/', function(req, res) {
	res.sendfile('views/index.html');
});

// HTTP request API
app.get('/getData', function(req, res) {
	data.isLogin = req.session.isLogin ? true : false;
	res.json(data);
});
app.post('/saveData/', function(req, res) {
	if (!req.session.isLogin) {
		res.send("failed");
	} else {
		data.tiles = req.body;
		setDataToDB(data.tiles);
		res.send("success");
	}

});
app.post('/login', function(req, res) {
	if (req.body.username == config.admin.username && req.body.password == config.admin.password) {
		req.session.isLogin = true;
		res.send("success");
	} else {
		req.session.isLogin = false;
		res.send("failed");
	}
});

app.post('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if (err) console.log(err);
		res.send("success");
	})
});

app.listen(config.app.port, config.app.url, function() {
	console.log("app run in " + config.app.url + ":" + config.app.port);
});
