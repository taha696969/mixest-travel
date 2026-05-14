const mongoose = require('mongoose');

const compagnieSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  logo: { type: String }, // New
  date_depart: { type: String }, // New (ex: "12 Mai 08:00")
  date_arrivee: { type: String }, // New (ex: "12 Mai 11:30")
  duree_texte: { type: String }, // New (ex: "8j/7n")
  prix_adulte: { type: Number, required: true },
  prix_enfant: { type: Number, required: true },
  places_dispo: { type: Number, default: 0 },
  classe: { type: String, default: 'Économique' },
  disponible: { type: Boolean, default: true }
});

const volSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true }, // e.g. "Turquie"
    pays: { type: String, required: true },          // e.g. "Istanbul, Ankara"
    image: { type: String },
    description: { type: String },
    isCombined: { type: Boolean, default: false },
    destination2: { type: String },
    compagnies: [compagnieSchema],
    disponible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vol', volSchema);
