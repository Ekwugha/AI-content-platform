"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  MessageCircle,
  Mail,
  Video,
  ExternalLink,
  ChevronRight,
  Search,
  Sparkles,
  FileText,
  Calendar,
  BarChart3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/card";

const helpCategories = [
  {
    icon: Sparkles,
    title: "Getting Started",
    description: "Learn the basics of AfroCreate AI",
    articles: [
      "Creating your first content",
      "Understanding AI generation",
      "Setting up your profile",
    ],
  },
  {
    icon: FileText,
    title: "Content Creation",
    description: "Master the art of AI-powered content",
    articles: [
      "Blog post best practices",
      "Social media optimization",
      "Ad copy that converts",
    ],
  },
  {
    icon: Calendar,
    title: "Content Calendar",
    description: "Plan and schedule your content",
    articles: [
      "Using the calendar view",
      "Scheduling content",
      "Managing deadlines",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Understand your content performance",
    articles: [
      "Reading analytics dashboard",
      "Improving engagement",
      "Export reports",
    ],
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together effectively",
    articles: [
      "Inviting team members",
      "Role permissions",
      "Content review workflow",
    ],
  },
];

const faqs = [
  {
    question: "How does the AI content generation work?",
    answer:
      "AfroCreate uses advanced GPT-4 technology to generate high-quality content based on your inputs. Simply provide a topic, select your tone and content type, and let the AI create engaging content for you.",
  },
  {
    question: "Can I generate content in Nigerian Pidgin?",
    answer:
      "Yes! AfroCreate has special support for Nigerian context and can generate content in Nigerian Pidgin English. Just select 'Nigerian Pidgin' as your tone option.",
  },
  {
    question: "How many AI generations do I get per month?",
    answer:
      "This depends on your plan. Free users get 5 generations/month, Pro users get unlimited generations, and Team plans include unlimited generations for all team members.",
  },
  {
    question: "Can I edit the AI-generated content?",
    answer:
      "Absolutely! All generated content is fully editable. We encourage you to review and customize the content to match your unique voice and requirements.",
  },
];

export default function HelpPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
        <p className="text-muted-foreground mb-6">
          Search our knowledge base or browse the categories below
        </p>
        <div className="relative max-w-md mx-auto">
          <Input
            placeholder="Search for help..."
            icon={<Search className="h-4 w-4" />}
            className="h-12"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <GlassCard hoverable className="text-center">
          <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">Documentation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Detailed guides and tutorials
          </p>
          <Button variant="outline" size="sm">
            Browse Docs <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </GlassCard>

        <GlassCard hoverable className="text-center">
          <div className="p-3 rounded-xl bg-emerald-500/10 w-fit mx-auto mb-3">
            <MessageCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="font-semibold mb-1">Live Chat</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Chat with our support team
          </p>
          <Button variant="outline" size="sm">
            Start Chat
          </Button>
        </GlassCard>

        <GlassCard hoverable className="text-center">
          <div className="p-3 rounded-xl bg-blue-500/10 w-fit mx-auto mb-3">
            <Video className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="font-semibold mb-1">Video Tutorials</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Watch step-by-step guides
          </p>
          <Button variant="outline" size="sm">
            Watch Videos <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </GlassCard>
      </div>

      {/* Help Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpCategories.map((category) => (
            <GlassCard key={category.title} hoverable>
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
              <ul className="space-y-2">
                {category.articles.map((article) => (
                  <li key={article}>
                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent text-sm transition-colors">
                      {article}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <GlassCard>
          <div className="divide-y">
            {faqs.map((faq, index) => (
              <details key={index} className="group py-4 first:pt-0 last:pb-0">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-muted-foreground pr-8">{faq.answer}</p>
              </details>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Contact */}
      <GlassCard className="text-center">
        <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
        <p className="text-muted-foreground mb-4">
          Our support team is here to help you succeed
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email Support
          </Button>
          <Button variant="gradient">
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Live Chat
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

