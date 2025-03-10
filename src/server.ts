import express from 'express';
import { json } from 'body-parser';
import connectToDatabase from './config/database';
import routes from './routes/index';
import errorMiddleware from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(json());

// Connect to the database
connectToDatabase()
  .then(() => {
    // Routes
    app.use('/api', routes);

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