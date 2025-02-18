const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  searchId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  prompt: { type: String, required: true },
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ordered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Image', imageSchema); 