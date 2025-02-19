const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://shmoop-api.azurewebsites.net'
    : 'http://localhost:5001'
};

export default config;
