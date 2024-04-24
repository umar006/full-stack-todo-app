# TODO Run API

This is a RESTful API for managing TODO lists and tasks. It provides endpoints for user authentication, CRUD operations on TODO lists, and optional functionality for managing categories or tags.

## Getting Started

To get started with the TODO App API, follow these steps:

1. Clone this repository to your local machine.
2. Set up the environment variables required for configuration (see Configuration section below).
3. Start the server using `make dev`.

## API Endpoints

The following endpoints are available in the API:

### Authentication

- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/signin`: Log in to an existing user account.

### TODO Lists

- `POST /api/todos`: Create a new TODO list.
- `GET /api/todos`: Get all TODO lists belonging to the authenticated user.
- `PUT /api/todos/{todo_id}`: Update a TODO list.
- `DELETE /api/todos/{todo_id}`: Delete a TODO list.

## Configuration

The following environment variables need to be configured:

- `APP_ENV`: Env in which the app running, default to `production`
- `DB_URL`: URL for the MongoDB database.
- `JWT_SIGNATURE_KEY`: Secret key for JWT authentication.
- `JWT_EXPIRE_IN_HOUR`: Expire time for JWT Token in hour.

## Authentication

Authentication is implemented using JSON Web Tokens (JWT). Upon successful login, a JWT token is generated and sent to the client, which must be included in subsequent requests as a bearer token in the Authorization header.

## Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios. Detailed error handling ensures clear communication of issues to the client.
