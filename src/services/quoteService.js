import db from '../models/index.js';

export const createQuote = async (quoteData) => {
  const { eventId, venueId, providerId, items, subtotal, vat, total, validUntil } = quoteData;

  const quote = await db.Quote.create({
    eventId,
    venueId,
    providerId,
    items: JSON.stringify(items),
    subtotal,
    vat,
    total,
    status: 'draft',
    validUntil
  });

  return quote;
};

export const getQuotesByProvider = async (providerId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await db.Quote.findAndCountAll({
    where: { providerId },
    include: [
      {
        model: db.Event,
        as: 'event',
        include: [{ model: db.User, as: 'organizer', attributes: ['firstName', 'lastName', 'email'] }]
      },
      {
        model: db.Venue,
        as: 'venue'
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: offset
  });

  return {
    quotes: rows,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  };
};

export const getQuotesByEvent = async (eventId) => {
  const quotes = await db.Quote.findAll({
    where: { eventId },
    include: [
      {
        model: db.Venue,
        as: 'venue'
      },
      {
        model: db.User,
        as: 'provider',
        attributes: ['firstName', 'lastName', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return quotes;
};

export const updateQuoteStatus = async (quoteId, status, userId, userRole) => {
  const quote = await db.Quote.findByPk(quoteId, {
    include: [
      {
        model: db.Event,
        as: 'event'
      }
    ]
  });

  if (!quote) {
    throw { status: 404, message: 'Quote not found' };
  }

  // Check authorization
  if (userRole === 'provider' && quote.providerId !== userId) {
    throw { status: 403, message: 'Not authorized to update this quote' };
  }
  if (userRole === 'organizer' && quote.event.organizerId !== userId) {
    throw { status: 403, message: 'Not authorized to update this quote' };
  }

  await quote.update({ status });
  return quote;
};
