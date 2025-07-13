import db from '../models/index.js';

async function seedCameroonData() {
  try {
    console.log('🇨🇲 Starting Cameroon context database seeding...');

    // Get existing users (we assume they exist)
    const organizers = await db.User.findAll({ where: { role: 'organizer' } });
    const providers = await db.User.findAll({ where: { role: 'provider' } });

    if (organizers.length === 0 || providers.length === 0) {
      console.log('⚠️ Please seed users first before running this seeder');
      return;
    }

    // Clear existing data (except users)
    await db.Quote.destroy({ where: {} });
    await db.Booking.destroy({ where: {} });
    await db.Message.destroy({ where: {} });
    await db.Notification.destroy({ where: {} });
    await db.Event.destroy({ where: {} });
    await db.Venue.destroy({ where: {} });

    console.log('🗑️ Cleared existing data...');

    // Create Venues in Cameroon context
    const venuesData = [
      // Douala venues
      {
        name: 'Hôtel Akwa Palace',
        description: 'Hôtel de luxe 5 étoiles au cœur de Douala avec salles de conférences modernes et vue sur le Wouri.',
        address: 'Boulevard de la Liberté, Akwa',
        city: 'Douala',
        capacity: 500,
        pricePerDay: 850000, // 850,000 FCFA
        amenities: 'Climatisation, Projecteur, Sonorisation, WiFi, Parking, Restauration, Bar, Piscine',
        images: JSON.stringify(['/images/akwa-palace-1.jpg', '/images/akwa-palace-2.jpg']),
        providerId: providers[0 % providers.length].id
      },
      {
        name: 'Centre de Conférences de Douala',
        description: 'Centre moderne équipé pour tous types d\'événements corporatifs et séminaires.',
        address: 'Rue Joss, Bonanjo',
        city: 'Douala',
        capacity: 800,
        pricePerDay: 1200000, // 1,200,000 FCFA
        amenities: 'Climatisation, Projecteur 4K, Sonorisation professionnelle, WiFi haut débit, Parking sécurisé, Restauration',
        images: JSON.stringify(['/images/centre-conferences-douala.jpg']),
        providerId: providers[1 % providers.length].id
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
        providerId: providers[0 % providers.length].id
      },

      // Yaoundé venues
      {
        name: 'Hilton Yaoundé',
        description: 'Hôtel international de prestige avec centre de conférences ultramoderne.',
        address: 'Boulevard du 20 Mai, Centre-ville',
        city: 'Yaoundé',
        capacity: 1000,
        pricePerDay: 1500000, // 1,500,000 FCFA
        amenities: 'Climatisation, Équipement audiovisuel HD, Traduction simultanée, WiFi, Parking VIP, Restauration gastronomique',
        images: JSON.stringify(['/images/hilton-yaounde-1.jpg', '/images/hilton-yaounde-2.jpg']),
        providerId: providers[1 % providers.length].id
      },
      {
        name: 'Palais des Congrès de Yaoundé',
        description: 'Le plus grand centre de congrès du Cameroun, idéal pour les événements d\'envergure.',
        address: 'Avenue de l\'Indépendance',
        city: 'Yaoundé',
        capacity: 2000,
        pricePerDay: 2500000, // 2,500,000 FCFA
        amenities: 'Climatisation centrale, 5 salles modulables, Équipement audiovisuel complet, WiFi, Parking 500 places, Restauration',
        images: JSON.stringify(['/images/palais-congres-yaounde.jpg']),
        providerId: providers[0 % providers.length].id
      },
      {
        name: 'Centre Culturel Camerounais',
        description: 'Espace culturel authentique pour événements traditionnels et modernes.',
        address: 'Quartier Mfandena',
        city: 'Yaoundé',
        capacity: 400,
        pricePerDay: 600000, // 600,000 FCFA
        amenities: 'Sonorisation, Éclairage traditionnel/moderne, Espace extérieur, WiFi, Parking',
        images: JSON.stringify(['/images/centre-culturel-yaounde.jpg']),
        providerId: providers[1 % providers.length].id
      },

      // Bafoussam venues
      {
        name: 'Hôtel Continental Bafoussam',
        description: 'Hôtel moderne dans les hauts plateaux de l\'Ouest avec vue panoramique.',
        address: 'Route de Dschang',
        city: 'Bafoussam',
        capacity: 250,
        pricePerDay: 400000, // 400,000 FCFA
        amenities: 'Climatisation, Projecteur, Sonorisation, WiFi, Parking, Restauration locale',
        images: JSON.stringify(['/images/continental-bafoussam.jpg']),
        providerId: providers[0 % providers.length].id
      },
      {
        name: 'Complexe Touristique de Dschang',
        description: 'Centre de loisirs avec espaces de réception au cœur de la nature.',
        address: 'Route touristique de Dschang',
        city: 'Dschang',
        capacity: 180,
        pricePerDay: 320000, // 320,000 FCFA
        amenities: 'Espace extérieur, Sonorisation, Tables, Chaises, Vue sur lac, Parking',
        images: JSON.stringify(['/images/complexe-dschang.jpg']),
        providerId: providers[1 % providers.length].id
      },

      // Bamenda venues
      {
        name: 'Ayaba Hotel Bamenda',
        description: 'Hôtel réputé de la région du Nord-Ouest avec installations de conférence.',
        address: 'Commercial Avenue',
        city: 'Bamenda',
        capacity: 300,
        pricePerDay: 380000, // 380,000 FCFA
        amenities: 'Climatisation, Projecteur, Sonorisation bilingue, WiFi, Parking, Restauration',
        images: JSON.stringify(['/images/ayaba-bamenda.jpg']),
        providerId: providers[0 % providers.length].id
      },

      // Garoua venues
      {
        name: 'Ribadu Palace Hotel',
        description: 'Hôtel principal du Nord Cameroun avec centre de conférences climatisé.',
        address: 'Route de Maroua',
        city: 'Garoua',
        capacity: 200,
        pricePerDay: 350000, // 350,000 FCFA
        amenities: 'Climatisation renforcée, Projecteur, Sonorisation, WiFi, Parking sécurisé, Restauration',
        images: JSON.stringify(['/images/ribadu-garoua.jpg']),
        providerId: providers[1 % providers.length].id
      }
    ];

    const venues = await db.Venue.bulkCreate(venuesData);
    console.log(`✅ Created ${venues.length} venues`);

    // Create Events in Cameroon context
    const eventsData = [
      {
        name: 'Sommet Économique CEMAC 2025',
        description: 'Conférence économique régionale réunissant les dirigeants d\'entreprises de la sous-région.',
        date: '2025-08-15',
        startTime: '09:00:00',
        endTime: '17:00:00',
        guestCount: 500,
        budget: 15000000, // 15 millions FCFA
        status: 'planning',
        organizerId: organizers[0].id
      },
      {
        name: 'Festival des Arts et Cultures du Cameroun',
        description: 'Célébration de la diversité culturelle camerounaise avec spectacles et expositions.',
        date: '2025-09-20',
        startTime: '18:00:00',
        endTime: '23:00:00',
        guestCount: 800,
        budget: 25000000, // 25 millions FCFA
        status: 'planning',
        organizerId: organizers[1 % organizers.length].id
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
        organizerId: organizers[0].id
      },
      {
        name: 'Conférence sur l\'Agriculture Durable',
        description: 'Forum sur les techniques agricoles modernes adaptées au climat camerounais.',
        date: '2025-08-05',
        startTime: '08:30:00',
        endTime: '16:30:00',
        guestCount: 250,
        budget: 5000000, // 5 millions FCFA
        status: 'planning',
        organizerId: organizers[1 % organizers.length].id
      },
      {
        name: 'Lancement Produit MTN Cameroun',
        description: 'Événement corporate pour le lancement d\'un nouveau service télécoms.',
        date: '2025-08-30',
        startTime: '19:00:00',
        endTime: '22:00:00',
        guestCount: 300,
        budget: 12000000, // 12 millions FCFA
        status: 'draft',
        organizerId: organizers[0].id
      },
      {
        name: 'Séminaire Formation Entrepreneurs',
        description: 'Formation sur l\'entrepreneuriat digital pour les jeunes Camerounais.',
        date: '2025-09-10',
        startTime: '09:00:00',
        endTime: '17:00:00',
        guestCount: 150,
        budget: 3500000, // 3.5 millions FCFA
        status: 'planning',
        organizerId: organizers[1 % organizers.length].id
      }
    ];

    const events = await db.Event.bulkCreate(eventsData);
    console.log(`✅ Created ${events.length} events`);

    // Create Quotes
    const quotesData = [
      {
        eventId: events[0].id, // Sommet Économique CEMAC
        venueId: venues[3].id, // Hilton Yaoundé
        providerId: venues[3].providerId,
        items: JSON.stringify([
          { name: 'Location salle plénière', quantity: 1, unitPrice: 800000, description: 'Salle principale 500 personnes' },
          { name: 'Équipement audiovisuel HD', quantity: 1, unitPrice: 300000, description: 'Projecteurs, micros, sonorisation' },
          { name: 'Pause-café (matin/après-midi)', quantity: 2, unitPrice: 150000, description: 'Café, thé, viennoiseries locales' },
          { name: 'Déjeuner buffet', quantity: 1, unitPrice: 400000, description: 'Menu international et local' }
        ]),
        subtotal: 1800000,
        vat: 334800, // 18.6% TVA Cameroun
        total: 2134800,
        status: 'draft',
        validUntil: '2025-08-01'
      },
      {
        eventId: events[1].id, // Festival des Arts
        venueId: venues[4].id, // Palais des Congrès
        providerId: venues[4].providerId,
        items: JSON.stringify([
          { name: 'Location grande salle', quantity: 1, unitPrice: 1200000, description: 'Salle principale 800 personnes' },
          { name: 'Éclairage spectacle', quantity: 1, unitPrice: 500000, description: 'Éclairage professionnel couleurs' },
          { name: 'Sonorisation concert', quantity: 1, unitPrice: 600000, description: 'Système audio haute qualité' },
          { name: 'Sécurité événement', quantity: 1, unitPrice: 200000, description: 'Service de sécurité 8h' }
        ]),
        subtotal: 2500000,
        vat: 465000, // 18.6% TVA
        total: 2965000,
        status: 'sent',
        validUntil: '2025-09-01'
      },
      {
        eventId: events[2].id, // Mariage Traditionnel
        venueId: venues[2].id, // Salle Bonapriso
        providerId: venues[2].providerId,
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

    const quotes = await db.Quote.bulkCreate(quotesData);
    console.log(`✅ Created ${quotes.length} quotes`);

    // Create some Bookings (accepted quotes become bookings)
    const bookingsData = [
      {
        eventId: events[2].id, // Mariage - quote accepté
        venueId: venues[2].id,
        startDate: '2025-07-25',
        endDate: '2025-07-25',
        status: 'confirmed',
        totalCost: 2075500,
        paymentStatus: 'partial', // Acompte versé
        paymentMethod: 'bank_transfer'
      }
    ];

    const bookings = await db.Booking.bulkCreate(bookingsData);
    console.log(`✅ Created ${bookings.length} bookings`);

    // Create Messages (communications entre organisateurs et prestataires)
    const messagesData = [
      {
        senderId: organizers[0].id,
        receiverId: providers[0].id,
        subject: 'Demande de devis - Sommet CEMAC',
        message: 'Bonjour, nous souhaitons organiser un sommet économique. Pourriez-vous nous faire un devis pour le Hilton Yaoundé ?',
        isRead: true
      },
      {
        senderId: providers[0].id,
        receiverId: organizers[0].id,
        subject: 'Re: Demande de devis - Sommet CEMAC',
        message: 'Bonjour, merci pour votre demande. Voici notre proposition détaillée. Nous pouvons proposer un package complet incluant la restauration.',
        isRead: false
      },
      {
        senderId: organizers[1 % organizers.length].id,
        receiverId: providers[1].id,
        subject: 'Confirmation mariage traditionnel',
        message: 'Bonjour, nous confirmons la réservation pour le mariage traditionnel. Le versement de l\'acompte sera effectué cette semaine.',
        isRead: true
      }
    ];

    const messages = await db.Message.bulkCreate(messagesData);
    console.log(`✅ Created ${messages.length} messages`);

    // Create Notifications
    const notificationsData = [
      {
        userId: organizers[0].id,
        title: 'Nouveau devis reçu',
        message: 'Vous avez reçu un nouveau devis pour le Sommet Économique CEMAC 2025',
        type: 'quote_received',
        isRead: false
      },
      {
        userId: providers[0].id,
        title: 'Devis accepté',
        message: 'Votre devis pour le mariage traditionnel a été accepté. Félicitations !',
        type: 'quote_accepted',
        isRead: false
      },
      {
        userId: organizers[1 % organizers.length].id,
        title: 'Rappel de paiement',
        message: 'N\'oubliez pas de verser l\'acompte pour votre événement du 25 juillet',
        type: 'payment_reminder',
        isRead: false
      },
      {
        userId: providers[1].id,
        title: 'Nouvelle demande',
        message: 'Une nouvelle demande de devis pour le Festival des Arts vous attend',
        type: 'quote_request',
        isRead: false
      }
    ];

    const notifications = await db.Notification.bulkCreate(notificationsData);
    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('🎉 Cameroon context database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${venues.length} venues (Douala, Yaoundé, Bafoussam, Bamenda, Garoua)`);
    console.log(`   - ${events.length} events (corporate, cultural, traditional)`);
    console.log(`   - ${quotes.length} quotes (various statuses)`);
    console.log(`   - ${bookings.length} bookings (confirmed events)`);
    console.log(`   - ${messages.length} messages (communications)`);
    console.log(`   - ${notifications.length} notifications`);

  } catch (error) {
    console.error('❌ Error seeding Cameroon data:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCameroonData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default seedCameroonData;
