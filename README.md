# SSBU ELO Ladder API

## Overview
The SSBU ELO Ladder API is a RESTful API built with Node.js and Express.js to manage an ELO ladder for competitors in Super Smash Bros. Ultimate (SSBU). It provides endpoints for user authentication, player management, and match management, utilizing a PostgreSQL database for data storage.

## Features
- User authentication with JWT tokens
- Player management (create, read, update, delete)
- Match management (create, read, update, delete)
- ELO rating calculation based on match results
- Error handling and request validation middleware

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- TypeScript
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)
- TypeScript (installed globally)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd ssbu-elo-ladder-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file and configure your database connection and other environment variables.

4. Run database migrations (if applicable).

### Running the Application
To start the server, run:
```
npm run start
```

For development mode with hot reloading, run:
```
npm run dev
```

### API Endpoints
- **Authentication**
  - `POST /api/auth/login`: Log in a user and receive a JWT token.

- **Players**
  - `GET /api/players`: Retrieve all players.
  - `POST /api/players`: Create a new player.
  - `GET /api/players/:id`: Retrieve a specific player by ID.
  - `PUT /api/players/:id`: Update a specific player by ID.
  - `DELETE /api/players/:id`: Delete a specific player by ID.

- **Matches**
  - `GET /api/matches`: Retrieve all matches.
  - `POST /api/matches`: Create a new match.
  - `GET /api/matches/:id`: Retrieve a specific match by ID.
  - `PUT /api/matches/:id`: Update a specific match by ID.
  - `DELETE /api/matches/:id`: Delete a specific match by ID.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.