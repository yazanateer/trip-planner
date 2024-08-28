const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  country: String,
  tripType: String,
  imageUrl: String,
  zones: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trip', tripSchema);