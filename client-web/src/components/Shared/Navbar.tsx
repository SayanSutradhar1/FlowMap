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
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-md shadow-lg shadow-black/30"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">
            Flow<span className="gradient-text">Map</span>
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#features"
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Features
          </a>
          <a
            href="/#analytics"
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Analytics
          </a>
          <a
            href="/#pricing"
            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="default">
              Log in
            </Button>
          </Link>

          <Link to="/signup">
            <Button variant="default" size="default">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
