var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var initial = function(callback) {
	// Initial database
	var file = "tiles.db";
	var exists = fs.existsSync(file);
	if (!exists) {
		var db = new sqlite3.Database(file);
		db.serialize(function() {
			db.run('CREATE TABLE tileground (name TEXT DEFAULT NULL,data TEXT DEFAULT NULL)');
			db.run('INSERT INTO tileground (name,data) VALUES ("original","' + escape(JSON.stringify(initTiles())) + '")', function(){
				callback();
			});
		});
		db.close();
	} else {
		callback();
	}
}

function initTiles() {
	var t = { row: 7, column: 12, color: [], star: 0, contributor: "ShinCurry" }
	for (var i = 0; i < t.row * t.column; i++) {
		t.color[i] = "black";
	}
	return t;
}

exports.run = initial;
