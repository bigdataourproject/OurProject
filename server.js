 /*******************************************************************************
* Authors : Alexey and Shir
* Date : 04.2019
* Version : 1.0
********************************************************************************/
// server.js
// load the things we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var upload = require('express-fileupload');

// a middleware function with no mount path. This code is executed for every request to the server
var middleware = function (req, res, next) {
  // Time of request
  var d = new Date();
  req.requestTime = d;
  var n = d.toDateString();
  var log;
  // GET
  if (req.method == "GET"){
      log = "Time "+n+" Request Type: "+req.method+" Request URL: "+req.originalUrl;
      console.log(log);
  }else {               // POST
      log = "Time "+n+" Request Type: "+req.method;
      var body = ' ';
      req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
          body = body.split(/[=&]+/);
          // First or Second request
          if (body.length == 2){
              // First request
              if (body[0].replace(' ', '') == 'serialnumber')
                  console.log(log+" Request by Serial Number(GetBook): "+body[1]);
              else        // Second request
                  console.log(log+" Request by Title of Book(GetAuthor): "+body[1].replace(new RegExp('\\+', 'g'), " "));
          }else{                        // Third request
              // by title
              if (body[1] == 'first')
                  console.log(log+" Request by Title of Book(GetCover) and Request book cover of "+body[3].replace(new RegExp('\\+', 'g'), " "));
              else        // by serial number
                  console.log(log+" Request by Serial Number(GetCover) and Request book cover of "+body[5]);
          }
      });
  }
  next();
};
app.use(middleware);
app.use(upload()); // configure middleware

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.json());
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

// require functions (GetBook, GetAuthor, GetCover)
var functions = require('./functions');
// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});
app.get('/about', function(req, res) {
    return res.sendStatus(404);
});

// upload page
app.get('/upload', function(req, res) {
    res.render('pages/upload');
});
app.get('/upload', function(req, res) {
    return res.sendStatus(404);
});
app.post('/upload',function(req,res){
  console.log(req.files);
  if(req.files != null && req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath = __dirname + '/uploads/' + name;
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
        console.log("File Uploaded",name);
        res.send('Done! Uploading files')
      }
    });
  }
  else {
    res.send("No File selected !");
    res.end();
  };
});

// answer1 page
app.post('/answer1', urlencodedParser, function(req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var ans;
    //first option
    if (!req.body.titlebook)
        ans = functions.getBook(req.body.serialnumber);
    else   //second option
        ans = functions.getAuthor(req.body.titlebook);
    res.render('pages/answer1', {answer: ans});
});
app.get('/answer1', function(req, res) {
    return res.sendStatus(404);
});
// answer2 page
app.post('/answer2', urlencodedParser, function(req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var ans;
    //first option
    if (!req.body.titlebook)
        ans = functions.getBook(req.body.serialnumber);
    else   //second option
        ans = functions.getAuthor(req.body.titlebook);
    res.render('pages/answer2', {answer: ans});
});
app.get('/answer2', function(req, res) {
    return res.sendStatus(404);
});
// answer3 page
app.post('/answer3', urlencodedParser, function(req, res) {
    if (!req.body)
        return res.sendStatus(400);
    var ans;
    // third option by title book
    if (req.body.option == "first")
        ans = functions.getCover(req.body.option, req.body.titlebook);
    else  // third option by serial number
        ans = functions.getCover(req.body.option, req.body.serialnumber);
    res.render('pages/answer3', {answer: ans});
});
app.get('/answer3', function(req, res) {
    return res.sendStatus(404);
});
// index page
app.get('/', function(req, res) {
   res.render('pages/index');
});

app.listen(8080);
console.log('listen 8080 port');
