# Booking Platform REST API

A NestJS + TypeScript backend for managing services, bookings, and authentication with PostgreSQL and Swagger documentation.

## Features

- Modular structure with `auth`, `services`, and `bookings` domains
- PostgreSQL persistence via TypeORM
- JWT-based authentication with refresh tokens
- Swagger API docs at `/api/docs`
- Validation and global exception handling

## Requirements

- Node.js 
- npm
- PostgreSQL

## Installation

```bash
git clone https://github.com/pawaniKumari/Booking_platform.git
cd en2-h-assignment
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=POSTGRES_PORT
DB_USERNAME=POSTGRES_USERNAME
DB_PASSWORD=POSTGRES_PASSWORD
DB_DATABASE=booking_db
```

## Database Setup

Create the database before starting the app:

```sql
CREATE DATABASE booking_db;
```

The app uses TypeORM auto-synchronization in development, so entities are synced automatically on startup.

## Running the App

```bash
npm run start:dev
```

## Running Unit Testing Suites

To execute the automated unit test blocks built to verify business rule logic:

```bash
npm run test
```

## Running Migrations

During active initial development, the system has TypeORM's auto-synchronization feature enabled (synchronize: true) inside src/app.module.ts. This dynamically mirrors entity decorations directly into PostgreSQL tables upon launch.

## API Documentation

The platform implements Swagger Documentation via web browser.

API Base Documentation URL: Open http://localhost:3000/api/docs to access the complete Swagger UI dashboard.

Testing Protected Routes: Authenticate using the /api/auth/login endpoint, copy the returned string token, click the top "Authorize" padlock icon, paste it in as Bearer <token>, and test management controls.

## Assumptions Made

Default State Constraints: Incoming client reservations do not require an explicit status insertion payload; they are dynamically routed with a default status of PENDING within the database engine layer.

Unauthenticated guest paths allow booking creation.

## Future Improvements

Role-Based Access Control.

Integrate notification to automatically dispatch  emails or SMS alerts upon booking verification, cancellation, or fulfillment.

Implement a Redis cache layer over high-frequency read endpoints like GET /services to minimize repetitive direct relational queries.