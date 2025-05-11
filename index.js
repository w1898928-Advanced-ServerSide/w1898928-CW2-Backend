const express = require('express');
const session = require('express-session');
const authRoutes = require('./src/routes/authRoutes');
const blogPostRoutes = require('./src/routes/blogPostRoutes');
const followRoutes = require('./src/routes/followRoutes');
const reactionRoutes = require('./src/routes/reactionRoutes');
const loggerMiddleware = require('./src/middlewares/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const errorHandler = require('./src/middlewares/errorHandler');
const db = require('./src/config/db');
const cors = require('cors'); 

const app = express();
// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
const PORT = process.env.PORT || 4000;
app.use(session({
  secret: "asdfghjkl0987654321",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(loggerMiddleware)

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', blogPostRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static('uploads'));
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});