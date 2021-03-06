"use strict"

// dependancies
var express = require('express')
var fs = require("fs");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// restify
var restify = require("iblokz-node-restify");
var restMap = require("./data/restMap.json");

// create app
var app = express()

// connect to db
var db = mongoose.connect("mongodb://localhost/funky-town");

// load model
restify.loadModel(restMap, db);


// configuration and middleware 
app.use(express.static('public'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

// routes
app.get('/', function (req, res) {
  res.render('index');
})

// admin route
app.get('/admin/', function (req, res) {
  res.render('admin/index');
})


// listen for files: /post -> /views/post.jade
app.get("/:fileName", function(req, res, next){
  if(req.params && req.params.fileName){
    var fileName = req.params.fileName.replace(".html","");

    // if jade file exists
    if(fs.existsSync(__dirname+"/views/"+fileName+".jade")){
      res.render(fileName);
    // if post is in posts
    } else {
      next();
    }

  } else {
    next();
  }
})

// init routes
restify.initRoutes(app,restMap,{},db);


// set up server
var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})