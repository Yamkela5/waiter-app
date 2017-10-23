//index
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var Model = require('./models');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static('public'));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
var text = '';
app.get('/waiters/:waiterNames', function(req, res, next) {
  var waiterNames = req.params.waiterNames;
  Model.findOne({waiterNames: waiterNames},function(err, ChoosedShift){
    if(err){
      return err;
    }else{
    if(ChoosedShift) {
      text = 'Please update your days ' + waiterNames;
  res.render('index', {
    waiterNames: text,
    monday: ChoosedShift.days.Monday,
    tuesday: ChoosedShift.days.Tuesday,
    wednesday: ChoosedShift.days.Wednesday,
    thursday: ChoosedShift.days.Thursday,
    friday: ChoosedShift.days.Friday,
    saturday: ChoosedShift.days.Saturday,
    sunday: ChoosedShift.days.Sunday
  });
}
else {
  text = 'Please select your day(s) ' + waiterNames;
  res.render('index',{
    waiterNames : text
  })
}
}
})
});

app.post('/waiters/:waiterNames', function(req, res) {
  var output = 'Your shifts has been sucesssful updated!';
  var shift = "Your shift has been successfully added!";
  var days = req.body.days;
  var daysObj = {};
  var waiterNames = req.params.waiterNames;
  if(!days){
    var text ='Please select atleast one day';
    res.render('index',{
      msg: text
    })
    return
  }

  if (!Array.isArray(days)) {
    days = [days];
  }

  days.forEach(function(daySelected) {
    daysObj[daySelected] = true
  })
  Model.findOneAndUpdate({
      waiterNames: waiterNames
    }, {
      days: daysObj
    },
    function(err, waiterName) {
      if (err) {
        console.log(err);
      } else {
        if (!waiterName) {

          var storingWaitersNames = new Model({
            waiterNames: waiterNames,
            days: daysObj
          });
          storingWaitersNames.save(function(err, waiterName) {
            if (err) {
              console.log('Error text:' + err);
            } else {
              res.render('index', {
                output: shift,
                monday: waiterName.days.Monday,
                tuesday: waiterName.days.Tuesday,
                wednesday: waiterName.days.Wednesday,
                thursday: waiterName.days.Thursday,
                friday: waiterName.days.Friday,
                saturday: waiterName.days.Saturday,
                sunday: waiterName.days.Sunday
              })
            }
          })
        } else {
          res.render('index', {
            output: output,
            monday: waiterName.days.Monday,
            tuesday: waiterName.days.Tuesday,
            wednesday: waiterName.days.Wednesday,
            thursday: waiterName.days.Thursday,
            friday: waiterName.days.Friday,
            saturday: waiterName.days.Saturday,
            sunday: waiterName.days.Sunday
          });
        }
      }
    });
});
app.get('/days', function(req, res) {
  Model.find({}, function(err, workingWaiters) {
    var Monday = [];
    var Tuesday = [];
    var Wednesday = [];
    var Thursday = [];
    var Friday = [];
    var Saturday = [];
    var Sunday = [];
    if (err) {
      return err;
    } else {
      for (var i = 0; i < workingWaiters.length; i++) {
        var day = workingWaiters[i].days;
        for (var ChosenDay in day) {

          if (ChosenDay === 'Monday') {
            Monday.push(workingWaiters[i].waiterNames)
          } else if (ChosenDay === 'Tuesday') {
            Tuesday.push(workingWaiters[i].waiterNames)
          } else if (ChosenDay === 'Wednesday') {
            Wednesday.push(workingWaiters[i].waiterNames)
          } else if (ChosenDay === 'Thursday') {
            Thursday.push(workingWaiters[i].waiterNames)
          } else if (ChosenDay === 'Friday') {
            Friday.push(workingWaiters[i].waiterNames)
          } else if (ChosenDay === 'Saturday') {
            Saturday.push(workingWaiters[i].waiterNames)
          } else if (ChosenDay === 'Sunday') {
            Sunday.push(workingWaiters[i].waiterNames)
          }
        }
      }
    }

    res.render('waiter', {
      monday: Monday,
      tuesday: Tuesday,
      wednesday: Wednesday,
      thursday: Thursday,
      friday: Friday,
      saturday: Saturday,
      sunday: Sunday,

    });
  });
})
app.post('/reset', function(req, res) {
  Model.remove({}, function(err, remove) {
    if (err) {
      return err;
    }
    res.render('index')
  })
});
var port = process.env.PORT || 5000
var server = app.listen(port, function() {
  console.log("Started app on port : " + port)
});
