import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/Layout/Dashboard/DashboardLayout";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/Navbar";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import UserProvider from "./context/user.provider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
// import BudgetPage from "./pages/dashboard/BudgetPage";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ExpensesPage from "./pages/dashboard/ExpensesPage";
import InflowPage from "./pages/dashboard/InflowPage";
import TransactionsPage from "./pages/dashboard/TransactionsPage";
// import RemindersPage from "./pages/dashboard/RemindersPage";
// import ReportsPage from "./pages/dashboard/ReportsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

export default function App() {
  return (
    <>
      <Routes>
        <Route
          element={
            <>
              <Navbar />
              <Outlet />
              <Footer />
            </>
          }
        >
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <UserProvider>
              <DashboardLayout />
            </UserProvider>
          }
        >
          <Route element={<ProtectedRoute />}>
            <Route index element={<DashboardOverview />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="inflow" element={<InflowPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            {/* <Route path="budget" element={<BudgetPage />} /> */}
            {/* <Route path="reports" element={<ReportsPage />} /> */}
            {/* <Route path="reminders" element={<RemindersPage />} /> */}
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
