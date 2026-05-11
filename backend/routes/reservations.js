const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// GET all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create reservation / devis
router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update status
router.put('/:id', async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE reservation
router.delete('/:id', async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
