require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGODB_URI,
  openaiApiKey: process.env.OPENAI_API_KEY,
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  azureContainerName: process.env.AZURE_CONTAINER_NAME
}; 