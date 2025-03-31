import express from 'express';
import QRCode from 'qrcode';
import UrlModel from '../models/url.model.js';
import logger from '../utils/logger.js';

const router = express.Router();

let nanoidFunction;
import('nanoid').then(({nanoid}) => {
  nanoidFunction = nanoid;
});

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    logger.info('Received shorten request:', req.body);
    const { originalUrl, customSlug } = req.body;

    if (!originalUrl) {
      logger.error('No URL provided');
      return res.status(400).json({ error: 'Original URL is required' });
    }

    // Wait for nanoid to be ready
    if (!nanoidFunction) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!nanoidFunction) {
        logger.error('nanoid not initialized');
        return res.status(500).json({ error: 'Service not ready, please try again' });
      }
    }

    // Generate or use custom short code
    const shortCode = customSlug || nanoidFunction(8);
    logger.info('Generated shortCode:', shortCode);

    // Check if custom slug is already taken
    if (customSlug) {
      const existing = await UrlModel.findOne({ shortCode: customSlug });
      if (existing) {
        logger.warn('Custom slug already exists:', customSlug);
        return res.status(409).json({ error: 'Custom slug already in use' });
      }
    }

    // Create and save the URL document
    try {
      const url = new UrlModel({
        originalUrl,
        shortCode
      });

      await url.save();
      logger.info('URL saved successfully:', shortCode);
      
      // Generate QR code
      const qrCode = await QRCode.toDataURL(`${process.env.BASE_URL || 'http://localhost:3000'}/api/${shortCode}`);

      const response = {
        originalUrl,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/api/${shortCode}`,
        shortCode,
        qrCode
      };
      
      logger.info('Sending response:', { shortCode, originalUrl });
      res.json(response);
    } catch (err) {
      if (err.name === 'ValidationError') {
        logger.error('Validation error:', err.message);
        return res.status(400).json({ error: err.message });
      }
      throw err;
    }
  } catch (err) {
    logger.error('Error creating short URL:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Redirect to original URL
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    logger.info('Redirect request for:', shortCode);
    
    const url = await UrlModel.findOne({ shortCode });

    if (!url) {
      logger.warn('URL not found:', shortCode);
      return res.status(404).json({ error: 'URL not found' });
    }

    // Increment click counter
    url.clicks += 1;
    await url.save();

    logger.info('Redirecting to:', url.originalUrl);
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
    const url = await UrlModel.findOne({ shortCode });

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

export default router;