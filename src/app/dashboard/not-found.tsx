import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <GlassCard className="max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-2xl">Page Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="gradient">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

