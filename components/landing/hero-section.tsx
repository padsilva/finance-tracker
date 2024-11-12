import { BarChart, PieChart, Wallet, Bell } from "lucide-react";

const featureList = [
  {
    icon: BarChart,
    title: "Expense Tracking",
    description: "Track your spending and income with ease",
  },
  {
    icon: PieChart,
    title: "Smart Analytics",
    description: "Get insights into your financial habits",
  },
  {
    icon: Wallet,
    title: "Budget Management",
    description: "Set and track budgets for your goals",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Stay on top of your finances",
  },
];

export const HeroSection = () => (
  <div className="flex-1">
    <h1 className="mb-4 text-4xl font-bold text-foreground">
      Smart Financial Management,{" "}
      <span className="text-primary">Made Simple</span>
    </h1>
    <p className="mb-8 text-lg text-muted-foreground">
      Track expenses, manage budgets, and achieve your financial goals with our
      intuitive platform.
    </p>
    <div className="grid grid-cols-2 gap-6">
      {featureList.map(({ icon: FeatureIcon, title, description }) => (
        <div key={title} className="flex items-start gap-3">
          <div className="mt-1">
            <FeatureIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
