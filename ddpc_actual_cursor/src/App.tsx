
import React, { Suspense } from "react";
import "./index.css";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

const MfeTemplateApp = React.lazy(() => import("mfe_template/MfeTemplateApp"));

const App = () => {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <MfeTemplateApp />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

export default App; 