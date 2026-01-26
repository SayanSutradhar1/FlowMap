import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const areaData = [
  { month: "Jan", expenses: 2400, budget: 3000 },
  { month: "Feb", expenses: 1398, budget: 3000 },
  { month: "Mar", expenses: 2800, budget: 3000 },
  { month: "Apr", expenses: 3908, budget: 3000 },
  { month: "May", expenses: 2800, budget: 3000 },
  { month: "Jun", expenses: 2100, budget: 3000 },
];

const barData = [
  { category: "Food", amount: 850 },
  { category: "Transport", amount: 420 },
  { category: "Shopping", amount: 680 },
  { category: "Bills", amount: 1200 },
  { category: "Entertainment", amount: 350 },
];

const pieData = [
  { name: "Essentials", value: 45 },
  { name: "Lifestyle", value: 25 },
  { name: "Savings", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["hsl(174 72% 46%)", "hsl(38 92% 55%)", "hsl(280 65% 60%)", "hsl(222 25% 40%)"];

const AnalyticsPreview = () => {
  return (
    <section id="analytics" className="relative py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Analytics
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Visualize Your
            <br />
            <span className="gradient-text-secondary">Financial Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive charts and reports that make it easy to understand 
            where your money goes and how to optimize your spending.
          </p>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground">Monthly Overview</h3>
                <p className="text-sm text-muted-foreground">Expenses vs Budget</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Expenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/30" />
                  <span className="text-sm text-muted-foreground">Budget</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} style={{ background: "transparent" }}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(174 72% 46%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(174 72% 46%)" stopOpacity={0} />
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
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(174 72% 46%)" 
                    strokeWidth={3}
                    fill="url(#expenseGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">Category Breakdown</h3>
            <p className="text-sm text-muted-foreground mb-6">This month's spending by category</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" style={{ background: "transparent" }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "hsl(220 15% 55%)", fontSize: 12 }}
                    width={80}
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
                  <Bar 
                    dataKey="amount" 
                    fill="hsl(174 72% 46%)" 
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">Budget Allocation</h3>
            <p className="text-sm text-muted-foreground mb-6">How your budget is distributed</p>
            <div className="flex items-center justify-between">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={{ background: "transparent" }}>
                    <Pie
                      data={pieData}
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-muted-foreground">{entry.name}</span>
                    <span className="text-sm font-semibold text-foreground">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPreview;
