import { recommendVenues, generateQuote, analyzeRequirements } from '../services/aiService.js';
import db from '../models/index.js';

export const getRecommendations = async (req, res, next) => {
  try {
    const { guestCount, budgetMin, budgetMax } = req.body;

    if (!guestCount) {
      return res.status(400).json({
        status: 'error',
        message: 'Guest count is required'
      });
    }

    const venues = await recommendVenues({ guestCount, budgetMin, budgetMax });
    
    res.json({
      status: 'success',
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

export const postQuote = async (req, res, next) => {
  try {
    const { venueId, eventId } = req.body;

    if (!venueId || !eventId) {
      return res.status(400).json({
        status: 'error',
        message: 'Venue ID and Event ID are required'
      });
    }

    const quote = await generateQuote({ venueId, eventId });
    
    res.json({
      status: 'success',
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeEventRequirements = async (req, res, next) => {
  try {
    const { eventDescription, guestCount, budget, preferences, eventId } = req.body;

    let analysisData = {};

    if (eventId) {
      // Fetch event data from database
      const event = await db.Event.findByPk(eventId);
      
      if (!event) {
        return res.status(404).json({
          status: 'error',
          message: 'Event not found'
        });
      }

      // Check if event has at least some data for analysis
      if (!event.description && !event.guestCount && !event.budget && !event.name) {
        return res.status(400).json({
          status: 'error',
          message: 'Event needs at least one detail (name, description, guest count, or budget) for AI analysis'
        });
      }

      analysisData = {
        eventDescription: event.description || event.name || 'Event planning in progress',
        guestCount: event.guestCount || 'To be determined',
        budget: event.budget || 'To be determined',
        preferences: preferences || 'None specified'
      };
    } else {
      // Use provided data - allow partial information
      if (!eventDescription && !guestCount && !budget) {
        return res.status(400).json({
          status: 'error',
          message: 'At least one of event description, guest count, or budget is required for analysis'
        });
      }

      analysisData = { 
        eventDescription: eventDescription || 'To be determined', 
        guestCount: guestCount || 'To be determined', 
        budget: budget || 'To be determined', 
        preferences: preferences || 'None specified'
      };
    }

    const analysis = await analyzeRequirements(analysisData);
    
    res.json({
      status: 'success',
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};
