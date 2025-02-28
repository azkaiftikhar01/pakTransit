Bus Station Management API

Overview

This API provides functionalities for managing bus stations, including adding, updating, deleting, and listing stations. It also includes user authentication with JWT-based login and registration.

Features

Implemented Features

User Authentication

JWT-based authentication

User registration

User login

Bus Station Management

Add a new bus station

Update existing bus station details

Delete a bus station

List all bus stations

Database Operations

Insert, update, and delete operations with PostgreSQL

Handling geographic location data using PostGIS

Endpoints

Authentication Routes

Method

Endpoint

Description

POST

/auth/register

Register a new user

POST

/auth/login

User login & JWT generation

Bus Station Routes

Method

Endpoint

Description

POST

/operations/stations

Create a new bus station

PUT

/operations/stations/:id

Update bus station details

DELETE

/operations/stations/:id

Delete a bus station

GET

/operations/stations

List all bus stations

Technologies Used

Backend: Node.js, Express.js

Database: PostgreSQL with PostGIS

Authentication: JWT

Middleware: Express.js for routing and authentication

Setup and Installation

Clone the repository:

git clone https://github.com/your-repo/bus-station-api.git
cd bus-station-api

Install dependencies:

npm install

Set up environment variables in .env:

PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key

Run the server:

npm start

Future Enhancements

Role-based access control (RBAC)

Search and filter bus stations

Improved error handling

Swagger API documentation

Contributing

Feel free to submit issues and pull requests!

