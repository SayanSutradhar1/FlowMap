import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Target,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  Bell,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/context/sidebar-context";
import { signout } from "@/services/auth.service";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: Receipt, label: "Expenses", path: "/dashboard/expenses" },
  { icon: Wallet, label: "Inflow", path: "/dashboard/inflow" },
  { icon: ArrowRightLeft, label: "Transactions", path: "/dashboard/transactions" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Target, label: "Budget Goals", path: "/dashboard/budget" },
  { icon: TrendingUp, label: "Reports", path: "/dashboard/reports" },
  { icon: Bell, label: "Reminders", path: "/dashboard/reminders" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export const DashboardSidebar = () => {
  const { collapsed, toggle } = useSidebarContext();
  const location = useLocation();

  const navigate = useNavigate();

  const handleSignOut = async () => {

    const response = await signout();
    if (response?.success) navigate("/login");
    else toast.error(response?.error || response?.message || "Something went wrong");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0, damping: 20 }}
      className="h-screen bg-card/60 backdrop-blur-2xl border-r border-white/5 flex flex-col fixed left-0 top-0 z-50 shadow-2xl overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-accent/5 blur-3xl opacity-50" />
      </div>

      {/* Logo */}
      <div className="p-6 relative z-10">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Wallet className="w-6 h-6 text-primary-foreground relative z-10" />
          </motion.div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col overflow-hidden whitespace-nowrap"
              >
                <span className="font-display text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary via-primary-foreground to-accent animate-gradient-shift bg-size-[200%_auto]">
                  FlowMap
                </span>
                <span className="text-xs text-muted-foreground font-medium">Finance Tracker</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4 space-y-1.5 overflow-y-auto no-scrollbar relative z-10">
        <div className="h-px w-full bg-linear-to-r from-transparent via-border/50 to-transparent mb-4 opacity-50" />

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="block outline-none"
            >
              <div className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-linear-to-r from-primary to-accent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    <div className="absolute inset-0 bg-white/10" />
                  </motion.div>
                )}

                {/* Check if not active to show hover effect */}
                {!isActive && (
                  <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                )}

                <item.icon
                  className={cn(
                    "w-5 h-5 relative z-10 transition-colors duration-300",
                    isActive ? "text-primary-foreground" : "group-hover:text-primary"
                  )}
                />

                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium relative z-10 whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}

                {isActive && !collapsed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 relative z-10 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 relative z-10">
        <div className="h-px w-full bg-linear-to-r from-transparent via-border/50 to-transparent mb-4 opacity-50" />

        <button
          onClick={toggle}
          className="w-full flex items-center justify-center gap-2 mb-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 group"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <div className="flex items-center gap-2 w-full px-2">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium text-sm">Collapse Sidebar</span>
            </div>
          )}
        </button>

        <button
          onClick={handleSignOut}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border border-transparent hover:border-destructive/20 hover:bg-destructive/10 group relative overflow-hidden",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 text-destructive group-hover:scale-110 transition-transform duration-300" />
          {!collapsed && (
            <span className="font-medium text-destructive">Logout</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};
