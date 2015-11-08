var fs = require("fs");
var express = require('express'); 
var app = express();

// Model

var tiles = {
	row : 7,
	column : 12,
	data : [],
	currentColor : "red"
};

// 数据库读写 not work

// var file = "tiles.db";
// var sqlite3 = require("sqlite3").verbose();
// var exists = fs.existsSync(file);
// if (!exists) {
// 	var db = new sqlite3.Database(file);
// 	db.serialize(function() {
// 		db.run("CREAT TABLE tiles(id INTEGER PRIMARY KEY, value TEXT);");
// 	});
// 	for (var i = 0; i < tiles.column * tiles.row; i++) {
// 		tiles.data[i] = "gray";
// 		db.run("INSERT INTO tiles (id, value) VALUES ("+ i + " , " + "tile not-selected" + ")");
// 	}
// }


// 临时设值

for (var i = 0; i < tiles.column * tiles.row; i++) {
	tiles.data[i] = "gray";
}
tiles.data[3] = "red";

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
	// console.log("@@=" + req);
	res.send("ok");
});

// 端口设置
app.listen(3000, '127.0.0.1', function() {
	console.log("app run in http://127.0.0.1:3000");
});