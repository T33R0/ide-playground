import React, { useCallback } from 'react';

const App: React.FC = () => {
  const handleDispatchEvent = useCallback(async () => {
    try {
      // Dynamically import the event bus from the host
      const { dispatchEvent } = await import('host/eventBus');
      
      // Dispatch a notification event
      dispatchEvent('show:notification', { 
        message: 'Vehicle saved in Garage!',
        type: 'success',
        duration: 3000
      });
      
      console.log('Event dispatched from mfe-garage');
    } catch (error) {
      console.error('Failed to dispatch event:', error);
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Garage MFE</h1>
        <button
          onClick={handleDispatchEvent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Dispatch Event
        </button>
      </div>
      <p className="text-gray-600">Welcome to the Garage Management System</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h2 className="text-lg font-semibold text-green-800">Vehicle Status</h2>
          <p className="text-green-700 mt-2">All systems operational</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-lg font-semibold text-yellow-800">Maintenance</h2>
          <p className="text-yellow-700 mt-2">Next service due in 30 days</p>
        </div>
      </div>
    </div>
  );
};

export default App;
