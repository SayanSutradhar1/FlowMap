# Money Statement Backend (FlowMap)

This is the backend server for the Money Statement / FlowMap application. It provides a RESTful API for managing user authentication, expenses, budgets, cash flow, and generating analytics reports.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Caching**: Redis (with `ioredis`)
- **Authentication**: JWT (JSON Web Tokens) & Cookies
- **Email**: Nodemailer

## Prerequisites

Before running the server, ensure you have the following installed:

- Node.js (v18+ recommended)
- PostgreSQL
- Redis

## Installation

1.  Navigate to the server directory:

    ```bash
    cd server
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables (see [Environment Variables](#environment-variables)).

4.  Generate Prisma Client:

    ```bash
    npm run prisma:generate
    ```

5.  Run database migrations:
    ```bash
    npm run prisma:migrate
    ```

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration (Prisma)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Redis Configuration
REDIS_HOST=localhost
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Email Configuration (for Nodemailer)
# (Add specific SMTP variables if required by your setup)
```

## Running the Server

- **Development Mode** (with hot-reload):

  ```bash
  npm run dev
  ```

- **Production Mode**:

  ```bash
  npm run build
  npm start
  ```

- **Prisma Studio** (Database GUI):
  ```bash
  npm run prisma:studio
  ```

## API Architecture

The API is structured around resource-based routes. The base prefix for all API routes is `/api`.

### 1. Authentication (`/api/auth`)

| Method | Endpoint   | Description                          |
| :----- | :--------- | :----------------------------------- |
| `POST` | `/signin`  | Sign in a user                       |
| `POST` | `/signout` | Sign out (clears cookie)             |
| `GET`  | `/get`     | Get currently signed-in user details |

### 2. User Management (`/api/user`)

| Method   | Endpoint      | Description                |
| :------- | :------------ | :------------------------- |
| `POST`   | `/signup`     | Register a new user        |
| `POST`   | `/verify`     | Verify user email/account  |
| `POST`   | `/abort`      | Abort verification process |
| `GET`    | `/get/:id`    | Get user by ID             |
| `GET`    | `/get/:email` | Get user by Email          |
| `DELETE` | `/delete/:id` | Delete a user account      |

### 3. Expenses (`/api/expense`)

| Method   | Endpoint                  | Description                    |
| :------- | :------------------------ | :----------------------------- |
| `POST`   | `/add`                    | Add a new expense              |
| `GET`    | `/all`                    | Get all expenses for the user  |
| `GET`    | `/get/:id`                | Get specific expense details   |
| `GET`    | `/getMonthlyExpenses/:id` | Get expenses filtered by month |
| `PATCH`  | `/update/:id`             | Update an existing expense     |
| `DELETE` | `/delete/:id`             | Delete an expense              |

### 4. Cash Flow (`/api/cash`)

| Method | Endpoint                 | Description                    |
| :----- | :----------------------- | :----------------------------- |
| `GET`  | `/get/:id`               | Get current cash balance       |
| `POST` | `/setLimit/:id`          | Set daily spending limit       |
| `GET`  | `/transactions/:id`      | Get cash transactions history  |
| `GET`  | `/getMonthlySavings/:id` | Get savings data for the month |
| `GET`  | `/getMonthlyInflow/:id`  | Get inflow data for the month  |
| `GET`  | `/getInflows/:id`        | Get all inflows                |
| `POST` | `/addInflow`             | Record a new cash inflow       |
| `POST` | `/recoverCash/:id`       | Recover or adjust cash balance |

### 5. Budget (`/api/budget`)

| Method | Endpoint | Description                   |
| :----- | :------- | :---------------------------- |
| `GET`  | `/:id`   | Get budget details for a user |
| `PUT`  | `/:id`   | Update budget settings        |

### 6. Analytics (`/api/analytics`)

| Method | Endpoint        | Description                      |
| :----- | :-------------- | :------------------------------- |
| `GET`  | `/basic/:id`    | Basic analytics summary          |
| `GET`  | `/monthly/:id`  | Monthly analysis data            |
| `GET`  | `/category/:id` | Expense distribution by category |

### 7. Reports (`/api/reports`)

| Method | Endpoint            | Description                  |
| :----- | :------------------ | :--------------------------- |
| `GET`  | `/transactions/:id` | Generate transaction reports |

## Project Structure

```
server/
├── prisma/             # Database schema and migrations
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Custom middlewares (Auth, Error, etc.)
│   ├── routes/         # API Route definitions
│   ├── utils/          # Utility functions
│   ├── app.ts          # App configuration
│   └── main.ts         # Server entry point
└── package.json        # Dependencies and scripts
```
