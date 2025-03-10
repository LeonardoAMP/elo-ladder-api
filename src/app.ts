import express from 'express';
import { json } from 'body-parser';
import connectToDatabase from './config/database';
import routes from './routes/index';
import errorMiddleware from './middleware/error.middleware';

const app = express();

// Middleware
app.use(json());

// Connect to the database
connectToDatabase();

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorMiddleware);

export default app;