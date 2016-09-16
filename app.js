var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

//Controller initialization
var dashboard = require('./routes/dashboard');
var jobs = require('./routes/jobs');
var work_units = require('./routes/work_units');
var db = require('./routes/models/database');
var test = require('./routes/test');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes within application
app.use('/', dashboard);
app.use('/createjob', jobs);
app.use('/createworkunit', work_units);
app.use('/searchjobs', jobs);
app.use('/test', test);

//Bootstrap and JQuery
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

//Elements for date picker
app.use('/moment', express.static(__dirname + '/bower_components/moment/min/'));
app.use('/eonasdan', express.static(__dirname + '/bower_components/eonasdan-bootstrap-datetimepicker/build/js/'));
app.use('/eonasdancss', express.static(__dirname + '/bower_components/eonasdan-bootstrap-datetimepicker/build/css/'));

//Customized theme elements from the Bootstrp marketspace
app.use('/vendorcss', express.static(__dirname + '/vendor/bootstrap/css'));
app.use('/vendorjs', express.static(__dirname + '/vendor/bootstrap/js'));
app.use('/vendormentis', express.static(__dirname + '/vendor/metisMenu'));
app.use('/vendormorrisjs', express.static(__dirname + '/vendor/morrisjs'));
app.use('/vendorfont', express.static(__dirname + '/vendor/font-awesome'));
app.use('/vendorjq', express.static(__dirname + '/vendor/jquery/'));
app.use('/vendordist', express.static(__dirname + '/bower_components/startbootstrap-sb-admin-2-gh-pages/dist'));
app.use('/vendordata', express.static(__dirname + '/bower_components/startbootstrap-sb-admin-2-gh-pages/data'));
app.use('/vendorraph', express.static(__dirname + '/vendor/raphael'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Database connection set up
pg.connect(db.uri, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  app.locals.dataPostgres = database;
  var client = new pg.Client(db.uri);
  client.connect();
});

module.exports = app;
