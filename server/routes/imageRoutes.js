const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const config = require('../config/config');

// Configure OpenAI
const openai = new OpenAI({
  apiKey: config.openaiApiKey
});

router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Generate image using DALL-E
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      prompt: prompt 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 