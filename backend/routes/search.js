const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const Voyage = require('../models/Voyage');

// POST /api/search/hotels
router.post('/hotels', async (req, res) => {
  try {
    const { destination, mois, nombrePersonnes } = req.body;
    const filter = { disponible: true };
    if (destination && destination !== 'toutes') {
      filter.destination = new RegExp(destination, 'i');
    }
    const hotels = await Hotel.find(filter).sort({ prixParNuit: 1 });
    res.json({ hotels, mois, nombrePersonnes, total: hotels.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/search/voyages
router.post('/voyages', async (req, res) => {
  try {
    const { destination, mois, nombrePersonnes, type } = req.body;
    const filter = { disponible: true };
    if (destination && destination !== 'toutes') {
      filter.destination = new RegExp(destination, 'i');
    }
    if (type) filter.type = type;
    const voyages = await Voyage.find(filter).sort({ prix: 1 });
    res.json({ voyages, mois, nombrePersonnes, total: voyages.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
