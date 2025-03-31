const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');
const URL = require('../models/url.model');
const logger = require('../utils/logger');

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl, customSlug } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Generate or use custom short code
    const shortCode = customSlug || nanoid(8);

    // Check if custom slug is already taken
    if (customSlug) {
      const existing = await URL.findOne({ shortCode: customSlug });
      if (existing) {
        return res.status(409).json({ error: 'Custom slug already in use' });
      }
    }

    const url = new URL({
      originalUrl,
      shortCode
    });

    await url.save();
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(process.env.BASE_URL + '/api/' + shortCode);

    res.json({
      originalUrl,
      shortUrl: process.env.BASE_URL + '/api/' + shortCode,
      shortCode,
      qrCode
    });
  } catch (err) {
    logger.error('Error creating short URL:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Redirect to original URL
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await URL.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Increment click counter
    await url.incrementClicks();

    res.redirect(url.originalUrl);
  } catch (err) {
    logger.error('Error redirecting:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get URL analytics
router.get('/analytics/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await URL.findByShortCode(shortCode);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt
    });
  } catch (err) {
    logger.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;