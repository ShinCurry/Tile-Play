// var tiles = {
// 	row : 7,
// 	column : 12,
// 	data : [],
// 	admin : false
// };

var tiles;


(function() {
	var jsonhttp = new XMLHttpRequest();
	jsonhttp.open("GET", "/getData", true);
	jsonhttp.send();
	jsonhttp.onreadystatechange = function() {
		if (jsonhttp.readyState == 4 && jsonhttp.status == 200) {
			tiles = JSON.parse(jsonhttp.response);
			for (var i = 0; i < tiles.column * tiles.row; i++) {
				document.getElementById("background").innerHTML += "<div class='tile " + tiles.data[i] + "' id='" + i + "' onclick='clicked(this.id)'></div>";
			}
		}
	}
})();

function clicked(id) {
	var tile = document.getElementById(id);
	if (tiles.currentColor == tiles.data[id]) {
		tile.className = "tile gray";
		tiles.data[id] = "gray";	
	} else {
		if (tiles.currentColor == "red") {
			tile.className = "tile red";
			tiles.data[id] = "red";	
		} else if (tiles.currentColor == "blue") {
			tile.className = "tile blue";
			tiles.data[id] = "blue";	
		} else if (tiles.currentColor == "white") {
			tile.className = "tile white";
			tiles.data[id] = "white";
		}
	}
}

function saveData() {
	var http = new XMLHttpRequest();
	http.setRequestHeader = "application/json";
	http.open("POST", "/saveData/", true);
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			if (http.response = "ok") {
				document.getElementById("button-save").innerHTML = "Saved";
				setTimeout(function() {
					document.getElementById("button-save").innerHTML = "Save";
				}, 5000);
			}
		}
	}
	console.log(JSON.stringify(tiles));
	http.send("tiles="+JSON.stringify(tiles)); // Problem ##
}

function setColor(id) {
	console.log(id);
	if (id == "button-red") {
		tiles.currentColor = "red";
	} else if (id == "button-blue") {
		tiles.currentColor = "blue";
	} else if (id == "button-white") {
		tiles.currentColor = "white";
	}
}

// function print() {
// 	document.getElementById("test").innerHTML = "";
// 	for (var i = 1; i <= tiles.column * tiles.row; i++) {
// 		document.getElementById("test").innerHTML += tiles.data[i] + "<br>";
// 	}
// }