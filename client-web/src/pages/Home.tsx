import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CreditCard,
  Flame,
  PiggyBank,
  Sparkles,
  Wallet,
} from "lucide-react";

const balanceData = [
  { month: "Jan", inflow: 4200, outflow: 2800 },
  { month: "Feb", inflow: 4600, outflow: 3100 },
  { month: "Mar", inflow: 5100, outflow: 3300 },
  { month: "Apr", inflow: 5400, outflow: 3600 },
  { month: "May", inflow: 6000, outflow: 3900 },
  { month: "Jun", inflow: 6400, outflow: 4100 },
];

const categories = [
  { name: "Housing", value: 920 },
  { name: "Food", value: 780 },
  { name: "Transport", value: 410 },
  { name: "Shopping", value: 620 },
  { name: "Wellness", value: 280 },
];

const goals = [
  { label: "Emergency fund", percent: 72, color: "hsl(174 72% 46%)" },
  { label: "Vacation", percent: 54, color: "hsl(38 92% 55%)" },
  { label: "New laptop", percent: 32, color: "hsl(280 65% 60%)" },
];

const activity = [
  { title: "Groceries", amount: "-$86.40", tag: "Food", tone: "down" },
  { title: "Salary", amount: "+$3,900.00", tag: "Income", tone: "up" },
  { title: "Ride share", amount: "-$18.20", tag: "Transport", tone: "down" },
  { title: "Gym membership", amount: "-$45.00", tag: "Wellness", tone: "down" },
  { title: "Cashback", amount: "+$12.70", tag: "Rewards", tone: "up" },
];

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  accent,
}: {
  icon: any;
  title: string;
  value: string;
  change: string;
  accent: string;
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    className="glass-card p-5 flex items-start gap-3 border border-border/60"
  >
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-${accent}/15 text-${accent}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <div className="text-xs flex items-center gap-1 text-muted-foreground">
        <span className={change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}>{change}</span>
        vs last month
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="absolute inset-0 bg-hero-pattern overflow-hidden" />
      <div className="absolute -top-32 -right-10 w-[520px] h-[520px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 -left-10 w-[420px] h-[420px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-24 space-y-10 w-full">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 text-sm text-muted-foreground border border-border/50">
                <Sparkles className="w-4 h-4 text-secondary" />
                Smart overview · live sync
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-left">
                Your fluid money dashboard
              </h1>
              <p className="text-muted-foreground max-w-2xl text-left">
                Real-time cash flow, goals, and spending insights with silky motion and glassmorphic UI.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button variant="ghost" className="border border-border/60">Export</Button>
              <Button variant="default" className="shadow-lg shadow-primary/30">
                Add expense
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
            <StatCard icon={Wallet} title="Cash on hand" value="$12,480" change="+4.3%" accent="primary" />
            <StatCard icon={CreditCard} title="Monthly burn" value="$3,410" change="-2.1%" accent="secondary" />
            <StatCard icon={PiggyBank} title="Savings rate" value="28%" change="+3.2%" accent="accent" />
            <StatCard icon={Flame} title="Credit util." value="21%" change="-1.4%" accent="primary" />
          </div>
        </div>

        {/* Charts row */}
        <div className="grid xl:grid-cols-3 gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 xl:col-span-2 border border-border/60"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Cash flow trend</p>
                <p className="text-xl font-display font-semibold">Inflow vs Outflow</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /> Inflow</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary" /> Outflow</span>
              </div>
            </div>
            <div className="h-72 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceData} style={{ background: "transparent" }}>
                  <defs>
                    <linearGradient id="inflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(174 72% 46%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(174 72% 46%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(38 92% 55%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(38 92% 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "hsl(220 15% 55%)", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "hsl(220 15% 55%)", fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(222 40% 10%)", 
                      border: "1px solid hsl(222 25% 20%)", 
                      borderRadius: 12,
                      color: "hsl(180 20% 95%)"
                    }}
                    itemStyle={{ color: "hsl(180 20% 95%)" }}
                    labelStyle={{ color: "hsl(180 20% 95%)" }}
                  />
                  <Area dataKey="inflow" type="monotone" stroke="hsl(174 72% 46%)" strokeWidth={3} fill="url(#inflow)" />
                  <Area dataKey="outflow" type="monotone" stroke="hsl(38 92% 55%)" strokeWidth={3} fill="url(#outflow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="glass-card p-6 space-y-4 border border-border/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget health</p>
                <p className="text-xl font-display font-semibold">72% on track</p>
              </div>
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-52 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="50%" outerRadius="100%" data={goals} startAngle={90} endAngle={-270} style={{ background: "transparent" }}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="percent" cornerRadius={10} background={{ fill: "hsl(222 30% 18%)" }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(222 40% 10%)", 
                      border: "1px solid hsl(222 25% 20%)", 
                      borderRadius: 12,
                      color: "hsl(180 20% 95%)"
                    }}
                    itemStyle={{ color: "hsl(180 20% 95%)" }}
                    labelStyle={{ color: "hsl(180 20% 95%)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {goals.map((g) => (
                <div key={g.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: g.color }} />
                    <span className="text-muted-foreground">{g.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{g.percent}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Categories + Activity */}
        <div className="grid lg:grid-cols-3 gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="glass-card p-6 border border-border/60"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xl font-display font-semibold">Category heat</p>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-64 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} style={{ background: "transparent" }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "hsl(220 15% 55%)", fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "hsl(220 15% 55%)", fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(222 40% 10%)", 
                      border: "1px solid hsl(222 25% 20%)", 
                      borderRadius: 12,
                      color: "hsl(180 20% 95%)"
                    }}
                    itemStyle={{ color: "hsl(180 20% 95%)" }}
                    labelStyle={{ color: "hsl(180 20% 95%)" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 4, 4]} fill="hsl(174 72% 46%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="glass-card p-6 space-y-4 border border-border/60"
          >
            <div className="flex items-center justify-between">
              <p className="text-xl font-display font-semibold">Recent activity</p>
              <ArrowDownRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.title} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/40">
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.tag}</p>
                  </div>
                  <span className={`text-sm font-semibold ${item.tone === "up" ? "text-emerald-400" : "text-rose-400"}`}>
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="glass-card p-6 space-y-4 border border-border/60"
          >
            <p className="text-xl font-display font-semibold">Upcoming bills</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-secondary/30">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Rent · 02 Jul</p>
                  <p className="text-xs text-muted-foreground">Auto-pay enabled</p>
                </div>
                <span className="font-semibold text-secondary">$1,280</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Insurance · 05 Jul</p>
                  <p className="text-xs text-muted-foreground">Ends in 5 days</p>
                </div>
                <span className="font-semibold text-primary">$240</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Streaming · 08 Jul</p>
                  <p className="text-xs text-muted-foreground">Family plan</p>
                </div>
                <span className="font-semibold text-foreground">$18</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Home;