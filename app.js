var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require("sqlite3").verbose();

var app = express();
var config = require('./config.js');

function initTiles() {
	var t = { row: 7, column: 12, color: [], currentColor: "red" }
	for (var i = 0; i < t.row * t.column; i++) {
		t.color[i] = "gray";
	}
	return t;
}

var tiles;
getDataFromDB();

// database setter and getter
function getDataFromDB() {
	var db = new sqlite3.Database(config.dbName);
	db.serialize(function() {
		db.each("SELECT * FROM tileground", function(err, row) {
			if (row.name == "original") tiles = JSON.parse(unescape(row.data));
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


// BodyParser 中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


// 静态文件
app.use(express.static('public'));

// 主页面
app.get('/', function(req, res) {
	res.sendfile('index.html');
});

// API
app.get('/getData', function(req, res) {
	res.json(tiles);
});

app.post('/saveData/', function(req, res) {
	setDataToDB(req.body);
	res.send("ok");
});
app.post('/login', function(req, res) {
	// res.cookie()
});

// 端口设置
app.listen(config.port, config.url, function() {
	console.log("app run in " + config.url + ":" + config.port);
});