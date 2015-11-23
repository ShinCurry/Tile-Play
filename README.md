# Tile Play

Tile Play is a web app that can show some (interesting) infomation.

![Tile Play 2nd Version](http://windisco.qiniudn.com/tile-play-002.png)


Version 0.9 Beta

## Installation

```
$ git clone https://github.com/ShinCurry/Tile-Play.git
$ cd Tile-Play
$ cp config.example.js config.js
$ vi config.js
$ npm install
```

## Configuration

```
var config = {
	// Account
	admin : {
		username : "admin",
		password : "admin"
	},
	// Database settings
	database : {
		dbName : "tiles.db"
	},
	// App settings
	app : {
		url : "127.0.0.1",
		port : 3000
	},
	// Session Settings
	session : {
		secret : 'tileplay',
		name : 'connect.sid'
	}
};
```

## Usage

```
$ npm start
```

### Running  Forever
#### Start

```
npm install forever -g
forever start app.js
```
#### Stop

```
forever stop app.js
```



`Tile Play` made in Node.js

## Demo

[Demo](http://tile-play.project.windisco.com)

## Reference

* [Express.js](http://expressjs.com)
* [Snap.svg](http://snapsvg.io)