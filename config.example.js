var config = {
	// Account
	admin : {
		username : "admin",
		password : "admin"
	},
	// Tiles properties
	tile : {
		row : 7,
		column : 12
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

module.exports = config;