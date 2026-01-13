"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Share2,
  MousePointer,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { StatsCard, GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const dailyData = [
  { date: "Jan 1", views: 1200, clicks: 340, shares: 45 },
  { date: "Jan 2", views: 1800, clicks: 520, shares: 62 },
  { date: "Jan 3", views: 1400, clicks: 380, shares: 38 },
  { date: "Jan 4", views: 2200, clicks: 680, shares: 89 },
  { date: "Jan 5", views: 1900, clicks: 510, shares: 72 },
  { date: "Jan 6", views: 2400, clicks: 720, shares: 95 },
  { date: "Jan 7", views: 2800, clicks: 890, shares: 110 },
  { date: "Jan 8", views: 2100, clicks: 620, shares: 78 },
  { date: "Jan 9", views: 3200, clicks: 980, shares: 125 },
  { date: "Jan 10", views: 2900, clicks: 860, shares: 102 },
  { date: "Jan 11", views: 3500, clicks: 1050, shares: 138 },
  { date: "Jan 12", views: 3100, clicks: 920, shares: 115 },
  { date: "Jan 13", views: 3800, clicks: 1180, shares: 145 },
];

const contentTypeData = [
  { name: "Blog Posts", value: 45, color: "#f59e0b" },
  { name: "Social Posts", value: 30, color: "#10b981" },
  { name: "Ad Copy", value: 15, color: "#6366f1" },
  { name: "Email", value: 10, color: "#ec4899" },
];

const topContent = [
  {
    id: "1",
    title: "10 Ways to Grow Your Business in Nigeria",
    views: 4521,
    engagement: 8.2,
    trend: "up",
  },
  {
    id: "2",
    title: "The Future of Fintech in Africa",
    views: 3892,
    engagement: 7.5,
    trend: "up",
  },
  {
    id: "3",
    title: "How to Build a Personal Brand",
    views: 2834,
    engagement: 6.8,
    trend: "down",
  },
  {
    id: "4",
    title: "Nigerian Tech Ecosystem Overview",
    views: 2456,
    engagement: 5.9,
    trend: "up",
  },
  {
    id: "5",
    title: "Marketing Strategies for SMEs",
    views: 2103,
    engagement: 5.2,
    trend: "down",
  },
];

const stats = [
  {
    title: "Total Views",
    value: "45.2K",
    change: { value: 12.5, trend: "up" as const },
    icon: <Eye className="h-5 w-5" />,
  },
  {
    title: "Total Clicks",
    value: "12.8K",
    change: { value: 8.3, trend: "up" as const },
    icon: <MousePointer className="h-5 w-5" />,
  },
  {
    title: "Total Shares",
    value: "2,945",
    change: { value: 15.2, trend: "up" as const },
    icon: <Share2 className="h-5 w-5" />,
  },
  {
    title: "Avg. Time on Page",
    value: "4:32",
    change: { value: 2.1, trend: "up" as const },
    icon: <Clock className="h-5 w-5" />,
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState("30d");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your content performance and engagement metrics.
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <GlassCard className="lg:col-span-2">
          <Tabs defaultValue="views">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Performance Overview</h3>
              <TabsList>
                <TabsTrigger value="views">Views</TabsTrigger>
                <TabsTrigger value="clicks">Clicks</TabsTrigger>
                <TabsTrigger value="shares">Shares</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="views" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#viewsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="clicks" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <defs>
                    <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#clicksGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="shares" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="shares" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </GlassCard>

        {/* Content Distribution */}
        <GlassCard>
          <h3 className="font-semibold mb-4">Content Distribution</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {contentTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Top Performing Content */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Top Performing Content</h3>
          <Button variant="ghost" size="sm">
            View All <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                  Content
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Views
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Engagement
                </th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {topContent.map((content, index) => (
                <tr
                  key={content.id}
                  className="border-b last:border-0 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-mono text-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium">{content.title}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">
                    {content.views.toLocaleString()}
                  </td>
                  <td className="text-right py-3 px-4">
                    <Badge variant={content.engagement > 6 ? "success" : "warning"}>
                      {content.engagement}%
                    </Badge>
                  </td>
                  <td className="text-right py-3 px-4">
                    {content.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500 inline" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}

