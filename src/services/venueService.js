import db from '../models/index.js';
import { Op } from 'sequelize';

export const createVenue = async (providerId, venueData) => {
  const { name, description, address, city, capacity, pricePerDay, amenities, images } = venueData;

  const venue = await db.Venue.create({
    name,
    description,
    address,
    city,
    capacity,
    pricePerDay,
    amenities,
    images,
    providerId
  });

  return venue;
};

export const getVenuesByProvider = async (providerId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await db.Venue.findAndCountAll({
    where: { providerId },
    include: [
      {
        model: db.User,
        as: 'provider',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: offset
  });

  return {
    venues: rows,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  };
};

export const getAllVenues = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.city) {
    where.city = { [Op.iLike]: `%${filters.city}%` };
  }
  if (filters.minCapacity) {
    where.capacity = { [Op.gte]: parseInt(filters.minCapacity) };
  }
  if (filters.maxPrice) {
    where.pricePerDay = { [Op.lte]: parseFloat(filters.maxPrice) };
  }

  const { count, rows } = await db.Venue.findAndCountAll({
    where,
    include: [
      {
        model: db.User,
        as: 'provider',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['pricePerDay', 'ASC']],
    limit: parseInt(limit),
    offset: offset
  });

  return {
    venues: rows,
    totalCount: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  };
};

export const searchVenues = async (searchTerm, filters = {}) => {
  const where = {
    [Op.or]: [
      { name: { [Op.iLike]: `%${searchTerm}%` } },
      { description: { [Op.iLike]: `%${searchTerm}%` } },
      { city: { [Op.iLike]: `%${searchTerm}%` } },
      { amenities: { [Op.iLike]: `%${searchTerm}%` } }
    ]
  };

  if (filters.city) {
    where.city = { [Op.iLike]: `%${filters.city}%` };
  }
  if (filters.minCapacity) {
    where.capacity = { [Op.gte]: parseInt(filters.minCapacity) };
  }
  if (filters.maxPrice) {
    where.pricePerDay = { [Op.lte]: parseFloat(filters.maxPrice) };
  }

  const venues = await db.Venue.findAll({
    where,
    include: [
      {
        model: db.User,
        as: 'provider',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
    order: [['pricePerDay', 'ASC']],
    limit: 20
  });

  return venues;
};

export const getVenueById = async (venueId) => {
  const venue = await db.Venue.findByPk(venueId, {
    include: [
      {
        model: db.User,
        as: 'provider',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ]
  });

  if (!venue) {
    throw { status: 404, message: 'Venue not found' };
  }

  return venue;
};

export const updateVenue = async (venueId, providerId, updateData) => {
  const venue = await db.Venue.findOne({
    where: { id: venueId, providerId }
  });

  if (!venue) {
    throw { status: 404, message: 'Venue not found or not authorized' };
  }

  const allowedFields = ['name', 'description', 'address', 'city', 'capacity', 'pricePerDay', 'amenities', 'images'];
  const filteredData = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  await venue.update(filteredData);
  return venue;
};

export const deleteVenue = async (venueId, providerId) => {
  const venue = await db.Venue.findOne({
    where: { id: venueId, providerId }
  });

  if (!venue) {
    throw { status: 404, message: 'Venue not found or not authorized' };
  }

  await venue.destroy();
  return { message: 'Venue deleted successfully' };
};
