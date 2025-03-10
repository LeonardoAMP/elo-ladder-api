import fs from 'fs';
import path from 'path';
import { sequelize } from '../config/database';

// Function to run the seed SQL script
const seedDatabase = async () => {
  try {
    const seedFilePath = path.join(__dirname, 'seeds', 'seed.sql');
    const seedSQL = fs.readFileSync(seedFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = seedSQL
      .replace(/--.*\n/g, '') // Remove comments
      .split(';')
      .filter(statement => statement.trim());
    
    // Execute each statement
    for (const statement of statements) {
      await sequelize.query(statement + ';');
    }
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export { seedDatabase };
