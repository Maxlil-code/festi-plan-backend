import { getUserProfile, updateUserProfile, getUserNotifications, markNotificationAsRead } from '../services/userService.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);
    
    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await updateUserProfile(req.user.id, req.body);
    
    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    // For POC, we'll just simulate file upload by accepting a URL
    const { avatarUrl } = req.body;
    
    if (!avatarUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Avatar URL is required'
      });
    }

    const user = await updateUserProfile(req.user.id, { avatar: avatarUrl });
    
    res.json({
      status: 'success',
      message: 'Avatar uploaded successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await getUserNotifications(req.user.id);
    
    res.json({
      status: 'success',
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await markNotificationAsRead(req.user.id, id);
    
    res.json({
      status: 'success',
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};
