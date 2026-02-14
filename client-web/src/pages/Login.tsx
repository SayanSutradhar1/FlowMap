import AuthFeatureSection from "@/components/Auth/AuthFeatureSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { credentialLogin } from "@/services/auth.service";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleCredentialLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await credentialLogin(email, password);
      if (response?.success) {
        navigate("/dashboard");
      }
      toast.success(response?.message);
    } catch {
      // toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden h-screen">
      {/* Left Column - Form */}
      <div className="flex flex-col relative p-6 lg:p-12 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex-1 flex items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[420px] relative z-10"
          >
            <div className="w-full p-8 shadow-none border-0  lg:shadow-2xl lg:shadow-black/40 lg:border lg:border-white/10 lg:backdrop-blur-3xl rounded-none lg:rounded-2xl">
              {/* Header */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-primary/60 mb-6 shadow-lg shadow-primary/25"
                >
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </motion.div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-3">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground text-sm">
                  Sign in to continue your financial journey
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleCredentialLogin} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="email" className="text-foreground/80 mb-2 block text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 hover:bg-white/10 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="password" className="text-foreground/80 text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 hover:bg-white/10 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 font-semibold text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Signing in
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center text-muted-foreground mt-8 text-sm"
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
                >
                  Sign up for free
                </Link>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Feature Section */}
      <AuthFeatureSection />
    </div>
  );
};

export default Login;
