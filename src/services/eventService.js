import db from '../models/index.js';

export const createEvent = async (organizerId, eventData) => {
  const { name, description, date, startTime, endTime, guestCount, budget, status = 'draft' } = eventData;

  const event = await db.Event.create({
    name,
    description,
    date,
    startTime,
    endTime,
    guestCount,
    budget,
    status,
    organizerId
  });

  return event;
};

export const getEventsByOrganizer = async (organizerId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await db.Event.findAndCountAll({
    where: { organizerId },
    include: [
      {
        model: db.User,
        as: 'organizer',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: offset
  });

  return {
    events: rows,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  };
};

export const getAllEvents = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.dateFrom) {
    where.date = { [db.Sequelize.Op.gte]: filters.dateFrom };
  }
  if (filters.dateTo) {
    where.date = { ...where.date, [db.Sequelize.Op.lte]: filters.dateTo };
  }

  const { count, rows } = await db.Event.findAndCountAll({
    where,
    include: [
      {
        model: db.User,
        as: 'organizer',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: offset
  });

  return {
    events: rows,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  };
};

export const getEventById = async (eventId, userId = null) => {
  const event = await db.Event.findByPk(eventId, {
    include: [
      {
        model: db.User,
        as: 'organizer',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ]
  });

  if (!event) {
    throw { status: 404, message: 'Event not found' };
  }

  return event;
};

export const updateEvent = async (eventId, organizerId, updateData) => {
  const event = await db.Event.findOne({
    where: { id: eventId, organizerId }
  });

  if (!event) {
    throw { status: 404, message: 'Event not found or not authorized' };
  }

  const allowedFields = ['name', 'description', 'date', 'startTime', 'endTime', 'guestCount', 'budget', 'status'];
  const filteredData = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  // If status is being changed from DRAFT, validate required fields
  if (filteredData.status && filteredData.status !== 'DRAFT' && event.status === 'DRAFT') {
    const required = ['date', 'startTime', 'endTime', 'guestCount', 'budget'];
    const missing = required.filter(field => {
      // Check if field is provided in update or already exists in event
      const value = filteredData[field] !== undefined ? filteredData[field] : event[field];
      return value == null;
    });
    
    if (missing.length > 0) {
      throw { 
        status: 400, 
        message: `The following fields are required to finalize the event: ${missing.join(', ')}` 
      };
    }
  }

  await event.update(filteredData);
  return event;
};

export const deleteEvent = async (eventId, organizerId) => {
  const event = await db.Event.findOne({
    where: { id: eventId, organizerId }
  });

  if (!event) {
    throw { status: 404, message: 'Event not found or not authorized' };
  }

  await event.destroy();
  return { message: 'Event deleted successfully' };
};
