const mongoose = require('mongoose');

const clotheSchema = mongoose.Schema({
  username: String,
  name: String,
  maintype: String,
  color: Object,
  image: String,
  subtype: String,
  brand: String,
  event: Object,
  material: String,
  cut: String,
  season: Object,
  waterproof: String,
  id: String
});

const Clothe = mongoose.model('clothes', clotheSchema);

module.exports = Clothe;