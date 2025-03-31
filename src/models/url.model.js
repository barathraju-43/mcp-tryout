import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        try {
          const urlObj = new globalThis.URL(v);
          return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (e) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid URL! Please include http:// or https://`
    }
  },
  shortCode: {
    type: String,
    required: [true, 'Short code is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Short code must be at least 3 characters long'],
    maxlength: [50, 'Short code cannot exceed 50 characters']
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Clicks cannot be negative']
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000), // 30 days from now
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Expiration date must be in the future!'
    }
  }
}, {
  timestamps: true
});

// Indexes for faster lookups
urlSchema.index({ shortCode: 1 }, { unique: true });
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

const UrlModel = mongoose.model('URL', urlSchema);

export default UrlModel;