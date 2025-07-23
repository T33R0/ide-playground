import React from 'react';

const App: React.FC = () => {
  return (
    <div className="border-2 border-dashed border-blue-500 p-4 rounded-lg bg-blue-50">
      <div className="text-center">
        <h2 className="text-xl font-bold text-blue-700 mb-2">MFE Template Loaded</h2>
        <p className="text-blue-600">This is a template for Micro Frontend applications</p>
        <div className="mt-4 p-3 bg-white rounded border border-blue-200">
          <p className="text-sm text-gray-600">
            This component is being served from the MFE Template application.
            It can be customized and extended for different features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
