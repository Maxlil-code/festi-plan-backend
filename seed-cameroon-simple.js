import db from './src/models/index.js';

async function addCameroonData() {
  try {
    console.log('🇨🇲 Adding Cameroon context data...');

    // Get existing users
    const organizer = await db.User.findOne({ where: { role: 'organizer' } });
    const provider = await db.User.findOne({ where: { role: 'provider' } });

    if (!organizer || !provider) {
      console.log('❌ No users found. Please run: node src/seeders/demo-data.js first');
      return;
    }

    console.log('✅ Found users:', organizer.firstName, 'and', provider.firstName);

    // Add Cameroon venues
    const cameroonVenues = [
      {
        name: 'Hôtel Akwa Palace Douala',
        description: 'Hôtel de luxe 5 étoiles au cœur de Douala avec salles de conférences modernes et vue sur le Wouri.',
        address: 'Boulevard de la Liberté, Akwa',
        city: 'Douala',
        capacity: 500,
        pricePerDay: 850000, // 850,000 FCFA
        amenities: 'Climatisation, Projecteur, Sonorisation, WiFi, Parking, Restauration, Bar, Piscine',
        images: JSON.stringify(['/images/akwa-palace.jpg']),
        providerId: provider.id
      },
      {
        name: 'Hilton Yaoundé',
        description: 'Hôtel international de prestige avec centre de conférences ultramoderne.',
        address: 'Boulevard du 20 Mai, Centre-ville',
        city: 'Yaoundé',
        capacity: 1000,
        pricePerDay: 1500000, // 1,500,000 FCFA
        amenities: 'Climatisation, Équipement audiovisuel HD, WiFi, Parking VIP, Restauration gastronomique',
        images: JSON.stringify(['/images/hilton-yaounde.jpg']),
        providerId: provider.id
      },
      {
        name: 'Salle des Fêtes de Bonapriso',
        description: 'Grande salle polyvalente pour mariages, baptêmes et événements familiaux.',
        address: 'Quartier Bonapriso',
        city: 'Douala',
        capacity: 300,
        pricePerDay: 450000, // 450,000 FCFA
        amenities: 'Sonorisation, Éclairage, Tables rondes, Chaises, Décoration basique',
        images: JSON.stringify(['/images/salle-bonapriso.jpg']),
        providerId: provider.id
      }
    ];

    const venues = await db.Venue.bulkCreate(cameroonVenues);
    console.log(`✅ Created ${venues.length} Cameroon venues`);

    // Add Cameroon events
    const cameroonEvents = [
      {
        name: 'Sommet Économique CEMAC 2025',
        description: 'Conférence économique régionale réunissant les dirigeants d\'entreprises de la sous-région.',
        date: '2025-08-15',
        startTime: '09:00:00',
        endTime: '17:00:00',
        guestCount: 500,
        budget: 15000000, // 15 millions FCFA
        status: 'planning',
        organizerId: organizer.id
      },
      {
        name: 'Mariage Traditionnel Bamiléké',
        description: 'Cérémonie de mariage traditionnel avec orchestres makossa et bikutsi.',
        date: '2025-07-25',
        startTime: '14:00:00',
        endTime: '02:00:00',
        guestCount: 400,
        budget: 8000000, // 8 millions FCFA
        status: 'confirmed',
        organizerId: organizer.id
      }
    ];

    const events = await db.Event.bulkCreate(cameroonEvents);
    console.log(`✅ Created ${events.length} Cameroon events`);

    // Add sample quotes
    const quotes = [
      {
        eventId: events[0].id, // Sommet CEMAC
        venueId: venues[1].id, // Hilton Yaoundé
        providerId: provider.id,
        items: JSON.stringify([
          { name: 'Location salle plénière', quantity: 1, unitPrice: 800000, description: 'Salle principale 500 personnes' },
          { name: 'Équipement audiovisuel HD', quantity: 1, unitPrice: 300000, description: 'Projecteurs, micros, sonorisation' },
          { name: 'Pause-café', quantity: 2, unitPrice: 150000, description: 'Café, thé, viennoiseries locales' },
          { name: 'Déjeuner buffet', quantity: 1, unitPrice: 400000, description: 'Menu international et local' }
        ]),
        subtotal: 1800000,
        vat: 334800, // 18.6% TVA Cameroun
        total: 2134800,
        status: 'draft',
        validUntil: '2025-08-01'
      },
      {
        eventId: events[1].id, // Mariage
        venueId: venues[2].id, // Salle Bonapriso
        providerId: provider.id,
        items: JSON.stringify([
          { name: 'Location salle festive', quantity: 1, unitPrice: 450000, description: 'Salle décorée tradition bamiléké' },
          { name: 'Orchestre makossa', quantity: 1, unitPrice: 300000, description: 'Groupe musical 6h' },
          { name: 'Décoration traditionnelle', quantity: 1, unitPrice: 200000, description: 'Pagnes, sculptures, fleurs' },
          { name: 'Traiteur local', quantity: 1, unitPrice: 800000, description: 'Menu traditionnel 400 personnes' }
        ]),
        subtotal: 1750000,
        vat: 325500, // 18.6% TVA
        total: 2075500,
        status: 'accepted',
        validUntil: '2025-07-15'
      }
    ];

    const createdQuotes = await db.Quote.bulkCreate(quotes);
    console.log(`✅ Created ${createdQuotes.length} quotes`);

    console.log('🎉 Cameroon data added successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${venues.length} venues (Douala, Yaoundé)`);
    console.log(`   - ${events.length} events (CEMAC Summit, Traditional Wedding)`);
    console.log(`   - ${createdQuotes.length} quotes with FCFA pricing`);

  } catch (error) {
    console.error('❌ Error adding Cameroon data:', error.message);
    console.error('Stack:', error.stack);
  }
}

addCameroonData().then(() => {
  console.log('✅ Cameroon data seeding completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Failed:', error);
  process.exit(1);
});
