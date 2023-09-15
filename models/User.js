const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  weatherData: {
    type: Object
  }
});

module.exports = mongoose.model('User', userSchema);





/****************************************************************************************************** */




// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const userSchema = new Schema ({
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   location: {
//     type: String,
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true
//   }
// });

// module.exports = mongoose.model('User', userSchema);



