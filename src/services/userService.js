import db from '../models/index.js';

export const getUserProfile = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  return user;
};

export const updateUserProfile = async (userId, updateData) => {
  const user = await db.User.findByPk(userId);
  
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  // Update only allowed fields
  const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
  const filteredData = {};
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  await user.update(filteredData);

  // Return updated user without password
  const updatedUser = await db.User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  return updatedUser;
};

export const getUserNotifications = async (userId) => {
  const notifications = await db.Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: 50
  });

  return notifications;
};

export const markNotificationAsRead = async (userId, notificationId) => {
  const notification = await db.Notification.findOne({
    where: { id: notificationId, userId }
  });

  if (!notification) {
    throw { status: 404, message: 'Notification not found' };
  }

  await notification.update({ isRead: true });
  return notification;
};
