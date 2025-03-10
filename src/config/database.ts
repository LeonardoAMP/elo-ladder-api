import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Function to test the connection and log status
const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Successfully connected to PostgreSQL database with Sequelize');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Export the connection function
export default connectToDatabase;