import { createVenue, getVenuesByProvider, getAllVenues, searchVenues, getVenueById, updateVenue, deleteVenue } from '../services/venueService.js';

export const create = async (req, res, next) => {
  try {
    const venue = await createVenue(req.user.id, req.body);
    
    res.status(201).json({
      status: 'success',
      message: 'Venue created successfully',
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, city, minCapacity, maxPrice } = req.query;
    const filters = { city, minCapacity, maxPrice };
    
    let result;
    if (req.user.role === 'provider') {
      result = await getVenuesByProvider(req.user.id, page, limit);
    } else {
      result = await getAllVenues(page, limit, filters);
    }
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  try {
    const { q: searchTerm, city, minCapacity, maxPrice } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        status: 'error',
        message: 'Search term is required'
      });
    }

    const filters = { city, minCapacity, maxPrice };
    const venues = await searchVenues(searchTerm, filters);
    
    res.json({
      status: 'success',
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const venue = await getVenueById(id);
    
    res.json({
      status: 'success',
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const venue = await updateVenue(id, req.user.id, req.body);
    
    res.json({
      status: 'success',
      message: 'Venue updated successfully',
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteVenue(id, req.user.id);
    
    res.json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
