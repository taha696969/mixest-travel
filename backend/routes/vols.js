const express = require('express');
const router = express.Router();
const Vol = require('../models/Vol');

// GET all vols (with optional destination filter)
router.get('/', async (req, res) => {
  try {
    const { destination, all } = req.query;
    const filter = {};
    if (!all) filter.disponible = true;
    if (destination) {
      filter.$or = [
        { destination: new RegExp(destination, 'i') },
        { destination2: new RegExp(destination, 'i') }
      ];
    }
    const vols = await Vol.find(filter).sort({ destination: 1 });
    res.json(vols);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single vol
router.get('/:id', async (req, res) => {
  try {
    const vol = await Vol.findById(req.params.id);
    if (!vol) return res.status(404).json({ message: 'Vol non trouvé' });
    res.json(vol);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create vol
router.post('/', async (req, res) => {
  try {
    const vol = new Vol(req.body);
    const saved = await vol.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update vol
router.put('/:id', async (req, res) => {
  try {
    const updated = await Vol.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Vol non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE vol
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Vol.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Vol non trouvé' });
    res.json({ message: 'Vol supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
