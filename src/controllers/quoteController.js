import { createQuote, getQuotesByProvider, getQuotesByEvent, getQuotesByOrganizer, getAllQuotesByProvider, getQuoteById, updateQuoteStatus } from '../services/quoteService.js';

export const create = async (req, res, next) => {
  try {
    const { eventId, venueId, items, subtotal, vat, total, validUntil } = req.body;
    
    const quote = await createQuote({
      eventId,
      venueId,
      providerId: req.user.id,
      items,
      subtotal,
      vat,
      total,
      validUntil
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Quote created successfully',
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, eventId } = req.query;
    
    let result;
    if (eventId) {
      result = await getQuotesByEvent(eventId);
    } else if (req.user.role === 'provider') {
      result = await getQuotesByProvider(req.user.id, page, limit);
    } else if (req.user.role === 'organizer') {
      result = await getQuotesByOrganizer(req.user.id, page, limit);
    } else {
      result = { quotes: [], totalCount: 0, totalPages: 0, currentPage: 1 };
    }
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizerQuotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await getQuotesByOrganizer(req.user.id, page, limit);
    
    res.json({
      status: 'success',
      message: 'Organizer quotes retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderQuotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await getAllQuotesByProvider(req.user.id, page, limit);
    
    res.json({
      status: 'success',
      message: 'Provider quotes retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const accept = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quote = await updateQuoteStatus(id, 'accepted', req.user.id, req.user.role);
    
    res.json({
      status: 'success',
      message: 'Quote accepted successfully',
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

export const reject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quote = await updateQuoteStatus(id, 'rejected', req.user.id, req.user.role);
    
    res.json({
      status: 'success',
      message: 'Quote rejected successfully',
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

export const negotiate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quote = await updateQuoteStatus(id, 'negotiating', req.user.id, req.user.role);
    
    res.json({
      status: 'success',
      message: 'Quote marked for negotiation',
      data: quote
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quote = await getQuoteById(id);
    
    // // Check authorization - only organizer of the event or provider can view quote details
    // if (req.user.role === 'organizer' && quote.event.organizerId !== req.user.id) {
    //   return res.status(403).json({
    //     status: 'error',
    //     message: 'Not authorized to view this quote'
    //   });
    // }
    
    // if (req.user.role === 'provider' && quote.providerId !== req.user.id) {
    //   return res.status(403).json({
    //     status: 'error',
    //     message: 'Not authorized to view this quote'
    //   });
    // }
    
    res.json({
      status: 'success',
      message: 'Quote details retrieved successfully',
      data: quote
    });
  } catch (error) {
    next(error);
  }
};
