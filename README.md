//This file is improved by: ChatGPT

# Event Manager Backend (SNG346 Project)

## Team Members

* Name: Eray Güler
* Student ID: 2587343
* Name: Muhammed Nasih Aydın
* Student ID: 2640324
* Name: Ata Sancaktar
* Student ID: 2640688

---

# Project Description

Backend (Part 1):

Selected project:

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

The file structure for the APIs was made according to lecture 6 page 19 of our SNG 346 lecture slides.


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

//Image is only visible at github website
//ER Diagram

<img width="918" height="818" alt="sng346erd" src="https://github.com/user-attachments/assets/dd96e384-e5c2-460e-ab3d-e9f31fb96f26" />


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
npx prisma migrate dev --name init
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

## Demo Run For Testing

### Register

**POST** `/api/auth/register`

Body:

```json
{
  "email": "org1@test.com",
  "password": "123456",
  "name": "Organiser One",
  "role": "ORGANISER"
}
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

---

### Login

**POST** `/api/auth/login`

Body:

```json
{
  "email": "org1@test.com",
  "password": "123456"
}
```

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

Response:

```json
[
    {
        "id": "cmnlvpc6q000kdktzrla5vk8u",
        "title": "Event 1",
        "description": "Description for event 1",
        "dateTime": "2026-04-06T14:50:43.823Z",
        "capacity": 8,
        "organiserId": "cmnlvpc4m0006dktzxfhv1gw1",
        "createdAt": "2026-04-05T14:50:43.826Z"
    },
    //all the events
]
```

---

### Create Event (Organiser Only)

**POST** `/api/events`

Headers:

```
Authorization: Bearer JWT_TOKEN
```

Body:

```json
{
  "title": "Test Event Title",
  "description": "Test Event Description",
  "dateTime": "2026-04-05T10:00:00.000Z",
  "capacity": 10
}
```

Response:

```json

{
    "id": "cmnlw9rus00009ctz3tes1dca",
    "title": "Test Event Title",
    "description": "Test Event Description",
    "dateTime": "2026-04-05T10:00:00.000Z",
    "capacity": 10,
    "organiserId": "cmnlvpw620000aktzdvvjbath",
    "createdAt": "2026-04-05T15:06:37.252Z"
}

```

---

### Get Single Event

**GET** `/api/events/:id` //Example /api/events/cmnlvrdge0002aktzzynd3dld

Response:

```json
{
    "id": "cmnlvrdge0002aktzzynd3dld",
    "title": "Test Event",
    "description": "Created by organiser",
    "dateTime": "2026-04-10T10:00:00.000Z",
    "capacity": 5,
    "organiserId": "cmnlvpw620000aktzdvvjbath",
    "createdAt": "2026-04-05T14:52:18.783Z"
}
```
---

### Update Event

**PUT** `/api/events/:id` //Example /api/events/cmnlvrdge0002aktzzynd3dld

Headers:

```
Authorization: Bearer JWT_TOKEN
```

Body:

```json
{
  "title": "Updated Event Title",
  "capacity": 10,
  "dateTime": "2026-04-15T10:00:00.000Z",
  "description": "An Updated Event"
}
```

Response:

```json

{
    "id": "cmnlw9rus00009ctz3tes1dca",
    "title": "Updated Event Title",
    "description": "An Updated Event",
    "dateTime": "2026-04-15T10:00:00.000Z",
    "capacity": 10,
    "organiserId": "cmnlvpw620000aktzdvvjbath",
    "createdAt": "2026-04-05T15:06:37.252Z"
}

```

---

### Delete Event

**DELETE** `/api/events/:id` //Example /api/events/cmnlvrdge0002aktzzynd3dld

Headers:

```
Authorization: Bearer JWT_TOKEN
```


Response:

```json

{
    "message": "Deleted successfully"
}

```

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
```json
//Example
{
  "eventId": "cmnlw9rus00009ctz3tes1dca"
}
```

Response:

```json

{
    "id": "cmnlwadcd00019ctzvb9lh15e",
    "userId": "cmnlvqed00001aktzkn1l9wk8",
    "eventId": "cmnlw9rus00009ctz3tes1dca",
    "bookedAt": "2026-04-05T15:07:05.101Z"
}

```

---

### Cancel Booking

**DELETE** `/api/bookings`

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
```json
//Example
{
  "eventId": "cmnlw9rus00009ctz3tes1dca"
}
```

Response:

```json

{
    "message": "Booking cancelled"
}

```

---
## Dashboard

### See Dashboard

**GET** `/api/events/:id/dashboard` //Example /api/events/cmnlvrdge0002aktzzynd3dld/dashboard

Headers:

```
Authorization: Bearer TOKEN
```


Response:

```json

{
    "id": "cmnlw9rus00009ctz3tes1dca",
    "title": "Updated Event Title",
    "capacity": 10,
    "ticketsSold": 1,
    "attendees": [
        {
            "id": "cmnlvqed00001aktzkn1l9wk8",
            "name": "Attendee One",
            "email": "att1@test.com"
        }
    ]
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
* 500 → Internal Server Error

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

Seed will be completed with:
- 5 organisers
- 25 attendees
- 12 events

//Example Logins

* Organiser:

  * email: `organiser1@test.com`
  * password: `123`

* Attendee:

  * email: `attendee1@test.com`
  * password: `123`

---

# Notes

* Only organisers can create events
* Attendees can book events
* Booking is limited by event capacity
* Duplicate bookings are prevented

---
