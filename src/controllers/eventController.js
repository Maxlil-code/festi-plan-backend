import { createEvent, getEventsByOrganizer, getAllEvents, getEventById, updateEvent, deleteEvent } from '../services/eventService.js';

export const create = async (req, res, next) => {
  try {
    const event = await createEvent(req.user.id, req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, dateFrom, dateTo } = req.query;
    const filters = { status, dateFrom, dateTo };
    
    let result;
    if (req.user.role === 'organizer') {
      result = await getEventsByOrganizer(req.user.id, page, limit);
    } else {
      result = await getAllEvents(page, limit, filters);
    }
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id, req.user.id);
    
    res.json({
      status: 'success',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await updateEvent(id, req.user.id, req.body);
    
    res.json({
      status: 'success',
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteEvent(id, req.user.id);
    
    res.json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
