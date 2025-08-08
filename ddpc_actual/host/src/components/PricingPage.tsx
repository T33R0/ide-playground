import React from 'react';
import { Check, Info } from 'lucide-react';
import { Button } from 'shared_ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'shared_ui/card';

// Icon components that properly accept className
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <Check className={`flex-shrink-0 ${className}`} />
);

const InfoIcon = ({ className = '' }: { className?: string }) => (
  <Info className={`flex-shrink-0 ${className}`} />
);

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-warehouse">
      <div className="max-w-7xl mx-auto pt-24 pb-8 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Find the Plan That's Right for You</h1>
          <p className="text-xl text-slate-300 mt-2">Start for free, then upgrade as you grow.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Tier Card - Clean white with blue CTA */}
          <Card className="flex flex-col h-full bg-white border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-foreground">Driver</CardTitle>
              <CardDescription className="text-muted-foreground">Free Tier</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold mb-4 text-foreground">$0 <span className="text-lg font-normal text-muted-foreground">/ Free</span></div>
              <ul className="space-y-3">
                <li className="flex items-start"><CheckIcon className="text-blue-500" /><span className="ml-2 text-foreground">2 garage slots and basic maintenance records</span></li>
                <li className="flex items-start"><CheckIcon className="text-blue-500" /><span className="ml-2 text-foreground">50 receipts per month with standard categorization</span></li>
                <li className="flex items-start"><CheckIcon className="text-blue-500" /><span className="ml-2 text-foreground">Community access and basic sharing features</span></li>
                <li className="flex items-start"><CheckIcon className="text-blue-500" /><span className="ml-2 text-foreground">Strategic limitations to encourage upgrades without frustrating users</span></li>
                <li className="flex items-start"><InfoIcon className="text-blue-400" /><span className="ml-2 text-foreground">You could log maintenance on the same two vehicles forever and never pay a cent</span></li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Get Started</Button>
            </CardFooter>
          </Card>

          {/* Builder Tier Card - Vibrant coral with prominence */}
          <Card className="flex flex-col h-full relative border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">Most Popular</span>
            </div>
            <CardHeader className="pt-6">
              <CardTitle className="text-orange-800">Builder</CardTitle>
              <CardDescription className="text-orange-600">Recommended</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold mb-4 text-orange-800">$12.99 <span className="text-lg font-normal text-orange-600">/ month</span></div>
              <div className="text-sm text-orange-600 mb-4">or $129.99/year</div>
              <ul className="space-y-3">
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-orange-700">Unlimited garage slots and advanced maintenance tracking</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-orange-700">Mod build lists and wishlists with detailed project planning</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-orange-700">Enhanced sharing features and community integration</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-orange-700">500 receipts monthly with 2GB photo storage</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-orange-700">Basic analytics and insights on spending patterns</span></li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-md">Start Your Build</Button>
            </CardFooter>
          </Card>

          {/* Pro Tier Card - Deep purple/navy premium styling */}
          <Card className="flex flex-col h-full bg-gradient-to-br from-purple-900 to-indigo-900 border-purple-700 text-white hover:shadow-lg hover:-translate-y-1 hover:shadow-purple-500/20 transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-purple-100">Pro</CardTitle>
              <CardDescription className="text-purple-200">Premium</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold mb-4 text-white">$24.99 <span className="text-lg font-normal text-purple-200">/ month</span></div>
              <div className="text-sm text-purple-200 mb-4">or $239.99/year</div>
              <ul className="space-y-3">
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-purple-100">Everything in Builder plus advanced project management</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-purple-100">Comprehensive budget tracking with detailed cost analysis</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-purple-100">Mobile app access (launching Year 1)</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-purple-100">Unlimited receipts with 10GB photo storage</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-purple-100">Advanced analytics dashboard and export capabilities</span></li>
                <li className="flex items-start"><CheckIcon /><span className="ml-2 text-purple-100">Priority email support and API access</span></li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white border-purple-500">Go Pro</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
