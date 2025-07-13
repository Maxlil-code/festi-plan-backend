import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';

export const registerUser = async (userData) => {
  const { firstName, lastName, email, password, role = 'organizer', phone } = userData;

  // Check if user already exists
  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    throw { status: 409, message: 'User already exists with this email' };
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await db.User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    phone
  });

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  // Return user without password
  const userResponse = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar
  };

  return { user: userResponse, token };
};

export const loginUser = async (email, password) => {
  // Find user
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  // Return user without password
  const userResponse = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar
  };

  return { user: userResponse, token };
};

export const refreshToken = async (userId) => {
  const user = await db.User.findByPk(userId);
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  return { token };
};
