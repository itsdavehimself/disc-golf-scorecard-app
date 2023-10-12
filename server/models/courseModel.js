const mongoose = require('mongoose');

const { Schema } = mongoose;

const CourseSchema = new Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  par: { type: Number, required: true },
  holes: [{
    holeNumber: { type: Number, required: true },
    distance: { type: Number, required: true },
    par: { type: Number, required: true },
  }],

});

module.exports = mongoose.model('Course', CourseSchema);
