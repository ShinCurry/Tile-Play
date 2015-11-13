var isLogin = false;
var currentColor = "red";
var tiles;
var star;
var contributor

(function() {
	var jsonhttp = new XMLHttpRequest();
	jsonhttp.open("GET", "/getData", true);
	jsonhttp.send();
	jsonhttp.onreadystatechange = function() {
		if (jsonhttp.readyState == 4 && jsonhttp.status == 200) {
			data = JSON.parse(jsonhttp.response);
			isLogin = data.isLogin;
			star = data.tiles.star;
			document.getElementById("star").innerHTML = star;
			contributor = data.tiles.contributor;
			document.getElementById("contributor").innerHTML = contributor;
			tiles = data.tiles;
			console.log(tiles);
			for (var i = 0; i < tiles.column * tiles.row; i++) {
				document.getElementById("background").innerHTML += '<div class="tile ' + tiles.color[i] + '" id="' + i + '" onclick="clicked(this.id)"></div>';
			}
			document.getElementById("template-color").innerHTML = '<div class="tile ' + currentColor + '" id="template-tile"></div>';
			if (isLogin) {
				adminMode();
			} else {
				guestMode();
			}
		}
	}
})();

document.getElementById("build-tileground").innerHTML = "";

function clicked(id) {
	if (!isLogin) return;
	var tile = document.getElementById(id);
	if (currentColor == tiles.color[id]) {
		tile.className = "tile gray";
		tiles.color[id] = "gray";
	} else {
		if (currentColor == "red") {
			tile.className = "tile red";
			tiles.color[id] = "red";
		} else if (currentColor == "blue") {
			tile.className = "tile blue";
			tiles.color[id] = "blue";
		} else if (currentColor == "white") {
			tile.className = "tile white";
			tiles.color[id] = "white";
		}
	}
}

function saveData() {
	if (!isLogin) return;
	var http = new XMLHttpRequest();
	http.open("POST", "/saveData/", true);
	http.setRequestHeader('Content-type', 'application/json');
	http.send(JSON.stringify(tiles));
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			if (http.response == "success") {
				alert("保存成功");
				document.getElementById("button-save").innerHTML = "Saved";
				setTimeout(function() {
					document.getElementById("button-save").innerHTML = "Save";
				}, 2000);
			} else {
				alert("保存失败");
			}
		}
	}
}

function setColor(id) {
	if (!isLogin) return;
	console.log(id);
	if (id == "button-red") {
		currentColor = "red";
	} else if (id == "button-blue") {
		currentColor = "blue";
	} else if (id == "button-white") {
		currentColor = "white";
	}
	document.getElementById("template-tile").className = "tile " + currentColor;
}

function login() {
	var admin = {
		username : document.getElementById("username").value,
		password : document.getElementById("password").value
	}
	document.getElementById("password").value = "";
	var http = new XMLHttpRequest();
	http.open("POST", "/login/", true);
	http.setRequestHeader('Content-type', 'application/json');
	http.send(JSON.stringify(admin));
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			if (http.response == "success") {
				adminMode();
				alert("登录成功");
			} else {
				alert("登录失败");
			}
		}
	}
}

function logout() {
	var http = new XMLHttpRequest();
	http.open("POST", "/logout/", true);
	http.send();
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			guestMode()
			alert("注销成功");
		}
	}

}


function guestMode() {
	document.getElementById("toolbar").style.display = "none";
	document.getElementById("login").style.display = "inline";
	document.getElementById("logout").style.display = "none";
	isLogin = false;
}

function adminMode() {
	document.getElementById("toolbar").style.display = "inline";
	document.getElementById("login").style.display = "none";
	document.getElementById("logout").style.display = "inline";
	isLogin = true;
}
