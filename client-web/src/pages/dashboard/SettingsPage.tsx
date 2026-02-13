import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUserContext } from "@/context/user.context";
import type { Profession } from "@/utils/types";
import { motion } from "framer-motion";
import { Bell, Palette, Shield, User } from "lucide-react";
import { useMemo } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SettingsPage = () => {

  const context = useUserContext()

  const user = useMemo(() => context.user, [context.user])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 w-full mx-auto pb-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground/80 max-w-2xl">
          Manage your account settings, preferences, and security options all in one place.
        </p>
      </motion.div>

      {/* Profile Settings */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-xs hover:shadow-md transition-all duration-300">
          <CardHeader className="pag-6 pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Profile Settings</CardTitle>
                <CardDescription className="text-base">
                  Update your personal information and public profile
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-background">
                  {user?.name
                    ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                    : "JD"}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full ring-2 ring-background" />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="font-semibold text-lg">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    This will be displayed on your profile and dashboard.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="h-9">Change Photo</Button>
                  <Button variant="ghost" size="sm" className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Full Name</Label>
                <Input defaultValue={user?.name || "John Doe"} className="h-10 bg-background/50 focus:bg-background transition-colors" />
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Email Address</Label>
                <Input
                  defaultValue={user?.email || "john@example.com"}
                  className="h-10 bg-background/50 focus:bg-background transition-colors"
                />
              </div>
              {/* <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Phone Number</Label>
                <Input defaultValue="+91 98765 43210" className="h-10 bg-background/50 focus:bg-background transition-colors" />
              </div> */}
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Profession</Label>
                <Input
                  defaultValue={user?.profession as Profession}
                  className="h-10 bg-background/50 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="lg" className="px-8">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={itemVariants}>

        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-sm font-medium">This section is not operational. Working is under progress.</p>
        </div>

        <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-xs hover:shadow-md transition-all duration-300">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent/10 to-accent/5 ring-1 ring-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Bell className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Notifications</CardTitle>
                <CardDescription className="text-base">
                  Configure how you want to be notified
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6">
              {[
                { title: "Email Notifications", desc: "Receive expense alerts and weekly reports via email" },
                { title: "Push Notifications", desc: "Get real-time alerts on your mobile device" },
                { title: "Budget Alerts", desc: "Get notified when you exceed 80% of your budget" },
                { title: "Payment Reminders", desc: "Receive reminders 3 days before bills are due" }
              ].map((item, index, arr) => (
                <div key={item.title}>
                  <div className="flex items-center justify-between py-1">
                    <div className="space-y-0.5">
                      <p className="font-medium text-base">{item.title}</p>
                      <p className="text-sm text-muted-foreground max-w-[90%]">
                        {item.desc}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  {index !== arr.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={itemVariants}>

        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-sm font-medium">This section is not operational. Working is under progress.</p>
        </div>

        <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-xs hover:shadow-md transition-all duration-300">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500/10 to-violet-500/5 ring-1 ring-violet-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Palette className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <CardTitle className="text-xl">Preferences</CardTitle>
                <CardDescription className="text-base">Customize your dashboard experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Currency</Label>
                <Select defaultValue="inr">
                  <SelectTrigger className="h-10 bg-background/50 focus:bg-background transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">₹ INR - Indian Rupee</SelectItem>
                    <SelectItem value="usd">$ USD - US Dollar</SelectItem>
                    <SelectItem value="eur">€ EUR - Euro</SelectItem>
                    <SelectItem value="gbp">£ GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="h-10 bg-background/50 focus:bg-background transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Date Format</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger className="h-10 bg-background/50 focus:bg-background transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-sm font-medium text-foreground/80">Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger className="h-10 bg-background/50 focus:bg-background transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={itemVariants}>

        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-sm font-medium">This section is not operational. Working is under progress.</p>
        </div>

        <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-xs hover:shadow-md transition-all duration-300">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500/10 to-emerald-500/5 ring-1 ring-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-xl">Security</CardTitle>
                <CardDescription className="text-base">Manage your security preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
              <div>
                <p className="font-semibold">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Secure your account with 2FA
                </p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
              <div>
                <p className="font-semibold">Change Password</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Update your password regularly
                </p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
              <div>
                <p className="font-semibold">Active Sessions</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage your logged in devices
                </p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={itemVariants}>

        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-sm font-medium">This section is not operational. Working is under progress.</p>
        </div>

        <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-xl shadow-xs hover:shadow-md transition-all duration-300">
          <CardHeader className="p-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-red-500/80" />
              <div>
                <CardTitle className="text-xl text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription className="text-base">Irreversible actions </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Export Data</p>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your data
                </p>
              </div>
              <Button variant="outline" className="border-foreground/20 hover:bg-foreground/5">Export</Button>
            </div>
            <Separator className="bg-red-500/10" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your account
                </p>
              </div>
              <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
export default SettingsPage
