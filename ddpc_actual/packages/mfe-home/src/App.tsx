import React from "react";
import "./index.css";
import { Button } from "shared_ui/button";
import { Link } from "react-router-dom";
import {
  Car,
  Wrench,
  BarChart3,
  Zap,
  NotebookText,
  Lightbulb,
} from "lucide-react";

const heroImage = "http://localhost:8080/assets/hero-garage.jpg";

const featuresData = [
  {
    icon: Car,
    title: "Vehicle Management",
    description:
      "Organize and track your entire vehicle collection in one place",
  },
  {
    icon: Wrench,
    title: "Build Planning",
    description:
      "Plan, track, and execute modification projects with detailed task management",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Monitor progress, costs, and timelines across all your projects",
  },
  {
    icon: Zap,
    title: "Performance Tracking",
    description: "Document performance gains and modifications over time",
  },
  {
    icon: NotebookText,
    title: "Maintenance Logs",
    description: "Keep detailed records of maintenance and service history",
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Get intelligent recommendations for your builds and maintenance",
  },
];

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="rounded-lg bg-card/20 p-6">
    <div className="flex items-center gap-4">
      <Icon className="h-8 w-8 text-primary" />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="mt-4 text-muted-foreground">{description}</p>
  </div>
);

const features = (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "24px",
    }}
  >
    {featuresData.map((feature) => (
      <FeatureCard
        key={feature.title}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
      />
    ))}
  </div>
);

const Home = () => {
  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      <div
        className="relative w-full flex items-center justify-center bg-cover"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
          backgroundPosition: "center",
          minHeight: "80vh",
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <p className="mt-6 max-w-3xl text-lg text-foreground/80">
            The ultimate platform for managing your vehicles, planning builds,
            and tracking progress in a high-tech warehouse environment.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/garage">
              <Button
                size="lg"
                variant="outline"
                className="text-foreground border-border hover:bg-card/50"
              >
                View My Garage
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="text-foreground border-border hover:bg-card/50"
              >
                Project Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Powerful Tools for Every Enthusiast
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              From weekend warriors to professional builders, our platform
              provides everything you need to manage your automotive projects.
            </p>
          </div>
          <div className="mt-16">{features}</div>
        </div>
      </div>

      <div className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Join thousands of automotive enthusiasts who trust ddpc to manage
            their builds and track their progress.
          </p>
          <div className="mt-10">
            <Link to="/garage">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Explore Your Garage →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
