# Money Statement Frontend (FlowMap)

This is the frontend client for the Money Statement / FlowMap application. It is a modern, responsive single-page application (SPA) built to provide users with a seamless interface for managing their finances, tracking expenses, and viewing analytics.

## Technology Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI (Radix UI + Class Variance Authority)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Features

- **Authentication**: secure login and signup pages.
- **Dashboard Overview**: comprehensive view of financial health, recent activity, and quick stats.
- **Expense Tracking**: detailed log of expenses with categorization and filtering.
- **Income Management (Inflow)**: track various sources of income.
- **Budgeting**: set and manage budgets for different categories.
- **Analytics**: visual breakdowns of spending habits and trends using interactive charts.
- **Reports**: generate and view detailed transaction reports (PDF export via `jspdf`).
- **Profile & Settings**: manage user profile and application preferences.

## Prerequisites

- Node.js (v18+ recommended)
- NPM

## Installation

1.  Navigate to the `client-web` directory:

    ```bash
    cd client-web
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables (see [Environment Variables](#environment-variables)).

## Environment Variables

Create a `.env.local` file in the `client-web` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000/api
```

## Running the Application

- **Development Mode**:

  ```bash
  npm run dev
  ```

  This will start the Vite development server, usually at `http://localhost:5173`.

- **Production Build**:

  ```bash
  npm run build
  ```

  This compiles the TypeScript code and bundles the application for production in the `dist` folder.

- **Preview Production Build**:

  ```bash
  npm run preview
  ```

- **Linting**:
  ```bash
  npm run lint
  ```

## Project Structure

```
client-web/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries (e.g., utils.ts for cn)
│   ├── pages/          # Application pages (views)
│   │   ├── dashboard/  # Dashboard sub-pages
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── Home.tsx
│   ├── services/       # API service files (Axios calls)
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main App component & Router setup
│   └── main.tsx        # Entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## UI Architecture

The UI is built using a component-first approach.

- **Shadcn/UI** is used for foundational components (Buttons, Inputs, Dialogs, etc.) located in `src/components/ui`.
- **Layouts**: The application typically uses a layout wrapper for the authenticated dashboard area to handle the sidebar and top navigation consistently.
