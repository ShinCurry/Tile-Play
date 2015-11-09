var fs = require("fs");
var express = require('express'); 
var sqlite3 = require("sqlite3").verbose();

var app = express();

// config
var config = {
	username : "admin",
	password : "admin",
	row : 7,
	column : 12
};

// init database 
var originalFile = "tiles.original.db";
var file = "tiles.db";
var exists = fs.existsSync(file);
if (!exists) {
	fs.rename(originalFile, file, function(err) {
		if (err) {
			console.log(err);
		}
	});
	var db = new sqlite3.Database(file);
	db.serialize(function() {
		// db.run("CREATE TABLE tiles (id integer  PRIMARY KEY DEFAULT NULL,color Varchar(100) DEFAULT NULL)");
		// db.run("CREATE TABLE settings (name Varchar(40)  PRIMARY KEY DEFAULT NULL,value INTEGER DEFAULT NULL)");
		// db.run("CREATE TABLE admin (username Varchar(40)  PRIMARY KEY DEFAULT NULL,password Varchar(40) DEFAULT NULL)");
		for (var i = 0; i < config.column * config.row; i++) {
			db.run('INSERT INTO tiles VALUES (' + i + ',"gray")');
		}
		db.run('INSERT INTO settings VALUES ("row",' + config.row + ')');
		db.run('INSERT INTO settings VALUES ("column",' + config.column + ')');
		db.run('INSERT INTO admin VALUES ("' + config.username + '","' + config.password + '")');
	});
	db.close();
	
}

function setDataToDB(t) {
	// var db = new sqlite3.Database(file);
}

var tiles = (function getDataFromDB() {
	var t = {
		row : 0,
		column : 0,
		color : [],
		currentColor : "red"
	};
	var db = new sqlite3.Database(file);
	db.each("SELECT * FROM tiles", function(err, row) {
		t.color[row.id] = row.color;
	});
	db.each("SELECT * FROM settings", function(err, row) {
		t[row.name] = row.value;
	});
	db.close();
	return t;
})();


// 临时设值


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
	res.send("not ok");
});
app.post('/login', function(req, res) {
	// res.cookie()
});

// 端口设置
app.listen(3000, '127.0.0.1', function() {
	console.log("app run in http://127.0.0.1:3000");
});