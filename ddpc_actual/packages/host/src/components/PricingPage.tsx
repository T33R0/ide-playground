import React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from 'shared_ui';

const CheckIcon = () => ( // A simple check icon component for the feature list
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const PricingPage = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Find the Plan That's Right for You</h1>
        <p className="text-xl text-gray-600 mt-2">Start for free, then upgrade as you grow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Tier Card */}
        <Card>
          <CardHeader>
            <CardTitle>Driver</CardTitle>
            <CardDescription>The essential toolkit to keep your history organized.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">$0 <span className="text-lg font-normal">/ Free</span></div>
            <ul className="space-y-3">
              <li className="flex items-center"><CheckIcon /><span className="ml-2">2 Garage Slots</span></li>
              <li className="flex items-center"><CheckIcon /><span className="ml-2">Digital Maintenance Records</span></li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Get Started</Button>
          </CardFooter>
        </Card>

        {/* Builder Tier Card - Highlighted */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Builder</CardTitle>
            <CardDescription>For enthusiasts who plan and execute modifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">$7 <span className="text-lg font-normal">/ month</span></div>
             <ul className="space-y-3">
              <li className="flex items-center"><CheckIcon /><span className="ml-2">3 Garage Slots</span></li>
              <li className="flex items-center"><CheckIcon /><span className="ml-2">Digital Maintenance Records</span></li>
              <li className="flex items-center"><CheckIcon /><span className="ml-2">Modification Build Lists</span></li>
              <li className="flex items-center"><CheckIcon /><span className="ml-2">Part Wishlists & Sourcing</span></li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Start Your Build</Button>
          </CardFooter>
        </Card>

        {/* Pro Tier Card */}
        <Card>
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>The ultimate command center for serious builders.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold mb-4">$15 <span className="text-lg font-normal">/ month</span></div>
             <ul className="space-y-3">
              <li className="flex items-center"><CheckIcon /><span className="ml-2">5 Garage Slots</span></li>
              <li className="flex items-center"><CheckIcon /><span className="ml-2">Everything in Builder</span></li>
              <li className="flex items-center"><CheckIcon /><span className="ml-2">Project Budget Tracking</span></li>
              <li className="flex items-center"><CheckIcon /><span className="ml-2">Task Lists & Status</span></li>
              <li className="flex items-center"><CheckIcon /><span className="ml-2">Mobile Companion App</span></li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Go Pro</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;
