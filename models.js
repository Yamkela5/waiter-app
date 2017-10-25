
var mongoose = require('mongoose');
const MongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/waiters";
console.log(MongoURL);
mongoose.connect(MongoURL, {
  useMongoClient: true
});


var saveWaiters = mongoose.model('saveWaiters', {
  WaiterName: String,
  days: Object
 });

module.exports = saveWaiters;
