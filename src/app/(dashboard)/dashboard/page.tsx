import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClerkUser } from "@/actions/get-clerk-user";

async function fetchDashboardData() {
  // Implement your server action here
  // ...
}

export default async function DashboardPage() {
  const user = await getClerkUser();
  // This is mainly for TypeScript type safety
  if (!user) {
    return null; // or some error component
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

      {/* Rest of your component remains the same */}
    </div>
  );
}
