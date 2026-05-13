const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
const Voyage = require('./models/Voyage');
const Bus = require('./models/Bus');
require('dotenv').config();

const hotels = [
  { nom: 'Hôtel Carthage Thalasso', destination: 'Tunis', region: 'nord', etoiles: 5, price_adult: 180, price_kid: 90, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', description: 'Luxe à Gammarth', disponible: true },
  { nom: 'Hôtel Djerba Plaza', destination: 'Djerba', region: 'sud', etoiles: 4, price_adult: 120, price_kid: 60, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', description: 'Plage magnifique', disponible: true },
  { nom: 'Sousse Palace', destination: 'Sousse', region: 'centre', etoiles: 5, price_adult: 150, price_kid: 75, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', description: 'Vue mer', disponible: true }
];

const voyages = [
  { titre: 'Circuit Sud Tunisien', destination: 'Tozeur', duree: 5, price_adult: 650, price_kid: 325, type: 'circuit', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800', disponible: true },
  { titre: 'Séjour Istanbul', destination: 'Istanbul', duree: 7, price_adult: 1200, price_kid: 600, type: 'sejour', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', disponible: true }
];

const buses = [
  { depart: 'Tunis', arrivee: 'Sousse', heure: '08:00', prix: 15, disponible: true },
  { depart: 'Sousse', arrivee: 'Djerba', heure: '10:00', prix: 45, disponible: true }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Seed: Connected to MongoDB');
    await Hotel.deleteMany({});
    await Voyage.deleteMany({});
    await Bus.deleteMany({});
    
    await Hotel.insertMany(hotels);
    await Voyage.insertMany(voyages);
    await Bus.insertMany(buses);
    
    console.log('✅ Base de données initialisée avec succès !');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erreur seeding:', err);
    process.exit(1);
  });
