# BookIt: Experiences & Slots - Backend

This is the backend service for the **BookIt** web application, a platform where users can explore travel experiences, check available slots, and make bookings. This server is built with Node.js, Express, and MongoDB, and it provides a RESTful API for the frontend client.

This project was built as an internship screening assignment for Highway Delite

## Features

- **Experience Management**: CRUD operations for travel experiences.
- **Time Slot Availability**: Provides available dates and time slots for each experience.
- **Booking System**: Allows users to book an experience for a specific slot.
- **Promo Code Validation**: Validates promotional codes for discounts.
- **Data Seeding**: A script to populate the database with initial dummy data for experiences, time slots, and promo codes.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) for object data modeling (ODM).

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd bookit-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following
    ```bash
    MONGODB_URL=your_mongodb_connection_string_here
    PORT=3003
    ```

4.  **Seed the database (optional but recommended):**
    This script will populate your database with sample data.
    ```bash
    npm run seed
    ```
    *(You'll need to add this script to `package.json`)*

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (e.g., `http://localhost:3003`).

### Database Seeding

The `seedDB.ts` script is designed to initialize the database with a consistent set of data for development.

The script first **clears all existing data** from the `TimeSlots`, `Experiences`, `Bookings`, and `PromoCodes` collections. It then inserts a predefined list of experiences and promo codes. Finally, it dynamically generates time slots for multiple days and times for each experience, with random capacities.

## Project Structure

The project follows a standard structure for a Node.js/Express application to keep the codebase organized and maintainable.

- **`/config`**: Contains configuration files, such as the database connector (`mongodb.ts`).
- **`/routes`**: Contains the API router as well as the business logic for each corresponding route (eg. bookingsRouter, promoCodeRouter) . Functions here are responsible for handling incoming requests, interacting with models, and sending responses. 

I am aware that generally routes should be divided into services/contollers folders but the scale of the app was small enough to not warrant the use those folders

- **`/models`**: Defines the Mongoose schemas for our database collections (Experiences, TimeSlots, etc.). These models are the interface for interacting with the MongoDB database.
- **`/types`**: Centralizes all custom TypeScript types used across the application for better type safety and code clarity.
- **`app.ts`**: It is where we attach all the routers to the app, add the middlewares and error handlers, and prepare the express app to start listening.
- **`index.ts`**: The application's entry point. It sets up the Express server, connects to the database, and starts listening for requests.
- **`seedDB.ts`**: A utility script to populate the database. As seen in the code, it clears existing collections and inserts fresh data for experiences, time slots, and promo codes, which is incredibly useful for development and testing.

## API Endpoints

The following are the primary endpoints provided by this API.

#### `GET /api/experiences`

- **Description**: Retrieves a list of all available experiences.
- **Response**: `200 OK`

#### `GET /api/experiences/:id`

- **Description**: Retrieves detailed information for a single experience, including its available time slots.
- **Response**: `200 OK`

#### `GET /api/bookings`

- **Description**: Fetches all the bookings in the database
- **Response**: `200 OK` with an array of bookings.

#### `POST /api/bookings/:id`

- **Description**: Fetches details about a single booking with the specified id
- **Response**: `201 Created` with the booking's details.

#### `POST /api/bookings`

- **Description**: Creates a new booking for a user. The server will prevent double-booking the same slot if it's at capacity and it will use atomic operations to ensure no race conditions.
- **Response**: `201 Created` with booking confirmation details.

#### `POST /api/promo/validate`

- **Description**: Validates a promo code.
- **Response**: `200 OK` with discount details if valid