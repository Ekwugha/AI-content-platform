"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="font-bold text-2xl text-foreground">Something went wrong</h1>
                <p className="text-muted-foreground mt-2">
                  We apologize for the inconvenience. Please try again.
                </p>
                {process.env.NODE_ENV === "development" && error?.message && (
                  <pre className="mt-4 p-3 bg-muted rounded-lg text-xs text-left overflow-auto max-h-32 text-foreground">
                    {error.message}
                  </pre>
                )}
              </div>
              <div className="flex gap-3">
                <Button onClick={reset} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"} className="gap-2">
                  <Home className="h-4 w-4" />
                  Go home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

