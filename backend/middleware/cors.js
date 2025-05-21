
const cors = require('cors');

module.exports = (app) => {
  const allowedOrigins = process.env.ALLOW_ORIGINS ? process.env.ALLOW_ORIGINS.split(',') : [];
  
  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  };

  app.use(cors(corsOptions));
};
