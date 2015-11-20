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

function saveButton() {
	if (!isLogin) return;
    // Snap.ajax() have a fucking bug.
    // send(json) array -> string
    var http = new XMLHttpRequest();
    http.open("POST", "/saveData/", true);
	http.setRequestHeader('Content-type', 'application/json');
	http.send(JSON.stringify(tilesData));
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

function loginButton() {
	var admin = {
		username : document.getElementById("username").value,
		password : document.getElementById("password").value
	}
	document.getElementById("password").value = "";
    Snap.ajax("/login", admin, function(http) {
        console.log(http.response);
        if (http.response == "success") {
            adminMode();
            alert("登录成功");
        } else {
            alert("登录失败");
        }
    });
}

function logoutButton() {
	var http = new XMLHttpRequest();
	http.open("POST", "/logout/", true);
	http.send();
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			guestMode()
			alert("注销成功");
		}
	}
    Snap.ajax("/logout", function(http) {
        if (http.response == "success") {
            guestMode();
            alert("注销成功");
        } else {
            alert("注销失败");
        }
        
    });
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
	// document.getElementById("template-tile").className = "tile " + currentColor;
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


// Model 属性
var isLogin = false; 
var currentColor = "red";
var tilesData;
var star;
var contributor;

var TileColor = {
    red: "#FF0000",
    black: "#000000",
    blue: "#87CEEB",
    white: "#FFFFFF",
    gray: "#000000"
};

// 初始化 <svg></svg>

for (var i = 0; i< 7 * 12; i++) {
    document.getElementById("background").innerHTML += '<svg class="tile" id="t' + i + '" viewBox="0 0 80 80"></svg>';
}


// ajax 获取数据

(function(callback) {
	Snap.ajax("/getData", function(http) {
		data = JSON.parse(http.response);
        isLogin = data.isLogin;
        star = data.tiles.star;
        document.getElementById("star").innerHTML = star;
        contributor = data.tiles.contributor;
        document.getElementById("contributor").innerHTML = contributor;
        tilesData = data.tiles;
        if (isLogin) {
            adminMode();
        } else {
            guestMode();
        }
        console.log(tilesData);
        callback();
    });
})(initSVG);


// snap.svg 填充数据

var background = Snap("#background");
var Tiles = background.selectAll(".tile");
var animating = [], on = [];
var tileAttrOn = {
    fill: "",
    filter: 0,
    width: 60,
    height: 60,
    x: 10,
    y: 10,
    rx: 8,
    ry: 8
}

var tileAttrOff = {
    fill: "",
    filter: 0,
    width: 40,
    height: 40,
    x: 20,
    y: 20,
    rx: 99,
    ry: 99
}
function initSVG() {
    Tiles.forEach(function(element, index) {
        var tile = element.paper.rect(20, 20, 40, 40, 99, 99);
        
        var shadow = element.paper.filter(Snap.filter.shadow(0.5, 0.5, 0.8));
        var color = TileColor[tilesData.color[index]];
        
        tileAttrOn.fill = color;
        tileAttrOn.filter = shadow;
        tileAttrOff.fill = "#000000";
        tileAttrOff.filter = shadow;
        
        animating[index];
        if (tilesData.color[index] != "black") {
            on[index] = true;
            tile.attr(tileAttrOn);
        } else {
            on[index] = true;
            tile.attr(tileAttrOff);
        }
       
        tile.node.addEventListener('click', function() {
            if (animating[index] || !isLogin) return;
            animating[index] = true;
            if (on[index]) {
                animateOff(tile, "#000000", function() {
                    tilesData.color[index] = "black";
                    done();
                });
            } else {
                animateOn(tile, TileColor[currentColor], function(){
                    tilesData.color[index] = currentColor;
                    done();
                });
            }
            function done() {
                animating[index] = false;
                on[index] = !on[index];
            }
        });
    });
}

function animateOn(sender, color, callback){
    sender.animate({
        fill: color
    }, 200, mina.easeout, function() {
    });
    sender.animate({
        rx: 8,
        ry: 8
    }, 200, mina.easeout, function() {
        sender.animate({
            width: 60,
            height: 60,
            x: 10,
            y: 10
        }, 400, mina.elastic, function() {
            callback();
        });
    });
};

function animateOff(sender, color, callback){
    sender.animate({
        fill: color,
        width: 40,
        height: 40,
        x: 20,
        y: 20
    }, 200, mina.easeout, function() {
        sender.animate({
        rx: 99,
        ry: 99
        }, 200, mina.easeout, function() {
            callback();
        });
    });
}