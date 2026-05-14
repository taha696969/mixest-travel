require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
const path = require('path');

app.use(cors()); // Enable CORS for all during transition
app.use(express.json());

// API Routes
const hotelRoutes = require('./routes/hotels');
const voyageRoutes = require('./routes/voyages');
const busRoutes = require('./routes/bus');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');
const volRoutes = require('./routes/vols');
const reservationRoutes = require('./routes/reservations');
const cityRoutes = require('./routes/cities');

app.use('/api/hotels', hotelRoutes);
app.use('/api/voyages', voyageRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vols', volRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/cities', cityRoutes);

// ── Stats endpoint for admin dashboard ──
app.get('/api/stats', async (req, res) => {
  try {
    const Hotel = require('./models/Hotel');
    const Voyage = require('./models/Voyage');
    const Bus = require('./models/Bus');
    const Vol = require('./models/Vol');
    const Reservation = require('./models/Reservation');
    const City = require('./models/City');
    const [hotels, voyages, buses, vols, reservations, cities] = await Promise.all([
      Hotel.countDocuments(),
      Voyage.countDocuments(),
      Bus.countDocuments(),
      Vol.countDocuments(),
      Reservation.countDocuments(),
      City.countDocuments(),
    ]);
    const promoHotels = await Hotel.countDocuments({ $or: [{ discountPrice_adult: { $exists: true, $ne: null } }, { summer_prices: { $exists: true } }] });
    const promoVoyages = await Voyage.countDocuments({ discountPrice_adult: { $exists: true, $ne: null } });
    const pendingRes = await Reservation.countDocuments({ statut: 'en_attente' });
    res.json({ hotels, voyages, buses, vols, reservations, cities, promoHotels, promoVoyages, pendingRes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Navigation endpoint to show only what's present ──
app.get('/api/navigation', async (req, res) => {
  try {
    const Hotel = require('./models/Hotel');
    const Voyage = require('./models/Voyage');
    
    let [hotelCities, voyageCountries] = await Promise.all([
      Hotel.distinct('destination', { disponible: true }),
      Voyage.distinct('pays', { disponible: true })
    ]);

    hotelCities = hotelCities.filter(c => c);
    voyageCountries = voyageCountries.filter(p => p);

    // Group hotel cities by region for the mega menu
    const hotelsByRegion = await Hotel.aggregate([
      { $match: { disponible: true } },
      { $group: { _id: "$region", cities: { $addToSet: "$destination" } } }
    ]);

    res.json({ 
      hotelCities, 
      voyageCountries,
      hotelsByRegion: hotelsByRegion.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.cities }), {})
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve Static Files (Angular)
app.use(express.static(path.join(__dirname, 'public')));

// Wildcard route for Angular SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    const Hotel = require('./models/Hotel');
    const Voyage = require('./models/Voyage');
    const Bus = require('./models/Bus');
    const City = require('./models/City');
    const Vol = require('./models/Vol');
    const Reservation = require('./models/Reservation');

    await Hotel.createCollection().catch(e => {});
    await Voyage.createCollection().catch(e => {});
    await Bus.createCollection().catch(e => {});
    await City.createCollection().catch(e => {});
    await Vol.createCollection().catch(e => {});
    await Reservation.createCollection().catch(e => {});

    console.log('✅ MongoDB collections ensured.');
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
