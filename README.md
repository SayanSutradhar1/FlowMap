# FlowMap

A comprehensive full-stack application for tracking expenses, managing cash flow, and visualizing financial analytics.

## Tech Stack

**Frontend:**

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **UI Components:** Radix UI, Lucide React
- **Charts:** Recharts

**Backend:**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Caching:** Redis (ioredis)
- **Authentication:** JWT, Cookie Parser
- **Logging:** Morgan

## Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v18+)
- PostgreSQL
- Redis

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd money-statement
```

### 2. Install Dependencies

Install dependencies for the root, client, and server:

```bash
# Root dependencies
npm install

# Client dependencies
cd client-web
npm install

# Server dependencies
cd ../server
npm install
```

### 3. Environment Configuration

#### Server

Create a `.env` file in the `server` directory:

```env
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/money_statement?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_USERNAME=default
REDIS_PASSWORD=

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Client
CLIENT_URL=http://localhost:5173

# Email (Optional)
EMAIL_USER=
EMAIL_PASSWORD=
```

#### Client

Create a `.env.local` file in the `client-web` directory:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Database Setup

Navigate to the server directory and run migrations:

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

## Running the Application

To run both the client and server concurrently from the root directory:

```bash
npm run dev
```

### Individual Commands

- **Client only:** `npm run client`
- **Server only:** `npm run server`
- **Prisma Studio:** `npm run studio`

## Scripts

- `npm run dev` - Runs client, server, and Prisma Studio concurrently.
- `npm run client` - Starts the Vite frontend dev server.
- `npm run server` - Starts the Express backend dev server with Nodemon.
- `npm run generate` - Generates Prisma client.
- `npm run migrate` - Runs Prisma migrations.
