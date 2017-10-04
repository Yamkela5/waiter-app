var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var express = require('express');
var exphbs  = require('express-handlebars');
mongoose.connect('mongodb://localhost/my_database');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));



app.get('/username/:id', function(req, res){
  console.log(req.params.id);
  res.render('index',{msg: "Hello , " + req.params.id});
});

app.post('/username/:id', function (req, res) {
  res.render('waiter')
})













//run the server
var server = app.listen(3000);
