import DashboardStats from "./_components/DashboardStats";
import DashboardCards from "./_components/DashboardCards";

export default function Page() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      <DashboardCards />
    </div>
  );
}

export type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "user" | "admin";
};

