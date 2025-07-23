
import React from "react";
import "./index.css";

const App = () => {
  const handleClick = async () => {
    const { dispatchEvent } = await import('host/eventBus');
    dispatchEvent('show:notification', { message: 'Vehicle saved in Garage!' });
    console.log('Event dispatched from mfe-garage');
  };

  return (
    <div className="border-4 border-red-500 p-4">
      <h1 className="text-xl font-bold text-red-500">Garage MFE</h1>
      <button 
        onClick={handleClick}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Dispatch Event
      </button>
    </div>
  );
};

export default App; 