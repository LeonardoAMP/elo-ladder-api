import express from 'express';
import { json } from 'body-parser';
import connectToDatabase from './config/database';
import routes from './routes/index';
import errorMiddleware from './middleware/error.middleware';
import { swaggerUi, specs } from './config/swagger';

const app = express();

// Middleware
app.use(json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SSBU ELO Ladder API Documentation'
}));

// Connect to the database
connectToDatabase();

// Routes
app.use('/api', routes);

// API Info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SSBU ELO Ladder API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      authentication: '/api/auth',
      players: '/api/players', 
      matches: '/api/matches',
      characters: '/api/characters'
    }
  });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;