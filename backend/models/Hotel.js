const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    destination: { type: String, required: true },
    region: { type: String, enum: ['nord', 'centre', 'sud'], required: true },
    etoiles: { type: Number, min: 1, max: 5 },
    price_adult: { type: Number, required: true },
    price_kid: { type: Number, required: true },
    discountPrice_adult: { type: Number },
    discountPrice_kid: { type: Number },
    summer_prices: {
      june: { adult: Number, kid: Number },
      july: { adult: Number, kid: Number },
      august: { adult: Number, kid: Number },
      september: { adult: Number, kid: Number }
    },
    image: { type: String },
    description: { type: String },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);
