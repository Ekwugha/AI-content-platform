import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPalette } from "@/components/command-palette";
import "./globals.css";

export const metadata: Metadata = {
  title: "AfroCreate AI - Premium AI Content Platform",
  description:
    "Create stunning content with AI. Built for creators, startups, and businesses in Africa and beyond.",
  keywords: [
    "AI content",
    "content creation",
    "Nigeria",
    "Africa",
    "blog writing",
    "social media",
    "copywriting",
  ],
  authors: [{ name: "AfroCreate" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "AfroCreate AI - Premium AI Content Platform",
    description:
      "Create stunning content with AI. Built for creators, startups, and businesses in Africa and beyond.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPalette />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
