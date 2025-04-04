const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  avatar: { type: String, default: 'default-avatar.png' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('profile', profileSchema);
