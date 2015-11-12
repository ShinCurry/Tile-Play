var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();

var session = require("express-session");
var cookieParser = require("cookie-parser");

// var pass = require("pass");
// var ejs = require("ejs");

var app = express();
var config = require('./config.js');

function initTiles() {
	var t = { row: 7, column: 12, color: [], star: 0, contributor: "ShinCurry" }
	for (var i = 0; i < t.row * t.column; i++) {
		t.color[i] = "gray";
	}
	return t;
}

// 数据载入内存
var data = {
	isLogin : false,
	tiles : {}
}
getDataFromDB();

// Tileground Schema
// var tileground = {
// 	name : "orginal",
// 	row : 7,
// 	column : 12,
// 	color : [], // <- enum color type
// 	star : 0,
// 	contributor : "ShinCurry"
// }

// database -> id, 'tileground json string', time?, contributor?, star(int)

// enum color {
// 	red, blue, white;
// }




// database setter and getter function implement
function getDataFromDB() {
	var db = new sqlite3.Database(config.dbName);
	db.serialize(function() {
		db.each("SELECT * FROM tileground", function(err, row) {
			if (row.name == "original") data.tiles = JSON.parse(unescape(row.data));
		});
	});
	db.close();
}
function setDataToDB(t) {
	var db = new sqlite3.Database(config.dbName);
	db.serialize(function() {
		db.run('UPDATE tileground SET data="' + escape(JSON.stringify(t)) + '" WHERE name="original"');
		tiles = t;
	});
	db.close();
}


//temp
// app.configeration(function() {
//
// });


// BodyParser 中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.use(cookieParser());
app.use(session({
	secret : 'shin123',
	name : 'connect.sid',
	cookie : { maxAge : 10 * 1000 },
	resave : false,
	saveUninitialized : true,
}));

// 静态文件
app.use(express.static('public'));

// 主页面
app.get('/', function(req, res) {
	res.sendfile('index.html');
});

// HTTP request API
app.get('/getData', function(req, res) {
	data.isLogin = req.session.isLogin ? true : false;
	res.json(data);
});
app.post('/saveData/', function(req, res) {
	console.log("req.session.isLogin = " + req.session.isLogin);
	if (!req.session.isLogin) {
		res.send("failed");
	} else {
		setDataToDB(req.body);
		res.send("success");
	}

});
app.post('/login', function(req, res) {
	if (req.body.username == config.username && req.body.password == config.password) {
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

// 端口设置
app.listen(config.port, config.url, function() {
	console.log("app run in " + config.url + ":" + config.port);
});
