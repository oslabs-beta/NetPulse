const mongoose = require('mongoose');

//create movie schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  watched: { type: Boolean, required: true }
});

mongoose.models = {};

const Movies = mongoose.model('Movies',movieSchema,'Movies');

module.exports = Movies; // <-- export your model
