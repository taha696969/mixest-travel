const mongoose = require('mongoose');

const voyageSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    destination: { type: String, required: true },
    pays: { type: String, required: true },
    date_debut: { type: Date },
    date_fin: { type: Date },
    duree: { type: Number, required: true }, // in days
    price_adult: { type: Number, required: true },
    price_kid: { type: Number, required: true },
    discountPrice_adult: { type: Number },
    discountPrice_kid: { type: Number },
    stopPoints: [{ type: String }],
    image: { type: String },
    description: { type: String },
    type: {
      type: String,
      enum: ['circuit', 'aventure', 'sejour', 'culturel'],
      default: 'circuit',
    },
    isCombined: { type: Boolean, default: false },
    destination2: { type: String },
    places_dispo: { type: Number, default: 0 },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voyage', voyageSchema);
