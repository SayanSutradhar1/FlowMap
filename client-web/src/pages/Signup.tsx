import AuthFeatureSection from "@/components/Auth/AuthFeatureSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signup, verifyUser } from "@/services/user.service";
import type { Profession, State, UserType } from "@/utils/types";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  User
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const professions: Profession[] = [
  "STUDENT",
  "EMPLOYED",
  "SELF_EMPLOYED",
  "BUSINESS",
  "RETIRED",
  "UNEMPLOYED",
];

type Gender = "MALE" | "FEMALE" | "OTHER";

const genders: Array<Gender> = ["MALE", "FEMALE", "OTHER",];

const indianStates: Array<State> = [
  "ANDHRA_PRADESH",
  "ARUNACHAL_PRADESH",
  "ASSAM",
  "BIHAR",
  "CHHATTISGARH",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL_PRADESH",
  "JHARKHAND",
  "KARNATAKA",
  "KERALA",
  "MADHYA_PRADESH",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "NAGALAND",
  "ODISHA",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL_NADU",
  "TELANGANA",
  "TRIPURA",
  "UTTAR_PRADESH",
  "UTTARAKHAND",
  "WEST_BENGAL",
];

export type SignUpParams = Omit<UserType, "id" | "createdAt" | "updatedAt" | "isVerified" | "verifiedAt" | "verificationOtp" | "cash" | "expenses"> & { password: string, confirmPassword: string }

const Signup = () => {
  const [formData, setFormData] = useState<SignUpParams>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profession: "BUSINESS",
    gender: "",
    age: Number(),
    state: "ANDHRA_PRADESH",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading] = useState(false);
  const [isOtpFormOpened, setIsOtpFormOpened] = useState(false);
  const [email, setEmail] = useState<string>()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.age < 13 || formData.age > 120) {
      toast.error("Age must be between 13 and 120");
      return;
    }

    const toastId = toast.loading("Creating account...");

    try {
      const response = await signup(formData)

      if (!response.success) {
        toast.error(response.message || "Something went wrong... Please try again")
        return
      }

      toast.success(response.message)
      setIsOtpFormOpened(true)
      setEmail(response.data?.email)

    } catch (error) {
      console.log(error)
      toast.error((error as Error).message || "Something went wrong... Please try again")
    } finally {
      toast.dismiss(toastId)
    }

  };

  const handleGoogleSignup = () => {
  };

  return (
    <div className="h-screen bg-background grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* Left Column - Form */}
      <div className="flex flex-col relative p-6 lg:p-12 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Back Button */}


        <div className="flex-1 flex items-center justify-center w-full py-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[600px] relative z-10"
          >
            {
              isOtpFormOpened ? (
                <OtpForm email={email || formData.email} />
              ) : (
                <div className="glass-card p-8 shadow-none border-0 bg-transparent lg:shadow-2xl lg:shadow-black/40 lg:border lg:border-white/10 lg:bg-background/40 lg:backdrop-blur-3xl rounded-none lg:rounded-2xl">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-secondary to-secondary/60 mb-6 shadow-lg shadow-secondary/25"
                    >
                      <Sparkles className="w-8 h-8 text-secondary-foreground" />
                    </motion.div>
                    <h1 className="text-3xl font-display font-bold text-foreground mb-3">
                      Create Account
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Join FlowMap and start your journey to financial freedom
                    </p>
                  </div>

                  {/* Google Signup */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-foreground"
                      onClick={handleGoogleSignup}
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </motion.div>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-wider">
                      <span className="px-4 bg-transparent text-muted-foreground backdrop-blur-sm">
                        or create with email
                      </span>
                    </div>
                  </div>

                  {/* Signup Form */}
                  <form onSubmit={handleSignup} className="space-y-5">
                    {/* Name */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="name" className="text-foreground/80 mb-2 block text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="pl-11 h-12 bg-white/5 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 hover:bg-white/10 transition-all"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <Label htmlFor="email" className="text-foreground/80 mb-2 block text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className="pl-11 h-12 bg-white/5 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 hover:bg-white/10 transition-all"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Profession & Age Row */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    >
                      <div>
                        <Label
                          htmlFor="profession"
                          className="text-foreground/80 mb-2 block text-sm font-medium"
                        >
                          Profession
                        </Label>
                        <Select
                          value={formData.profession}
                          onValueChange={(value) => handleChange("profession", value)}
                          required
                        >
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-muted-foreground" />
                              <SelectValue placeholder="Select profession" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-white/10 max-h-60">
                            {professions.map((profession) => (
                              <SelectItem key={profession} value={profession}>
                                {profession.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="age" className="text-foreground/80 mb-2 block text-sm font-medium">
                          Age
                        </Label>
                        <div className="relative group">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                          <Input
                            id="age"
                            type="number"
                            placeholder="Age"
                            min="13"
                            max="120"
                            value={formData.age}
                            onChange={(e) => handleChange("age", e.target.value)}
                            className="pl-11 h-12 bg-white/5 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 hover:bg-white/10 transition-all"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Gender & State Row */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    >
                      <div>
                        <Label htmlFor="gender" className="text-foreground/80 mb-2 block text-sm font-medium">
                          Gender
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => handleChange("gender", value)}
                          required
                        >
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 hover:bg-white/10 transition-all">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-white/10">
                            {genders.map((gender) => (
                              <SelectItem key={gender} value={gender}>
                                {gender}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="state" className="text-foreground/80 mb-2 block text-sm font-medium">
                          State
                        </Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => handleChange("state", value)}
                          required
                        >
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-muted-foreground" />
                              <SelectValue placeholder="Select state" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-white/10 max-h-60">
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>

                    {/* Password */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="password" className="text-foreground/80 mb-2 block text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleChange("password", e.target.value)}
                          className="pl-11 pr-11 h-12 bg-white/5 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 hover:bg-white/10 transition-all"
                          required
                          minLength={8}
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

                    {/* Confirm Password */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 }}
                    >
                      <Label
                        htmlFor="confirmPassword"
                        className="text-foreground/80 mb-2 block text-sm font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleChange("confirmPassword", e.target.value)
                          }
                          className="pl-11 pr-11 h-12 bg-white/5 border-white/10 focus:border-secondary/50 focus:ring-secondary/20 hover:bg-white/10 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
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
                      transition={{ delay: 0.7 }}
                    >
                      <Button
                        type="submit"
                        className="w-full h-12 mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all duration-300 font-semibold text-base"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                            Creating Account...
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Footer */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    className="text-center text-muted-foreground mt-8 text-sm"
                  >
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-secondary hover:text-secondary/80 font-semibold transition-colors hover:underline"
                    >
                      Sign in
                    </Link>
                  </motion.p>
                </div>)}
          </motion.div>
        </div>
      </div>

      {/* Right Column - Feature Section */}
      <AuthFeatureSection />
    </div>
  );
};


const OtpForm = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState("")
  const navigate = useNavigate()
  const [isVerificationDone, setIsVerificationDone] = useState(false)
  const isVerificationDoneRef = useRef(false)

  useEffect(() => {
    isVerificationDoneRef.current = isVerificationDone
  }, [isVerificationDone])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    const toastId = toast.loading("Verifying your email...")

    try {
      const response = await verifyUser(email, otp)

      if (response.status === 500) {
        toast.error(response.message)
        navigate("/signup")
        return
      }

      if (response.success) {
        setIsVerificationDone(true)
        toast.success(response.message)
        navigate("/login")
      }

      else {
        toast.error(response.message)
      }
    } catch (error) {
      console.log(error)
      toast.error((error as Error).message)
    } finally {
      setOtp("")
      toast.dismiss(toastId)
    }
  }

  useEffect(() => {
    const performAbort = () => {
      if (!isVerificationDoneRef.current) {
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
        fetch(`${baseUrl}/user/abort`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          keepalive: true,
        }).catch((err) => console.error("Failed to abort verification", err));
      }
    };

    const handleBeforeUnload = () => {
      performAbort();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      performAbort();
    };
  }, [email]);

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-foreground mb-3">
        Verify Your Email
      </h1>
      <p className="text-muted-foreground text-sm">
        Enter the OTP sent to {email}
      </p>
      <form onSubmit={handleVerify}>
        <Input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button type="submit">Verify</Button>
      </form>
    </div>
  )
}

export default Signup;
