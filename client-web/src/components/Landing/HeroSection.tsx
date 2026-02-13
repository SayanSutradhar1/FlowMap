import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, PieChart, Shield, Zap, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Refined Glowing Orbs */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-primary/10 blur-[120px] rounded-full opacity-50" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full" />

      {/* Noise Texture for Grainy Effect */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm shadow-sm hover:bg-muted/70 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Smart expense tracking powered by AI insights</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight text-balance tracking-tight"
          >
            Master Your
            <br />
            <span className="gradient-text drop-shadow-sm">Money Flow</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
          >
            Track daily expenses effortlessly, visualize spending patterns with beautiful charts,
            and get intelligent insights that help you save more every month.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/login">
              <Button size="lg" className="group rounded-full px-8 h-12 text-base bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 cursor-pointer">
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                Get Started
              </Button>
            </Link>
          </motion.div>

          {/* Features / Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-12"
          >
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display font-semibold text-foreground">Bank-Grade Security</div>
              <div className="text-sm text-muted-foreground mt-1">Your data is safe with us</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto bg-secondary/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <div className="font-display font-semibold text-foreground">Real-time Updates</div>
              <div className="text-sm text-muted-foreground mt-1">Instant sync across devices</div>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <div className="font-display font-semibold text-foreground">AI-Powered Insights</div>
              <div className="text-sm text-muted-foreground mt-1">Smart financial advice</div>
            </div>
          </motion.div>
        </div>

        {/* Floating Cards */}
        <div className="absolute top-1/4 left-10 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="floating"
          >
            <div className="glass-card p-4 flex items-center gap-3 shadow-elevated">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">This Month</div>
                <div className="text-sm font-semibold text-foreground">-12% Expenses</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-1/3 right-10 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="floating-delayed"
          >
            <div className="glass-card p-4 flex items-center gap-3 shadow-elevated">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Savings Goal</div>
                <div className="text-sm font-semibold text-foreground">78% Complete</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}

    </section>
  );
};

export default HeroSection;
