const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  }
}, {
  timestamps: true
});

// Index for faster lookups
urlSchema.index({ shortCode: 1 });
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Add methods to the schema
urlSchema.methods.incrementClicks = async function() {
  this.clicks += 1;
  return this.save();
};

// Static methods
urlSchema.statics.findByShortCode = function(shortCode) {
  return this.findOne({ shortCode });
};

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;