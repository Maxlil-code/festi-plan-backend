// Test script to verify draft events functionality
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000';

async function login() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'organizer@eventplanner.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  return data.token;
}

async function testDraftEvent() {
  try {
    console.log('🔑 Logging in...');
    const token = await login();
    
    console.log('📝 Testing draft event creation...');
    
    // Test 1: Create draft event with minimal data
    const draftResponse = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Draft Event',
        description: 'A test event in draft mode'
      })
    });
    
    if (draftResponse.ok) {
      const draftEvent = await draftResponse.json();
      console.log('✅ Draft event created successfully:', draftEvent.id);
      
      // Test 2: Try to update status to CONFIRMED without required fields
      console.log('🧪 Testing validation when finalizing draft...');
      
      const updateResponse = await fetch(`${BASE_URL}/api/events/${draftEvent.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'CONFIRMED'
        })
      });
      
      if (!updateResponse.ok) {
        console.log('✅ Validation correctly prevented confirming incomplete draft');
      } else {
        console.log('❌ Validation failed - should not allow confirming incomplete draft');
      }
      
      // Test 3: Complete the draft and then confirm
      console.log('📋 Completing draft with all required fields...');
      
      const completeResponse = await fetch(`${BASE_URL}/api/events/${draftEvent.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: '2025-08-15',
          startTime: '10:00:00',
          endTime: '18:00:00',
          guestCount: 100,
          budget: 5000,
          status: 'CONFIRMED'
        })
      });
      
      if (completeResponse.ok) {
        console.log('✅ Draft successfully completed and confirmed');
      } else {
        const error = await completeResponse.text();
        console.log('❌ Failed to complete draft:', error);
      }
      
    } else {
      const error = await draftResponse.text();
      console.log('❌ Failed to create draft event:', error);
    }
    
  } catch (error) {
    console.error('🚨 Test error:', error.message);
  }
}

testDraftEvent();
