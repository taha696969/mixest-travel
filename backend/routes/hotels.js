const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// GET all hotels with optional filters
router.get('/', async (req, res) => {
  try {
    const { destination, region, etoiles, all } = req.query;
    const filter = {};
    if (!all) filter.disponible = true;
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (region) filter.region = region;
    if (etoiles) filter.etoiles = parseInt(etoiles);
    const hotels = await Hotel.find(filter).sort({ price_adult: 1 });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hôtel non trouvé' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create hotel
router.post('/', async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    const saved = await hotel.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update hotel
router.put('/:id', async (req, res) => {
  try {
    const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Hôtel non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE delete hotel
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Hotel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Hôtel non trouvé' });
    res.json({ message: 'Hôtel supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
