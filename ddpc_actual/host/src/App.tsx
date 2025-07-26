import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { TwentyFirstToolbar } from '@21st-extension/toolbar-react';
import { ReactPlugin } from '@21st-extension/react';
import "./index.css";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import Tools from "./components/Tools";
import Profile from "./components/Profile";
import GenericPage from "./components/GenericPage";

const HomeApp = React.lazy(() => import("mfe_home/HomeApp"));
const GarageApp = React.lazy(() => import("mfe_garage/GarageApp"));

const App = () => {
  return (
    <Layout>
      {process.env.NODE_ENV === 'development' && <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} />}
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomeApp />} />
            <Route path="/garage" element={<GarageApp />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<GenericPage title="Contact Us" />} />
            <Route path="/terms" element={<GenericPage title="Terms of Service" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

export default App;