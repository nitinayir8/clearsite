
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'), 
	path = require('path'),
	config = require('./config')(),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	Employees = require('./controllers/Employee');
//	partials = require('hogan-express-partials');

// all environments
// app.set('port', process.env.PORT || 3000);
app.engine('hjs', require('hogan-express'));
app.enable('view cache');
app.configure(function(){
app.set('partials',{header:"header",footer:"footer"});	
app.set('views', __dirname + '/templates');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('clearsite-site'));
app.use(express.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
//app.use("/static",express.static(path.join(__dirname, '/public/')));
});
// development only
if ('development' == app.get('env')) {
  	app.use(express.errorHandler());
}

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/clearsite', function(err, db) {
	if(err) {
		console.log('Sorry, there is no mongo db server running.');
	} else {
		var attachDB = function(req, res, next) {
			req.db = db;
			next();
		};
	
		app.all('/',attachDB, function(req, res, next) {
			Employees.run(req, res, next);
		});	
		
		app.all('/analytics', attachDB, function(req, res, next){
			Employees.analytics(req, res, next);
		});
		
        app.all('/logout', attachDB, function(req, res, next){
			Employees.logout(req, res, next);
		});

        
		http.createServer(app).listen(config.port, function() {
		  	console.log(
		  		'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
		  		'\nExpress server listening on port ' + config.port
		  	);
		});
	}
});