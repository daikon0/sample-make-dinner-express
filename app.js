var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash-messages');

var indexRouter = require('./routes/index');
var auth = require('./routes/auth');
var loginRouter = require('./routes/login');
var logoutRoter = require('./routes/logout');
var registerRouter = require('./routes/register');
var menuRouter = require('./routes/menu');
var selectGenreRouter = require('./routes/selectGenre');
var rakutenRouter = require('./routes/rakuten');

var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/login', loginRouter);
app.use('/logout', logoutRoter);
app.use('/register', registerRouter);
app.use('/menu', menuRouter);
app.use('/selectGenre', selectGenreRouter);
app.use('/rakuten', rakutenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;