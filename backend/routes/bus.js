const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

router.get('/', async (req, res) => {
  try {
    const { depart, arrivee, all } = req.query;
    const filter = {};
    if (!all) filter.disponible = true;
    if (depart) filter.depart = new RegExp(depart, 'i');
    if (arrivee) filter.arrivee = new RegExp(arrivee, 'i');
    const buses = await Bus.find(filter).sort({ prix: 1 });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus non trouvé' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const bus = new Bus(req.body);
    const saved = await bus.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Bus non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Bus.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Bus non trouvé' });
    res.json({ message: 'Bus supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
