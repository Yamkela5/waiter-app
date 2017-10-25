"use strict";
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
var message = '';

app.get('/waiters/:WaiterName', function(req, res, next) {
  var WaiterName = req.params.WaiterName;
  Model.findOne({WaiterName: WaiterName},function(err, ChosenDay){
    if(err){
      return err;
    }else{
    if(ChosenDay) {
      message = 'Please update your days ' + WaiterName;
  res.render('index', {
    WaiterName: message,
    monday: ChosenDay.days.Monday,
    tuesday: ChosenDay.days.Tuesday,
    wednesday: ChosenDay.days.Wednesday,
    thursday: ChosenDay.days.Thursday,
    friday: ChosenDay.days.Friday,
    saturday: ChosenDay.days.Saturday,
    sunday: ChosenDay.days.Sunday
  });
}
else {
  message = 'Please select your day(s) ' + WaiterName;
  res.render('index',{
    WaiterName : message
  })
}
}
})
});

function highlightDays(colorDay) {
  if (colorDay === 3) {
    return 'color1';
  } else if (colorDay < 3) {
    return 'color2';
  } else {
    return 'color3';
  }
}

app.post('/waiters/:WaiterName', function(req, res) {
  var output = 'Your shifts has been successfully updated';
  var shift = "Your shift has been successfully added";
  var days = req.body.days;
  var daysObj = {};
  // console.log(days);
  var WaiterName = req.params.WaiterName;
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
      WaiterName: WaiterName
    }, {
      days: daysObj
    },
    function(err, waiterName) {
      if (err) {
        console.log(err);
      } else {
        if (!waiterName) {
          var storingWaitersNames = new Model({
            WaiterName: WaiterName,
            days: daysObj
          });

          storingWaitersNames.save(function(err, waiterName) {
            if (err) {
              console.log('Error message:' + err);
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
        var daysLoop = workingWaiters[i].days;
        for (var avalaibleDay in daysLoop) {

          if (avalaibleDay === 'Monday') {
            Monday.push(workingWaiters[i].WaiterName)
          } else if (avalaibleDay === 'Tuesday') {
            Tuesday.push(workingWaiters[i].WaiterName)
          } else if (avalaibleDay === 'Wednesday') {
            Wednesday.push(workingWaiters[i].WaiterName)
          } else if (avalaibleDay === 'Thursday') {
            Thursday.push(workingWaiters[i].WaiterName)
          } else if (avalaibleDay === 'Friday') {
            Friday.push(workingWaiters[i].WaiterName)
          } else if (avalaibleDay === 'Saturday') {
            Saturday.push(workingWaiters[i].WaiterName)
          } else if (avalaibleDay === 'Sunday') {
            Sunday.push(workingWaiters[i].WaiterName)
          }
        }
      }
    }

    res.render('waiter', {
      monday: Monday,
      color1: highlightDays(Monday.length),
      tuesday: Tuesday,
      color2: highlightDays(Tuesday.length),
      wednesday: Wednesday,
      color3: highlightDays(Wednesday.length),
      thursday: Thursday,
      color4: highlightDays(Thursday.length),
      friday: Friday,
      color5: highlightDays(Friday.length),
      saturday: Saturday,
      color6: highlightDays(Saturday.length),
      sunday: Sunday,
      color7: highlightDays(Sunday.length)
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
