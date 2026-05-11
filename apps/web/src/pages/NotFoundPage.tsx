import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-5xl font-bold text-muted">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="max-w-md text-sm text-muted">Check the URL or return to the dashboard.</p>
      <Link to="/dashboard">
        <Button type="button">Go to dashboard</Button>
      </Link>
    </div>
  );
}
