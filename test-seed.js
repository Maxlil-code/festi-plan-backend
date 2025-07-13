import db from './src/models/index.js';
import bcrypt from 'bcrypt';

async function testSeed() {
  try {
    console.log('🧪 Testing database connection...');
    
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Test user creation
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const [testUser] = await db.User.findOrCreate({
      where: { email: 'test@cameroon.com' },
      defaults: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@cameroon.com',
        password: hashedPassword,
        role: 'organizer',
        phone: '+237690000000'
      }
    });
    
    console.log('✅ Test user created/found:', testUser.firstName);
    
    // Test venue creation
    const testVenue = await db.Venue.create({
      name: 'Test Venue Douala',
      description: 'Un lieu de test à Douala',
      address: 'Test Address',
      city: 'Douala',
      capacity: 100,
      pricePerDay: 500000,
      amenities: 'Test amenities',
      images: JSON.stringify(['/test.jpg']),
      providerId: testUser.id
    });
    
    console.log('✅ Test venue created:', testVenue.name);
    
    // Clean up
    await testVenue.destroy();
    console.log('✅ Test cleanup completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSeed().then(() => {
  console.log('✅ Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test error:', error);
  process.exit(1);
});
