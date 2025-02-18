const express = require('express');
const router = express.Router();
const { BlobServiceClient } = require('@azure/storage-blob');
const { Configuration, OpenAIApi } = require('openai');
const config = require('../config/config');
const Image = require('../models/Image');
const { v4: uuidv4 } = require('uuid');

// Configure OpenAI
const configuration = new Configuration({
  apiKey: config.openaiApiKey,
});
const openai = new OpenAIApi(configuration);

// Configure Azure Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(
  config.azureStorageConnectionString
);
const containerClient = blobServiceClient.getContainerClient(config.azureContainerName);

router.post('/generate', async (req, res) => {
  try {
    const { prompt, userId } = req.body;
    
    // Generate image using DALL-E
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data.data[0].url;
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    // Upload to Azure Blob Storage
    const blobName = `${uuidv4()}.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(imageBuffer, imageBuffer.byteLength);

    // Get the URL of the uploaded blob
    const azureImageUrl = blockBlobClient.url;

    // Save metadata to MongoDB
    const image = new Image({
      searchId: uuidv4(),
      prompt,
      userId,
      imageUrl: azureImageUrl,
      ordered: false
    });

    await image.save();

    res.json({ success: true, image });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const images = await Image.find({ userId: req.params.userId });
    res.json({ success: true, images });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 