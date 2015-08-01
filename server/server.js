var express = require('express'),
	http = require('http'),
	path = require('path'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser');

var app = express(),
	router = express.Router(),
	config = require("./config/server.env");

var env = process.env.NODE_ENV || 'development',
	staticEnvString = 'development';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cookieParser());

var routes = require('./routes/' + config.api.v1 + '/index');
app.use('/' + config.api.v1 + '/user', routes);

/**
 * Application configurations for development environment.
 * NODE_ENV=development node server.js
 ***/
if (staticEnvString.toLowerCase() === env.toLowerCase()) {
	app.set('port', process.env.PORT || config.server.dev.port);
	app.use(logger('dev'));
	app.use(express.static(path.join(__dirname, config.server.dev.codebase)));
}

/**
 * Application configurations for production environment.
 * NODE_ENV=production node server.js
 ***/
staticEnvString = "production";
if (staticEnvString.toLowerCase() === env.toLowerCase()) {
	app.set('port', process.env.PORT || config.server.prod.port);
	app.use(logger('prod'));
	app.use(express.static(path.join(__dirname, config.server.prod.codebase)));
}

http.createServer(app).listen(app.get('port'), function() {
	console.log("\n\n\tNode (Express) server listening on port " + app.get('port'));
});