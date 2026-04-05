# Event Manager Backend (SNG346 Project)

## Team Members

* Name: Eray Güler
* Student ID: 2587343
* Name: Muhammed Nasih Aydın
* Student ID:
* Name: Ata Sancaktar
* Student ID:


---

# Project Description

Backend (Part 1):

selected project:

2.2 Option 2: Event Booking & Ticketing System

The system provides:

* User authentication (JWT-based)
* Role-based authorization (Organiser / Attendee)
* Event management
* Ticket booking system

---

# Technologies Used

* **Next.js (API Routes)** – Backend framework
* **Prisma ORM (v7.6)** – Database management
* **PostgreSQL (Docker)** – Database
* **JWT (jsonwebtoken)** – Authentication
* **bcrypt** – Password hashing

---

# Architecture Overview

The projects backend architecture:

```
src/
├── app/api/        → API routes
├── controllers/    → Logic
├── middlewares/    → Authentication & authorization
├── prisma/         → Prisma client
├── utils/          → Helper functions
```

### Key Concepts:

* **Separation of Concerns**

  * Routes → handle HTTP requests
  * Controllers → handle logic
  * Prisma → handles database

* **Authentication**

  * JWT tokens are generated on login
  * Tokens are required for protected routes

* **Authorization**

  * Role-based access:

    * ORGANISER → can create/manage events
    * ATTENDEE → can book events

---

# Database Design

### Models:

### User

* id
* email
* password
* name
* role (ORGANISER / ATTENDEE)

### Event

* id
* title
* description
* dateTime
* capacity
* organiserId

### Booking

* id
* userId
* eventId

### Relationships:

* One User → Many Events (Organiser)
* One User → Many Bookings
* One Event → Many Bookings

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone git@github.com:MNasihAyd/SNG346Project_EventManager.git
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start Database (Docker)

```bash
docker-compose up -d
```

---

## 4. Configure Environment Variables

Create `.env` file in root:

```env
DATABASE_URL="postgresql://sngproject:mypassword@localhost:5434/eventmanager_db?schema=public"

JWT_SECRET=supersecret123
```

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Run Migrations

```bash
npx prisma migrate reset
```

---

## 7. Seed Database

```bash
node prisma/seed.js
```

---

## 8. Run Application

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

# API Documentation

---

## Authentication

### Register

**POST** `/api/auth/register`

```json
{
  "email": "test@test.com",
  "password": "123456",
  "name": "Test User",
  "role": "ATTENDEE"
}
```

---

### Login

**POST** `/api/auth/login`

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

---

## Events

### Get All Events

**GET** `/api/events`

---

### Create Event (Organiser Only)

**POST** `/api/events`

Headers:

```
Authorization: Bearer TOKEN
```

Body:

```json
{
  "title": "Event Title",
  "description": "Event Description",
  "dateTime": "2026-04-05T10:00:00.000Z",
  "capacity": 10
}
```

---

### Get Single Event

**GET** `/api/events/:id`

---

### Update Event

**PUT** `/api/events/:id`

---

### Delete Event

**DELETE** `/api/events/:id`

---

## Bookings

### Book Event

**POST** `/api/bookings`

Headers:

```
Authorization: Bearer TOKEN
```

Body:

```json
{
  "eventId": "EVENT_ID"
}
```

---

# Error Handling

The API uses standard HTTP status codes:

* 200 → Success
* 201 → Created
* 400 → Bad Request
* 401 → Unauthorized
* 403 → Forbidden
* 404 → Not Found

---

# Features Implemented

* User registration & login
* JWT authentication
* Role-based authorization
* Event creation & management
* Ticket booking system
* Capacity validation
* Prisma relational models
* Seed script for test data
* Clean architecture (routes/controllers/middleware)

---

# Sample Seed Data

After running seed:

* Organiser:

  * email: `org@test.com`
  * password: `123456`

* Attendee:

  * email: `user@test.com`
  * password: `123456`

---

# Notes

* Only organisers can create events
* Attendees can book events
* Booking is limited by event capacity
* Duplicate bookings are prevented

---

# Conclusion

This project demonstrates a fully functional backend system using modern technologies, following best practices such as:

* RESTful API design
* Separation of concerns
* Authentication & authorization
* Relational database modeling

---
