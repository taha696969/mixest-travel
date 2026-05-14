const express = require('express');
const router = express.Router();
const Voyage = require('../models/Voyage');

router.get('/', async (req, res) => {
  try {
    const { type, destination, pays, all } = req.query;
    const filter = {};
    if (!all) filter.disponible = true;
    if (type) filter.type = type;
    if (destination) {
      filter.$or = [
        { destination: new RegExp(destination, 'i') },
        { destination2: new RegExp(destination, 'i') }
      ];
    }
    if (pays) filter.pays = new RegExp(pays, 'i');
    const voyages = await Voyage.find(filter).sort({ price_adult: 1 });
    res.json(voyages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id);
    if (!voyage) return res.status(404).json({ message: 'Voyage non trouvé' });
    res.json(voyage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const voyage = new Voyage(req.body);
    const saved = await voyage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Voyage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Voyage non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Voyage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Voyage non trouvé' });
    res.json({ message: 'Voyage supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
