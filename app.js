var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var passport = require('passport');
var userController = require('./controller/userController');
var treeController = require('./controller/treeController');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.session());
// app.use(express.cookieParser('secret string'));
app.use(session({
  secret: 'secret string',
  name: 'cookie_name',
  // store: sessionStore, // connect-mongo session store
  // proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', userController.checkUser, function(req, res) {
  return res.render('index');
});

app.get('/create', userController.checkUser, function(req, res) {
    return res.render('index');
  }
);

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', userController.checkUser(req, res));

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', userController.createUser);

app.get('/about', function(req, res) {
  res.render('about')
});

app.get('/trees', userController.checkUser, function(req, res) {
  treeController.getTrees(req, res)
});

app.get('/treeInfo', userController.checkUser, function(req, res) {
  treeController.getTreeInfo(req, res)
});

app.get('/searchTrees', userController.checkUser, function(req, res) {
  treeController.searchTrees(req, res)
});

app.get('/logout', userController.logoutUser(req,res));



app.listen(process.env.port || 3000);