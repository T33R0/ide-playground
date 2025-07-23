import React, { Suspense, useState } from 'react';

// Dynamically import the shared Button component
const Button = React.lazy(() => import('shared_ui/Button'));

const App: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate an async operation
    setTimeout(() => {
      setClickCount(prev => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Home MFE</h1>
        <div className="text-sm text-gray-500">
          Clicks: <span className="font-semibold">{clickCount}</span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">Welcome to the Home Micro Frontend</p>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Featured Content</h2>
          <p className="text-blue-700">This content is loaded from the Home MFE</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3">Shared UI Component Demo</h3>
          <div className="flex flex-wrap gap-3">
            <Suspense fallback={<div>Loading button...</div>}>
              <Button 
                variant="primary" 
                onClick={handleClick}
                loading={isLoading}
                loadingText="Processing..."
              >
                Primary Button
              </Button>
              
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={handleClick}
                disabled={isLoading}
              >
                Outline Button
              </Button>
              
              <Button 
                variant="danger" 
                className="ml-2"
                onClick={handleClick}
                disabled={isLoading}
              >
                Danger Button
              </Button>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
