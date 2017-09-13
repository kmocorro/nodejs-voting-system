var express = require('express');
var app = express();
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var apiController = require('./controllers/apiController');

var port = process.env.PORT || 5000;


app.use('/', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
 name: 'session',
 keys: ['key1', 'key2']
}));

app.get('/', function(req, res){
    res.render('index');
});

apiController(app);

app.listen(port);
