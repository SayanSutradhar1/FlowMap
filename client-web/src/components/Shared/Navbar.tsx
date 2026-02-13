import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 bg-background/60 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">
            Flow<span className="gradient-text">Map</span>
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="/#analytics"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Analytics
          </a>
          <a
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="default" className="text-muted-foreground hover:text-foreground hover:bg-white/5">
              Log in
            </Button>
          </Link>

          <Link to="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
