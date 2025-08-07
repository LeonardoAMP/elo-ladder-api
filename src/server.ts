import express from 'express';
import { json } from 'body-parser';
import connectToDatabase from './config/database';
import routes from './routes/index';
import errorMiddleware from './middleware/error.middleware';
import cors from 'cors';
import { swaggerUi, specs } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL }));

// Middleware
app.use(json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SSBU ELO Ladder API Documentation'
}));

// Connect to the database
connectToDatabase()
  .then(() => {
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

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server due to database connection error');
    process.exit(1);
  });
  