import { createQuote, getQuotesByProvider, getQuotesByEvent, updateQuoteStatus } from '../services/quoteService.js';

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
    } else {
      // For organizers, show quotes for their events
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
