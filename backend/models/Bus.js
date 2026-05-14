const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    depart: { type: String, required: true },
    arrivee: { type: String, required: true },
    heure: { type: String, required: true },
    duree: { type: String },
    prix: { type: Number, required: true },
    discountPrice: { type: Number },
    date: { type: Date },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bus', busSchema);
