import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from 'dotenv';

config();

const devPort = process.env.PORT || 3000;
const devUrl = process.env.DEV_URL || `http://localhost:${devPort}/api`;
const prodUrl = process.env.PROD_URL || 'https://your-production-domain.com/api';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SSBU ELO Ladder API',
      version: '1.0.0',
      description: 'Super Smash Bros Ultimate ELO Ladder System API for managing players, matches, and rankings',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: devUrl,
        description: 'Development server',
      },
      {
        url: prodUrl,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Player: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the player',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'The name of the player',
              example: 'John Doe',
            },
            elo: {
              type: 'integer',
              description: 'The ELO rating of the player',
              example: 1500,
            },
            matchesPlayed: {
              type: 'integer',
              description: 'Total number of matches played',
              example: 25,
            },
            wins: {
              type: 'integer',
              description: 'Total number of wins',
              example: 15,
            },
            losses: {
              type: 'integer',
              description: 'Total number of losses',
              example: 10,
            },
          },
        },
        Match: {
          type: 'object',
          required: ['winnerId', 'loserId'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the match',
              example: 1,
            },
            winnerId: {
              type: 'integer',
              description: 'ID of the winning player',
              example: 1,
            },
            loserId: {
              type: 'integer',
              description: 'ID of the losing player',
              example: 2,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the match was played',
              example: '2025-08-07T10:30:00Z',
            },
            eloChange: {
              type: 'integer',
              description: 'ELO points exchanged in this match',
              example: 32,
            },
            winnerCurrentElo: {
              type: 'integer',
              description: 'Winner ELO at the time of the match',
              example: 1532,
            },
            loserCurrentElo: {
              type: 'integer',
              description: 'Loser ELO at the time of the match',
              example: 1468,
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the match is active (not soft deleted)',
              example: true,
            },
          },
        },
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the user',
              example: 1,
            },
            username: {
              type: 'string',
              description: 'The username',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email address',
              example: 'john@example.com',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
              example: 'An error occurred',
            },
            error: {
              type: 'object',
              description: 'Error details',
            },
          },
        },
        Character: {
          type: 'object',
          required: ['name', 'icon_name'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the character',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'The name of the character',
              example: 'Mario',
            },
            icon_name: {
              type: 'string',
              description: 'The icon filename for the character',
              example: 'mario',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the character was created',
              example: '2025-08-07T10:30:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the character was last updated',
              example: '2025-08-07T10:30:00Z',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
