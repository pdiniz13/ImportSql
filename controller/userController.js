/**
 * Created by ppp on 3/16/2015.
 */
var request = require('request');
var pg = require('pg');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var conString = "postgres://postgres:1234@localhost:5433/postgres";

var createUser = function(req, res) {
  var username = req.userName;
  var FName = req.FName;
  var LName = req.LName;
  var email = req.email;
  var password = req.password;
  var hash = bcrypt(password, 8, function(err, hash) {
    console.log(err);
    pg.connect(conString, function(err, client, done) {
      console.log(err);
      var insertUser = "INSERT INTO user (username, FName, LName, email, password) values ($1, $2, $3, $4, $5);";
      client.query(insertUser, [username, Fname, LName, email, hash], function(error, results) {
        console.log(error);
        console.log(results);
        res.render('login');
        done();
      });
    });
  });
};
exports.createUser = createUser;

var logInUser = function(req, res) {
  var username = req.username;
  var password = req.password;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectUser = "SELECT * FROM user WHERE username = $1;";
    client.query(selectUser, [username], function(error, results) {
      if (results.row[0] === undefined) {
        res.redirect('login');
      }
      var hash = bcrypt(password, 8, function(err, hash) {
        console.log(err);
        if (results.rows[0].password = hash) {
          res.redirect('login');
        }
        else {
          req.session.user = username;
          res.redirect('/');
        }
      });
      done();
    });
  })
};
exports.logInUser = logInUser;

var isLoggedIn = function(req, res) {
  return req.session ? !!req.session.user : false;
};

var checkUser = function(req, res, next) {
  //console.log(req.session, 'this is req.session');
  //console.log(req.session.user, 'this is req.session.user');
  if (!isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    //console.log('inside else checkUser')
    next();
  }
};
exports.checkUser = checkUser;

var logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};
exports.logoutUser = logoutUser;