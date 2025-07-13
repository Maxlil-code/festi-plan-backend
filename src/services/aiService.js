import { openai } from '../utils/openaiClient.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

// 8.1 Venue recommendations
export async function recommendVenues({ guestCount, budgetMin, budgetMax }) {
  // Fetch up to 10 matching venues
  const candidates = await db.Venue.findAll({
    where: { 
      capacity: { [Op.gte]: guestCount },
      pricePerDay: { 
        [Op.between]: [budgetMin || 0, budgetMax || 999999] 
      }
    },
    include: [
      {
        model: db.User,
        as: 'provider',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
    order: [['pricePerDay', 'ASC']],
    limit: 10,
  });

  if (candidates.length === 0) {
    return [];
  }

  try {
    // Build prompt for GPT‑4o‑mini
    const system = 'You are an expert event‑planning assistant. Return the 3 most suitable venues as a JSON array of their IDs only. Consider capacity, price, and location.';
    const user = `Guest count: ${guestCount}
Budget: $${budgetMin}-$${budgetMax}
Venues: ${candidates.map(v => `${v.id}:${v.name} (cap ${v.capacity}, $${v.pricePerDay}/day, ${v.city})`).join('; ')}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.2,
      max_tokens: 128,
    });

    let orderedIds;
    try {
      orderedIds = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      orderedIds = candidates.slice(0, 3).map(v => v.id); // Fallback
    }
    
    return db.Venue.findAll({ 
      where: { id: orderedIds.slice(0, 3) },
      include: [
        {
          model: db.User,
          as: 'provider',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to first 3 candidates
    return candidates.slice(0, 3);
  }
}

// 8.2 Quote generation
export async function generateQuote({ venueId, eventId }) {
  const venue = await db.Venue.findByPk(venueId);
  const event = await db.Event.findByPk(eventId);

  if (!venue || !event) {
    throw { status: 404, message: 'Venue or event not found' };
  }

  try {
    const system = 'You are an AI that drafts short JSON quotes for events. Return valid JSON with fields: items[], subtotal, vat (15%), total.';
    const user = `Prepare a breakdown for event "${event.name}" on ${event.date} at venue "${venue.name}" ($${venue.pricePerDay}/day). Output fields: items[], subtotal, vat (15%), total.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.1,
      max_tokens: 256,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback quote
    const subtotal = parseFloat(venue.pricePerDay);
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    return {
      items: [
        {
          description: `Venue rental - ${venue.name}`,
          quantity: 1,
          unitPrice: subtotal,
          total: subtotal
        }
      ],
      subtotal: subtotal,
      vat: vat,
      total: total
    };
  }
}

export async function analyzeRequirements({ eventDescription, guestCount, budget, preferences }) {
  try {
    const system = 'You are an expert event planning assistant. Analyze the requirements and provide structured recommendations. If some information is missing or "To be determined", provide suggestions for what information is needed and general recommendations.';
    
    const user = `Event: ${eventDescription || 'Event planning in progress'}
Guests: ${guestCount || 'To be determined'}
Budget: $${budget || 'To be determined'}
Preferences: ${preferences || 'None specified'}

Provide analysis with recommendations for venue type, catering, and special considerations. If information is missing, suggest what details would be helpful.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    return {
      analysis: completion.choices[0].message.content,
      recommendations: {
        venueType: 'Based on available information',
        catering: 'Recommended options',
        specialConsiderations: 'Important planning notes',
        nextSteps: 'What information to gather next'
      }
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      analysis: 'Unable to analyze requirements at this time. Please ensure the event has basic details like description, guest count, and budget for better analysis.',
      recommendations: {
        venueType: 'General venue suitable for the guest count',
        catering: 'Standard catering options',
        specialConsiderations: 'Consider accessibility and parking',
        nextSteps: 'Add more event details for better recommendations'
      }
    };
  }
}
