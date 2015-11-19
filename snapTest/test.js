
var Tile = Snap(".tile");

// rect(x, y, width, height, rx, ry) // x(y) coordinate of the top left corner
// circle(x, y, r) // x(y) coordinate of the centre


var tile = Tile.paper.rect(25, 25, 30, 30, 99, 99);
var shadow = Tile.paper.filter(Snap.filter.shadow(0.5, 0.5, 0.8));

tile.attr({
	fill: "#000000",
	filter: shadow
});


function animateIn(color, callback){
    tile.animate({
        fill: color
    }, 200, mina.easeout, function() {
    });
    tile.animate({
        rx: 8,
        ry: 8
        
    }, 200, mina.easeout, function() {
        tile.animate({
            width: 60,
            height: 60,
            x: 10,
            y: 10
        }, 400, mina.elastic, function() {
            callback();
        });
    });
};

function animateOut(color, callback){
    tile.animate({
        fill: color,
        width: 30,
        height: 30,
        x: 25,
        y: 25
    }, 200, mina.easeout, function() {
        tile.animate({
        rx: 99,
        ry: 99
        }, 200, mina.easeout, function() {
            callback();
        });
    });
    
};

var animating = false, out = true;
Tile.node.addEventListener('click', function(){
    if (animating) return;
    animating = true;

    if (out) {
        animateOut("#000000", function() {
        });
    } else {
        animateIn("#87CEEB", function(){ 
        });
    }
    animating = false;
    out = !out;
});