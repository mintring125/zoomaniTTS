require('dotenv').config();

module.exports = {
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_PROJECT_ID,
  apiKey: process.env.GOOGLE_API_KEY
};
