import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";

const heroImage = "http://localhost:8080/assets/hero-garage.jpg";

const featuresData = [
  {
    icon: Car,
    title: "Your Digital Command Center",
    description:
      "Centralize every vehicle, from daily driver to track weapon. Move beyond scattered records to a single source of truth for your entire fleet.",
  },
  {
    icon: Wrench,
    title: "Execute Flawless Builds",
    description:
      "Go from a vision to a completed project. Create detailed build sheets, manage parts lists, and track every task from concept to execution with operational precision.",
  },
  {
    icon: BarChart3,
    title: "Actionable Intelligence",
    description: "Stop guessing. Instantly visualize your resource allocation, cost-per-mile, budget burn rate, and more. Transform raw data into strategic insight.",
  },
  {
    icon: Zap,
    title: "Quantify Every Gain",
    description: "Connect every modification directly to its performance impact. Create a data-backed timeline of your vehicle's evolution from stock to its current state.",
  },
  {
    icon: NotebookText,
    title: "Achieve Proactive Readiness",
    description: "End the spreadsheet chaos. Log every service event to build an unbreakable vehicle history and transition from reactive repairs to proactive reliability.",
  },
  {
    icon: Lightbulb,
    title: "Your Data-Driven Co-Pilot",
    description: "Leverage your own data to make smarter decisions. Get predictive alerts on component wear, identify budget overruns, and discover insights to optimize your next move.",
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

// Main App Component - Standardized structure for consistent CSS loading
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure CSS is fully loaded before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Force style recalculation to prevent grid layout issues
      document.body.offsetHeight;
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
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
          Total Clarity. Total Control.
          </p>
          <p className="mt-6 max-w-3xl text-lg text-foreground/80">
          For every vehicle in your garage. ddpc is the definitive platform to track maintenance, manage builds, and master your automotive investments.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/garage">
              <Button
                size="lg"
                variant="outline"
                className="text-foreground border-border hover:bg-card/50"
              >
                Garage
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="text-foreground border-border hover:bg-card/50"
              >
                Dashboard
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
    </div>
  );
};

export default Home;
