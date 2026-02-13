import { motion } from "framer-motion";
import {
    ArrowLeft,
    BarChart2,
    ShieldCheck,
    TrendingUp,
    Wallet
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
    {
        icon: BarChart2,
        title: "Advanced Analytics",
        description: "Visualize your spending patterns with detailed charts."
    },
    {
        icon: TrendingUp,
        title: "Smart Budgeting",
        description: "Set goals and track your progress in real-time."
    },
    {
        icon: ShieldCheck,
        title: "Bank-Grade Security",
        description: "Your financial data is encrypted and secure."
    }
];

const AuthFeatureSection = () => {
    return (
        <div className="hidden lg:flex relative w-full h-full bg-linear-to-br from-background via-background to-primary/5 items-center justify-center p-12 overflow-hidden ">
            {/* Abstract Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="mb-0 lg:absolute lg:top-8 lg:right-8 z-20">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                </Link>
            </div>

            <div className="relative z-10 w-full max-w-xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Wallet className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-display font-bold text-foreground">
                            Flow<span className="gradient-text">Map</span>
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                        Master your money, <br />
                        <span className="gradient-text">Unleash your potential.</span>
                    </h2>

                    <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-lg">
                        Experience the future of personal finance management with our intuitive, powerful, and beautiful platform.
                    </p>
                </motion.div>

                {/* Feature Cards Grid */}
                <div className="grid gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                            className="group glass-card p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all duration-300 flex items-start gap-4"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Floating Abstract UI Element */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-tr from-primary/20 to-secondary/20 rounded-full blur-2xl -z-10 animate-pulse"
                />
            </div>
        </div>
    );
};

export default AuthFeatureSection;
