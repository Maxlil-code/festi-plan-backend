import bcrypt from 'bcrypt';
import db from '../models/index.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await db.sequelize.sync({ force: false });

    // Create users with findOrCreate to avoid duplicates
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Admin user
    const [admin] = await db.User.findOrCreate({
      where: { email: 'admin@eventplanner.com' },
      defaults: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@eventplanner.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+1234567890'
      }
    });

    // Organizer user
    const [organizer] = await db.User.findOrCreate({
      where: { email: 'organizer@eventplanner.com' },
      defaults: {
        firstName: 'John',
        lastName: 'Organizer',
        email: 'organizer@eventplanner.com',
        password: hashedPassword,
        role: 'organizer',
        phone: '+1234567891'
      }
    });

    // Provider user
    const [provider] = await db.User.findOrCreate({
      where: { email: 'provider@eventplanner.com' },
      defaults: {
        firstName: 'Jane',
        lastName: 'Provider',
        email: 'provider@eventplanner.com',
        password: hashedPassword,
        role: 'provider',
        phone: '+1234567892'
      }
    });

    console.log('✅ Users created');

    // Delete all existing venues to add new ones
    await db.Venue.destroy({ where: {} });
    console.log('🗑️ Existing venues cleared');

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
      },
      {
        name: 'Lakeside Lodge',
        description: 'Rustic lodge with beautiful lake views and outdoor activities',
        address: '987 Lake Road',
        city: 'Denver',
        capacity: 80,
        pricePerDay: 1500.00,
        amenities: 'Lake access, fire pit, outdoor games, catering kitchen',
        images: JSON.stringify(['lodge1.jpg', 'lodge2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Art Gallery Loft',
        description: 'Modern artistic space perfect for creative events',
        address: '246 Arts District',
        city: 'San Francisco',
        capacity: 60,
        pricePerDay: 1200.00,
        amenities: 'Art displays, modern lighting, sound system',
        images: JSON.stringify(['gallery1.jpg', 'gallery2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Beach Club',
        description: 'Oceanfront venue with beach access and sunset views',
        address: '135 Ocean Drive',
        city: 'San Diego',
        capacity: 180,
        pricePerDay: 3500.00,
        amenities: 'Beach access, ocean views, bar service, outdoor seating',
        images: JSON.stringify(['beach1.jpg', 'beach2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Industrial Warehouse',
        description: 'Trendy converted warehouse space for modern events',
        address: '789 Industrial Way',
        city: 'Portland',
        capacity: 250,
        pricePerDay: 2000.00,
        amenities: 'Open space, exposed brick, loading dock access, flexible layout',
        images: JSON.stringify(['warehouse1.jpg', 'warehouse2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Country Club',
        description: 'Elegant country club with golf course views',
        address: '456 Golf Course Drive',
        city: 'Dallas',
        capacity: 220,
        pricePerDay: 4000.00,
        amenities: 'Golf course views, full service bar, valet parking, professional kitchen',
        images: JSON.stringify(['country1.jpg', 'country2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Mountain Lodge',
        description: 'Scenic mountain retreat perfect for intimate gatherings',
        address: '321 Mountain View Road',
        city: 'Aspen',
        capacity: 40,
        pricePerDay: 1800.00,
        amenities: 'Mountain views, fireplace, rustic decor, outdoor deck',
        images: JSON.stringify(['mountain1.jpg', 'mountain2.jpg']),
        providerId: provider.id
      },
      {
        name: 'Urban Penthouse',
        description: 'Luxury penthouse venue in the heart of the city',
        address: '654 Downtown Plaza',
        city: 'Seattle',
        capacity: 90,
        pricePerDay: 3800.00,
        amenities: 'City skyline views, modern amenities, private elevator, premium bar',
        images: JSON.stringify(['penthouse1.jpg', 'penthouse2.jpg']),
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
