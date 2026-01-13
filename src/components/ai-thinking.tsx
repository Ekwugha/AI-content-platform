"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, Brain, Zap, Loader2 } from "lucide-react";

interface AIThinkingProps {
  isVisible: boolean;
  message?: string;
  variant?: "default" | "inline" | "fullscreen";
  className?: string;
}

export function AIThinking({
  isVisible,
  message = "AI is thinking...",
  variant = "default",
  className,
}: AIThinkingProps) {
  if (variant === "fullscreen") {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 rounded-2xl flex flex-col items-center gap-6"
            >
              <AIBrainAnimation />
              <div className="text-center">
                <p className="text-lg font-medium">{message}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This usually takes a few seconds
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (variant === "inline") {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn("flex items-center gap-2 text-primary", className)}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "glass-card p-4 rounded-xl flex items-center gap-4",
            className
          )}
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-primary"
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
            <motion.div
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
            />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{message}</p>
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AIBrainAnimation() {
  return (
    <div className="relative w-24 h-24">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/30 to-emerald-500/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner spinning ring */}
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-dashed border-primary/50"
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Central brain icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Brain className="h-10 w-10 text-primary" />
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/60"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI) / 3) * 40, 0],
            y: [0, Math.sin((i * Math.PI) / 3) * 40, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Zap effects */}
      <motion.div
        className="absolute -right-2 top-1/2"
        animate={{
          opacity: [0, 1, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.5,
        }}
      >
        <Zap className="h-4 w-4 text-amber-500" />
      </motion.div>

      <motion.div
        className="absolute -left-2 top-1/2"
        animate={{
          opacity: [0, 1, 0],
          x: [0, -5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 1,
        }}
      >
        <Zap className="h-4 w-4 text-emerald-500" />
      </motion.div>
    </div>
  );
}

// Skeleton loading component for content
export function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded-lg w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    </div>
  );
}

// Typing indicator
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
