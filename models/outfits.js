const mongoose = require("mongoose");

const outfitSchema = mongoose.Schema({
  username: String,
  top1: Object,
  top2: Object,
  bottom: Object,
  shoes: Object,
  accessory1: Object,
  accessory2: Object,
  accessory3: Object,
  isFavorite: Object,
  image: String,
  event: Object,
  id: String
});

const Outfit = mongoose.model("outfits", outfitSchema);

module.exports = Outfit;
