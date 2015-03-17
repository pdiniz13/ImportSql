/**
 * Created by ppp on 3/16/2015.
 */
var pg = require('pg');
var conString = "postgres://postgres:1234@localhost:5433/postgres";

var getMessagesForTree = function(req, res) {
  var treeid = req.body.treeId;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = "SELECT message FROM message WHERE treeid = $1 LIMIT 100;";
    client.query(selectMessages, [treeid], function(error, results) {
      res.send(results);
    });
    done();
  });
};
exports.getMessagesForTree = getMessagesForTree;

var getMessagesForUsers = function(req, res) {
  var username = req.body.username;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = "SELECT message FROM message WHERE username = $1;";
    client.query(selectMessages, [username], function(error, results) {
      res.send(results);
    });
    done();
  });
};
exports.getMessagesForUsers = getMessagesForUsers;

var getTreeInfo = function(req, res) {
  //var treeid = req.body.treeId;
  var treeid = 50;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectMessages = 'SELECT tree.name, q.qspecies, tree.plantdate, l.latitude, l.longitude, image.imageurl, image.imagewidth, image.imageheight, image.imagetype from qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN image ON (q.qspeciesid = image.qspeciesid) WHERE treeid = $1;';
    client.query(selectMessages, [treeid], function(error, results) {
      //res.send(results);
      done();
      console.log(error);
      console.log(results.rows[0]);
    });
  });
};
exports.getTreeInfo = getTreeInfo;

var getTrees = function(req, res) {
  var offset = req.offset || 0;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var selectTrees = 'SELECT tree.name, q.qspecies, l.latitude, l.longitude, thumbnail.url, thumbnail.width, thumbnail.height, thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN thumbnail ON (q.qspeciesid = thumbnail.qspeciesid) LIMIT 250 OFFSET $1;';
    client.query(selectTrees, [offset], function(error, results) {
      done();
      console.log(results.rows);
    });
  })
};
exports.getTrees = getTrees;

var searchTrees = function(req, res) {
  var search = req.search;
  var offset = req.offset || 0;
  var search = "Briana";
  var searchString = typeof search === "string" ? "%" + search + "%" : "do not use";
  var searchNum = typeof search === "number" ? search : 0;
  var offset = 0;
  pg.connect(conString, function(err, client, done) {
    console.log("in search trees");
    console.log(err);
    var selectTrees = 'SELECT tree.name, q.qspecies, l.latitude, l.longitude, thumbnail.url, thumbnail.width, thumbnail.height, thumbnail.contenttype FROM qspecies q JOIN tree ON (q.qspeciesid = tree.qspeciesid) JOIN "location" l ON (l.locationid = tree.locationid) JOIN thumbnail ON (q.qspeciesid = thumbnail.qspeciesid) WHERE tree.treeid = $1 OR tree.name LIKE $2 OR q.qspecies = $2 OR q.qspeciesid = $1 LIMIT 250 OFFSET $3;';
    client.query(selectTrees, [searchNum, searchString, offset], function(error, results){
      console.log('error', error);
      //console.log('results', results);
      console.log(results.rows);
      done();
    });
  })
};
exports.searchTrees = searchTrees;

var postMessageFromUser = function(req, res) {
  var username = req.body.username;
  var message = req.body.message;
  var treeid = req.body.treeId;
  pg.connect(conString, function(err, client, done) {
    console.log(err);
    var insertMessages = "INSERT INTO message (message, username, treeid) values ($1, $2, $3);";
    client.query(insertMessages, [message, username, treeid], function(error, results) {
      res.send(results);
      done();
    });
  });
};
exports.postMessageFromUser = postMessageFromUser;