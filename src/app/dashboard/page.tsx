"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  TrendingUp,
  Eye,
  Share2,
  ArrowUpRight,
  Plus,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { StatsCard, GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "Total Content",
    value: "127",
    change: { value: 12, trend: "up" as const },
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Total Views",
    value: "24.5K",
    change: { value: 8, trend: "up" as const },
    icon: <Eye className="h-5 w-5" />,
  },
  {
    title: "Engagement Rate",
    value: "4.2%",
    change: { value: 0.5, trend: "up" as const },
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "Total Shares",
    value: "1,892",
    change: { value: 23, trend: "up" as const },
    icon: <Share2 className="h-5 w-5" />,
  },
];

const recentContent = [
  {
    id: "1",
    title: "10 Ways to Grow Your Business in Nigeria",
    type: "blog",
    status: "published",
    views: 1234,
    date: "2 hours ago",
  },
  {
    id: "2",
    title: "New Product Launch Announcement",
    type: "social",
    status: "scheduled",
    views: 0,
    date: "Tomorrow, 9:00 AM",
  },
  {
    id: "3",
    title: "Black Friday Sale Campaign",
    type: "ad",
    status: "draft",
    views: 0,
    date: "Yesterday",
  },
  {
    id: "4",
    title: "Weekly Newsletter #42",
    type: "email",
    status: "published",
    views: 567,
    date: "3 days ago",
  },
];

const quickActions = [
  { label: "Blog Post", href: "/dashboard/editor?type=blog", icon: FileText },
  { label: "Social Post", href: "/dashboard/editor?type=social", icon: Share2 },
  { label: "Schedule", href: "/dashboard/calendar", icon: Calendar },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Ade 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your content today.
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/dashboard/editor">
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Link>
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Content */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Content</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/content">
                  View All <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{content.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          content.status === "published"
                            ? "success"
                            : content.status === "scheduled"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {content.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {content.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {content.views > 0 && (
                      <p className="text-sm font-medium">
                        {content.views.toLocaleString()} views
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{content.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Quick Actions */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className="h-4 w-4 mr-3" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          </GlassCard>

          {/* AI Usage */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">AI Usage</h2>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Generations Used
                  </span>
                  <span className="text-sm font-medium">78 / 100</span>
                </div>
                <Progress value={78} />
              </div>
              <p className="text-xs text-muted-foreground">
                Resets in 12 days. <Link href="/dashboard/settings" className="text-primary hover:underline">Upgrade for unlimited</Link>
              </p>
            </div>
          </GlassCard>

          {/* Upcoming */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upcoming</h2>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {[
                { title: "Product Launch Post", time: "Tomorrow, 9:00 AM" },
                { title: "Weekly Newsletter", time: "Friday, 10:00 AM" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 text-sm"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/dashboard/calendar">View Calendar</Link>
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

