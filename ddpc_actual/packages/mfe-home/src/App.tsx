
import React, { Suspense } from "react";
import "./index.css";

const Button = React.lazy(() => import('shared_ui/Button'));

const App = () => {
  return (
    <div className="border-4 border-green-500 p-4">
      <h1 className="text-xl font-bold text-green-500">Home MFE</h1>
      <Suspense fallback="Loading button...">
        <Button onClick={() => alert('Shared button clicked!')}>Shared Button</Button>
      </Suspense>
    </div>
  );
};

export default App; 