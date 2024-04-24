# Full-Stack TODO Run App

This is a full-stack TODO app that allows users to manage their tasks efficiently. 

## Demo

[todo.umaru.run](https://todo.umaru.run/)

## Features

- User Authentication: Register, login, and logout securely with JSON Web Tokens (JWT).
- TODO List Management: Create, read, update, and delete TODO lists.

## Technologies Used

### Backend

- Go: Programming language for building the server-side application.
- Echo: Web framework for Go, used for routing and middleware.
- PostgreSQL: Relational database for storing user data, TODO lists, and tasks.
- JSON Web Tokens (JWT): Securely authenticate users and protect API routes.
- Swagger: API documentation tool for generating interactive API documentation.

### Frontend

- React: JavaScript library for building user interfaces.
- Fetch API: Promise-based HTTP client for making requests to the backend API.
- Tanstack Query: State management library for managing application state asynchronously.

## Getting Started

To run the full-stack TODO app locally, follow these steps:

1. Install Docker and Docker Compose on your machine.
2. Clone this repository to your local machine.
3. Set up the environment variables required for backend configuration (see Configuration section in backend directory).
4. Run `docker-compose up -d` to start the containers.

## Deployment

Deploy to Google Cloud Platform (Compute Enginer)

## CI/CD Pipeline

Use GitHub Actions to automate the CI/CD pipeline. When changes are pushed to the repository, GitHub Actions will build the Docker container, publish it to Docker Hub. For deployment currently still to do manually with access to GCP vm and run docker compose.

## Monitoring and Logging (in progress)

Implement monitoring using Grafana for visualization, Loki for log management.
