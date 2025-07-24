
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

const HomeApp = React.lazy(() => import("mfe_home/HomeApp"));
const GarageApp = React.lazy(() => import("mfe_garage/GarageApp"));

const App = () => {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomeApp />} />
            <Route path="/garage" element={<GarageApp />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

export default App; 