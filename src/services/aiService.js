import { geminiClient } from '../utils/geminiClient.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

// 8.1 Venue recommendations with real database venues
export async function recommendVenues({ guestCount, budgetMin, budgetMax }) {
  // Fetch matching venues from database
  const candidates = await getAvailableVenues({ 
    guestCount, 
    budget: budgetMax || budgetMin 
  });

  if (candidates.length === 0) {
    console.log('⚠️ No venues found matching criteria');
    return [];
  }

  // Use Gemini AI for intelligent recommendations if available
  if (geminiClient) {
    try {
      const prompt = `You are an expert event planning assistant. Based on the following venues from our database, recommend the 3 most suitable ones for this event.

Event Requirements:
- Guest count: ${guestCount}
- Budget range: $${budgetMin || 0} - $${budgetMax || 'unlimited'}

Available Venues:
${candidates.map(v => 
  `ID: ${v.id} | ${v.name} | Capacity: ${v.capacity} | Price: $${v.pricePerDay}/day | City: ${v.city} | Amenities: ${v.amenities}`
).join('\n')}

Return ONLY a JSON array of venue IDs (numbers) for the 3 best matches, ordered by suitability. Consider capacity match, price within budget, and venue features.

Example format: [1, 3, 5]`;

      const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('🤖 Gemini response:', text);
      
      let orderedIds;
      try {
        // Clean the response and parse JSON
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        orderedIds = JSON.parse(cleanText);
        
        // Validate that we got an array of numbers
        if (!Array.isArray(orderedIds) || !orderedIds.every(id => typeof id === 'number')) {
          throw new Error('Invalid response format');
        }
      } catch (e) {
        console.warn('⚠️ Failed to parse Gemini response, using fallback:', e.message);
        orderedIds = candidates.slice(0, 3).map(v => v.id);
      }
      
      // Return venues in the AI-recommended order
      const recommendedVenues = await db.Venue.findAll({ 
        where: { id: orderedIds.slice(0, 3) },
        include: [
          {
            model: db.User,
            as: 'provider',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });
      
      // Ensure we maintain the AI's recommended order
      const sortedVenues = orderedIds.map(id => 
        recommendedVenues.find(venue => venue.id === id)
      ).filter(Boolean);
      
      return sortedVenues;
      
    } catch (error) {
      console.error('❌ Gemini API error:', error.message);
      // Fallback to first 3 candidates
      return candidates.slice(0, 3);
    }
  } else {
    // No AI available, return best matches by price
    console.log('⚠️ Using fallback venue selection (no AI)');
    return candidates.slice(0, 3);
  }
}

// 8.2 Quote generation with Gemini
export async function generateQuote({ venueId, eventId }) {
  const venue = await db.Venue.findByPk(venueId);
  const event = await db.Event.findByPk(eventId);

  if (!venue || !event) {
    throw { status: 404, message: 'Venue or event not found' };
  }

  if (geminiClient) {
    try {
      const prompt = `You are a professional event cost estimator. Generate a detailed quote for this event.

Event Details:
- Name: ${event.name}
- Date: ${event.date}
- Guest Count: ${event.guestCount || 'TBD'}
- Budget: $${event.budget || 'TBD'}

Venue Details:
- Name: ${venue.name}
- Price per day: $${venue.pricePerDay}
- Capacity: ${venue.capacity}
- Amenities: ${venue.amenities}

Generate a comprehensive quote in this exact JSON format:
{
  "items": [
    {
      "description": "item description",
      "quantity": 1,
      "unitPrice": price_number,
      "total": total_number
    }
  ],
  "subtotal": subtotal_number,
  "vat": vat_number,
  "total": total_number,
  "breakdown": {
    "venue": amount,
    "catering": amount,
    "services": amount
  },
  "notes": "Additional recommendations"
}

Calculate 15% VAT on subtotal. Base estimates on realistic event costs.`;

      const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean and parse JSON response
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
      
    } catch (error) {
      console.error('❌ Gemini API error for quote generation:', error.message);
      // Use fallback
    }
  }
  
  // Fallback quote generation
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
    total: total,
    breakdown: {
      venue: subtotal,
      catering: 0,
      services: 0
    },
    notes: "Basic venue rental quote. Contact venue for additional services."
  };
}

// 8.3 Event requirements analysis with Gemini and real venue data
export async function analyzeRequirements({ eventDescription, guestCount, budget, preferences }) {
  // Get available venues to provide specific recommendations
  const availableVenues = await getAvailableVenues({ 
    guestCount, 
    budget,
    city: null // Don't filter by city for analysis
  });

  if (geminiClient) {
    try {
      const prompt = `You are an expert event planning consultant. Analyze the following event requirements and provide detailed insights and recommendations based on our available venues.

Event Requirements:
- Description: ${eventDescription || 'Event planning in progress'}
- Guest Count: ${guestCount || 'To be determined'}
- Budget: $${budget || 'To be determined'}
- Preferences: ${preferences || 'None specified'}

Available Venues in Our Database:
${availableVenues.slice(0, 5).map(v => 
  `- ${v.name} (${v.city}): Capacity ${v.capacity}, $${v.pricePerDay}/day, ${v.amenities}`
).join('\n')}

Provide analysis in this exact JSON format:
{
  "analysis": {
    "eventType": "specific analysis based on description",
    "complexity": "low/medium/high based on guest count and requirements",
    "planningTime": "specific timeline based on event complexity",
    "riskFactors": ["specific risks for this type of event"]
  },
  "recommendations": {
    "immediate": ["specific actions relevant to this event"],
    "shortTerm": ["actions for next 2-4 weeks"],
    "longTerm": ["actions for 1-3 months out"]
  },
  "budgetInsights": {
    "adequacy": "assessment based on actual budget vs venue costs",
    "suggestions": ["specific budget recommendations for this event"],
    "costOptimization": ["ways to save money with our available venues"]
  },
  "venueRecommendations": {
    "topChoices": ["names of 2-3 most suitable venues from our database"],
    "reasons": ["why these venues work for this event"],
    "alternatives": ["backup venue options"]
  }
}

Base your recommendations on the actual venues we have available and the specific event requirements provided.`;

      const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean and parse JSON response
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanText);
      
    } catch (error) {
      console.error('❌ Gemini API error for requirements analysis:', error.message);
      // Use enhanced fallback with real venue data
    }
  }
  
  // Enhanced fallback analysis with real venue data
  const complexity = determineEventComplexity(guestCount, eventDescription);
  const topVenues = availableVenues.slice(0, 3);
  
  return {
    analysis: {
      eventType: eventDescription ? `${eventDescription} - ${getEventTypeFromDescription(eventDescription)}` : "General event planning",
      complexity: complexity,
      planningTime: complexity === "high" ? "4-6 months recommended" : complexity === "medium" ? "2-4 months recommended" : "6-8 weeks minimum",
      riskFactors: getEventSpecificRisks(eventDescription, guestCount)
    },
    recommendations: {
      immediate: [
        "Review available venues from our database",
        guestCount ? `Confirm final guest count (currently ${guestCount})` : "Determine approximate guest count",
        budget ? `Budget allocation: $${budget} total` : "Establish event budget"
      ],
      shortTerm: [
        `Book one of our recommended venues: ${topVenues.map(v => v.name).join(', ')}`,
        "Send save-the-date notifications",
        "Plan catering requirements based on venue capabilities"
      ],
      longTerm: [
        "Finalize decorations and theme",
        "Confirm final headcount 7 days prior",
        "Coordinate day-of timeline with venue"
      ]
    },
    budgetInsights: {
      adequacy: budget && topVenues.length > 0 ? 
        `Budget of $${budget} ${budget >= topVenues[0].pricePerDay * 2.5 ? 'appears adequate' : 'may be tight'} for venues starting at $${topVenues[0].pricePerDay}/day` : 
        "Budget needs to be established to provide specific venue recommendations",
      suggestions: topVenues.length > 0 ? [
        `Venue budget: $${topVenues[0].pricePerDay}-$${topVenues[topVenues.length-1].pricePerDay} (40% of total)`,
        "Catering: $40-80 per person (35% of total)",
        "Reserve 15% for unexpected costs"
      ] : ["Establish budget range", "Consider venue costs first"],
      costOptimization: topVenues.length > 0 ? [
        `Consider ${topVenues[0].name} at $${topVenues[0].pricePerDay}/day for best value`,
        "Bundle services with venue provider when possible",
        "Book during off-peak times for potential discounts"
      ] : ["Compare multiple venue options", "Negotiate package deals"]
    },
    venueRecommendations: {
      topChoices: topVenues.map(v => v.name),
      reasons: topVenues.map(v => `${v.name}: ${guestCount ? `Suitable for ${guestCount} guests (capacity ${v.capacity})` : `Capacity up to ${v.capacity}`}, ${v.city} location`),
      alternatives: availableVenues.slice(3, 6).map(v => v.name)
    }
  };
}

// Helper functions for enhanced analysis
function determineEventComplexity(guestCount, description) {
  if (guestCount > 200 || (description && (description.toLowerCase().includes('wedding') || description.toLowerCase().includes('conference')))) {
    return "high";
  }
  if (guestCount > 50 || (description && description.toLowerCase().includes('corporate'))) {
    return "medium";
  }
  return "low";
}

function getEventTypeFromDescription(description) {
  const desc = description.toLowerCase();
  if (desc.includes('wedding')) return "Wedding celebration";
  if (desc.includes('conference')) return "Business conference";
  if (desc.includes('birthday')) return "Birthday celebration";
  if (desc.includes('corporate')) return "Corporate event";
  if (desc.includes('party')) return "Social gathering";
  return "Special event";
}

function getEventSpecificRisks(description, guestCount) {
  const risks = [];
  
  if (description) {
    const desc = description.toLowerCase();
    if (desc.includes('outdoor') || desc.includes('garden')) {
      risks.push("Weather dependency for outdoor elements");
    }
    if (desc.includes('wedding')) {
      risks.push("Vendor coordination complexity", "Guest RSVP accuracy");
    }
    if (desc.includes('conference')) {
      risks.push("AV equipment requirements", "Attendee no-shows");
    }
  }
  
  if (guestCount > 150) {
    risks.push("Large group logistics management");
  }
  
  if (risks.length === 0) {
    risks.push("Venue availability", "Guest count fluctuation");
  }
  
  return risks;
}

// Helper function to get available venues from database
async function getAvailableVenues({ guestCount, budget, city }) {
  try {
    let whereClause = {};
    
    // Filter by capacity (venue capacity >= guest count)
    if (guestCount) {
      whereClause.capacity = {
        [Op.gte]: guestCount
      };
    }
    
    // Filter by budget (venue price <= 40% of total budget)
    if (budget) {
      whereClause.pricePerDay = {
        [Op.lte]: budget * 0.4
      };
    }
    
    // Filter by city if specified
    if (city) {
      whereClause.city = {
        [Op.iLike]: `%${city}%`
      };
    }
    
    // Get venues with provider information
    let venues = await db.Venue.findAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'provider',
          attributes: ['firstName', 'lastName', 'email', 'phone']
        }
      ],
      order: [['pricePerDay', 'ASC']], // Order by price
      limit: 10 // Limit results to avoid overwhelming the AI
    });

    // Si aucune venue ne correspond aux critères, retourner les 5 premières venues disponibles
    if (venues.length === 0) {
      console.log('⚠️ No venues match exact criteria, returning top 5 available venues');
      venues = await db.Venue.findAll({
        include: [
          {
            model: db.User,
            as: 'provider',
            attributes: ['firstName', 'lastName', 'email', 'phone']
          }
        ],
        order: [['pricePerDay', 'ASC']], // Order by price (most affordable first)
        limit: 5
      });
    }

    return venues;
    
  } catch (error) {
    console.error('❌ Error fetching available venues:', error);
    return [];
  }
}
