import bcrypt from 'bcrypt';
import db from '../models/index.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await db.sequelize.sync({ force: false });

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Admin user
    const admin = await db.User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@eventplanner.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+1234567890'
    });

    // Organizer user
    const organizer = await db.User.create({
      firstName: 'John',
      lastName: 'Organizer',
      email: 'organizer@eventplanner.com',
      password: hashedPassword,
      role: 'organizer',
      phone: '+1234567891'
    });

    // Provider user
    const provider = await db.User.create({
      firstName: 'Jane',
      lastName: 'Provider',
      email: 'provider@eventplanner.com',
      password: hashedPassword,
      role: 'provider',
      phone: '+1234567892'
    });

    console.log('✅ Users created');

    // Create venues
    const venues = [
      {
        name: 'Grand Ballroom',
        description: 'Elegant ballroom perfect for weddings and corporate events',
        address: '123 Main Street',
        city: 'New York',
        capacity: 200,
        pricePerDay: 2500.00,
        amenities: 'Sound system, lighting, catering kitchen, parking',
        images: JSON.stringify(['ballroom1.jpg', 'ballroom2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Garden Pavilion',
        description: 'Beautiful outdoor venue with garden views',
        address: '456 Garden Ave',
        city: 'Los Angeles',
        capacity: 150,
        pricePerDay: 1800.00,
        amenities: 'Outdoor seating, garden access, weather protection',
        images: JSON.stringify(['garden1.jpg', 'garden2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Conference Center',
        description: 'Modern conference facility with latest technology',
        address: '789 Business Blvd',
        city: 'Chicago',
        capacity: 300,
        pricePerDay: 3200.00,
        amenities: 'AV equipment, WiFi, break rooms, parking',
        images: JSON.stringify(['conference1.jpg', 'conference2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Rooftop Terrace',
        description: 'Stunning rooftop venue with city skyline views',
        address: '321 Sky Tower',
        city: 'Miami',
        capacity: 100,
        pricePerDay: 2200.00,
        amenities: 'City views, bar area, outdoor heating',
        images: JSON.stringify(['rooftop1.jpg', 'rooftop2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Historic Mansion',
        description: 'Charming historic venue with classic architecture',
        address: '654 Heritage Lane',
        city: 'Boston',
        capacity: 120,
        pricePerDay: 2800.00,
        amenities: 'Historic charm, beautiful grounds, valet parking',
        images: JSON.stringify(['mansion1.jpg', 'mansion2.jpg']),
        providerId: provider.id
      }
    ];

    for (const venueData of venues) {
      await db.Venue.create(venueData);
    }

    console.log('✅ Venues created');

    // Create sample events
    const events = [
      {
        name: 'Tech Conference 2025',
        description: 'Annual technology conference for industry professionals',
        date: '2025-08-15',
        startTime: '09:00:00',
        endTime: '18:00:00',
        guestCount: 250,
        budget: 15000.00,
        status: 'published',
        organizerId: organizer.id
      },
      {
        name: 'Summer Wedding',
        description: 'Beautiful summer wedding celebration',
        date: '2025-07-20',
        startTime: '16:00:00',
        endTime: '23:00:00',
        guestCount: 120,
        budget: 8000.00,
        status: 'draft',
        organizerId: organizer.id
      }
    ];

    for (const eventData of events) {
      await db.Event.create(eventData);
    }

    console.log('✅ Events created');

    // Create sample notifications
    const notifications = [
      {
        userId: organizer.id,
        title: 'Welcome to EventPlanner!',
        message: 'Thank you for joining our platform. Start by creating your first event.',
        type: 'info',
        isRead: false
      },
      {
        userId: provider.id,
        title: 'Profile Complete',
        message: 'Your venue provider profile has been successfully set up.',
        type: 'success',
        isRead: false
      }
    ];

    for (const notificationData of notifications) {
      await db.Notification.create(notificationData);
    }

    console.log('✅ Notifications created');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('Test accounts:');
    console.log('Admin: admin@eventplanner.com / password123');
    console.log('Organizer: organizer@eventplanner.com / password123');
    console.log('Provider: provider@eventplanner.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
