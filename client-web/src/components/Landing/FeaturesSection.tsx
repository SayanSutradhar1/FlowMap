import { motion } from "framer-motion";
import { 
  Wallet, 
  BarChart3, 
  Bell, 
  Shield, 
  Zap,
  Target,
  Calendar,
  TrendingDown
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Easy Expense Tracking",
    description: "Add expenses in seconds with our intuitive interface. Categorize, tag, and organize your spending effortlessly.",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description: "Beautiful charts and graphs that reveal your spending patterns. Monthly, yearly, and custom date range analysis.",
    color: "secondary",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified when you're approaching budget limits or when unusual spending patterns are detected.",
    color: "accent",
  },
  {
    icon: Target,
    title: "Budget Goals",
    description: "Set monthly budgets for different categories and track your progress in real-time with visual indicators.",
    color: "primary",
  },
  {
    icon: Calendar,
    title: "Recurring Expenses",
    description: "Never forget a subscription again. Track recurring bills and get reminders before they're due.",
    color: "secondary",
  },
  {
    icon: TrendingDown,
    title: "Spending Insights",
    description: "AI-powered insights that analyze your habits and suggest ways to reduce unnecessary spending.",
    color: "accent",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const FeaturesSection = () => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary/20 text-primary";
      case "secondary":
        return "bg-secondary/20 text-secondary";
      case "accent":
        return "bg-accent/20 text-accent";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Everything You Need to
            <br />
            <span className="gradient-text">Take Control</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to help you understand your spending, 
            set meaningful goals, and build better financial habits.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card p-6 group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
