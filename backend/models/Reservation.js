const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['hotel', 'vol'], required: true },
    reference_id: { type: String },
    reference_nom: { type: String },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    portable: { type: String, required: true },
    email: { type: String, required: true },
    // Hotel specific
    date_debut: { type: Date },
    date_fin: { type: Date },
    adultes: { type: Number },
    enfants: { type: Number },
    prix_total: { type: Number },
    // Vol specific
    compagnie: { type: String },
    classe: { type: String },
    statut: {
      type: String,
      enum: ['en_attente', 'confirmee', 'annulee'],
      default: 'en_attente'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
