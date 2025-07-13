import { registerUser, loginUser, refreshToken } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'firstName, lastName, email, and password are required'
      });
    }

    const result = await registerUser({ firstName, lastName, email, password, role, phone });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    const result = await loginUser(email, password);

    res.json({
      status: 'success',
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const result = await refreshToken(req.user.id);

    res.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};
