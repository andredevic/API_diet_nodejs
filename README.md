# 🥗 Daily Diet API

A RESTful API built with Node.js and Fastify to manage a daily diet.

This project is an API for tracking and managing meals, allowing users to log what they've eaten and check if they are following their diet. The API also provides metrics on the user's performance.

---

## ✨ Features

- **User Registration**: Allows the creation of new user accounts.  
- **Authentication via Cookies**: Identifies the user across requests using a `sessionId` stored in cookies.  
- **Complete Meal CRUD**:
  - Register a new meal (name, description, date, time, and whether it's on the diet).  
  - List all meals for a user.  
  - View a single meal by ID.  
  - Update a meal's details.  
  - Delete a meal.  
- **User Metrics**:
  - Total number of registered meals.  
  - Total number of meals within the diet.  
  - Total number of meals outside the diet.  
  - Best sequence of consecutive meals within the diet.  
- **Data Validation**: Uses Zod to ensure that input data is valid and secure.  

---

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime environment.  
- **Fastify**: High-performance web framework.  
- **TypeScript**: A typed superset of JavaScript.  
- **Knex.js**: A SQL query builder for Node.js.  
- **SQLite**: An embedded SQL database engine.  
- **Zod**: A TypeScript-first schema declaration and validation library.  

---

## 🚀 Getting Started

Follow the steps below to set up and run the application locally.

### Prerequisites

- Node.js (v18 or higher)  
- npm or yarn  

### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

2. **Install dependencies:**
```bash
npm install
```
3. **Set up environment variables:**
Copy the example file .env.example to a new file named .env.
```bash
cp .env.example .env
```
The default value for DATABASE_URL is already configured to use SQLite in the db/app.db file.

4. **Run database migrations:**
This command will create the users and meals tables in your database.
```bash
npm run knex -- migrate:latest
```

5. **Start the server:**
```bash
npm run dev
```

The API will be running at http://localhost:3333

---

## 📖 API Endpoints
### Users (/users)
POST /users

Creates a new user. After creation, a sessionId cookie is returned in the response headers, which must be used to authenticate subsequent requests.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com"
}
```

Success Response: 201 Created

### Meals (/meals)

Note: All routes below are protected and require the sessionId cookie to be sent with the request.

POST /meals

Registers a new meal for the authenticated user.

**Request Body:**
```json
{
  "name": "Lunch",
  "description": "Rice, beans, grilled chicken, and salad.",
  "isOnDiet": true,
  "date": "2025-09-18T12:30:00.000Z"
}
```

Success Response: 201 Created

### GET /meals

Lists all meals for the authenticated user.

**Success Response: 200 OK**
```json
{
  "meals": [
    {
      "id": "meal-uuid",
      "user_id": "user-uuid",
      "name": "Lunch",
      "description": "Rice, beans, grilled chicken, and salad.",
      "is_on_diet": true,
      "date": "2025-09-18T12:30:00.000Z",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```
### GET /meals/:id

Returns the details of a single meal belonging to the user.

**Success Response: 200 OK**

PUT /meals/:id

Updates the data of an existing meal.

**Request Body:**
```json
{
  "name": "Light Dinner",
  "description": "Vegetable soup.",
  "isOnDiet": true,
  "date": "2025-09-18T20:00:00.000Z"
}
```

Success Response: 204 No Content

### DELETE /meals/:id

Deletes a meal belonging to the user.

**Success Response: 204 No Content**

GET /meals/metrics

Returns the meal metrics for the authenticated user.

**Success Response: 200 OK**
```json
{
  "totalMeals": 25,
  "totalMealsOnDiet": 20,
  "totalMealsOffDiet": 5,
  "bestOnDietSequence": 12
}
```
