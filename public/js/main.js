var tiles = (function() {
	var jsonhttp = new XMLHttpRequest();
	jsonhttp.open("GET", "/getData", true);
	jsonhttp.send();
	jsonhttp.onreadystatechange = function() {
		if (jsonhttp.readyState == 4 && jsonhttp.status == 200) {
			tiles = JSON.parse(jsonhttp.response);
			for (var i = 0; i < tiles.column * tiles.row; i++) {
				document.getElementById("background").innerHTML += '<div class="tile ' + tiles.color[i] + '" id="' + i + '" onclick="clicked(this.id)"></div>';
			}
			document.getElementById("template-color").innerHTML = '<div class="tile ' + tiles.currentColor + '" id="template-tile" onclick="clicked(this.id)"></div>';

		}
	}
})();

function clicked(id) {
	var tile = document.getElementById(id);
	if (tiles.currentColor == tiles.color[id]) {
		tile.className = "tile gray";
		tiles.color[id] = "gray";	
	} else {
		if (tiles.currentColor == "red") {
			tile.className = "tile red";
			tiles.color[id] = "red";
		} else if (tiles.currentColor == "blue") {
			tile.className = "tile blue";
			tiles.color[id] = "blue";	
		} else if (tiles.currentColor == "white") {
			tile.className = "tile white";
			tiles.color[id] = "white";
		}
	}
}

function saveData() {
	var http = new XMLHttpRequest();
	http.open("POST", "/saveData/", true);
	http.setRequestHeader('Content-type', 'application/json');
	http.send(JSON.stringify(tiles));
	console.log(JSON.stringify(tiles));
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			alert("保存成功");
			console.log("save data message" + http.response);
			document.getElementById("button-save").innerHTML = "Saved";
			setTimeout(function() {
				document.getElementById("button-save").innerHTML = "Save";
			}, 2000);
		}
	}
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
	document.getElementById("template-tile").className = "tile " + tiles.currentColor;
}