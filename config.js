    //  config.js
     require('dotenv').config();

     module.exports = {
       MONGODB_URL: process.env.MONGODB_URL,
       OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
       GMAIL_EMAIL: process.env.GMAIL_EMAIL,
       GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,

       EMAIL_USERNAME: process.env.EMAIL_USERNAME,
       EMAIL_PASSWORD: process.env.EMAIL_PASSWORD

     };

