// Libraries
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var logger = require('morgan');
var mongoose = require('mongoose');
var settings = require('./settings');

// Config app
global.appRoot = path.resolve(__dirname);

// Routers
var router = require('./routes');

// Database
mongoose.connect(settings.database);

// App
var app = express();

app.set("port", 5000);
app.set("superSecret", "CarxC6P5ykEZ5MPQv6EP");

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true, preflightContinue: true}));
app.use(express.static(path.join(__dirname, 'public')));


// Connect routers
app.use("/api", router);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;