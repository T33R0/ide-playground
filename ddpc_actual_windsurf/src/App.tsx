import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load the remote MFE component
const MfeTemplateApp = lazy(() => import('mfe_template/MfeTemplateApp'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-600">Loading MFE Template...</span>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">
          Failed to load MFE Template. {error.message}
        </p>
        <div className="mt-2">
          <button
            onClick={resetErrorBoundary}
            className="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:underline transition duration-150 ease-in-out"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to MyDDPC</h1>
                  <p className="text-gray-600 mb-6">
                    Your personal dashboard for managing your digital presence and content.
                  </p>
                </div>

                {/* MFE Template Integration */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">MFE Template</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      This is a remote Micro Frontend loaded dynamically
                    </p>
                  </div>
                  <div className="p-6">
                    <ErrorBoundary 
                      fallback={({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
                        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
                      )}
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <MfeTemplateApp />
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            } 
          />
          
          {/* Example route for a specific MFE */}
          <Route
            path="/mfe-template"
            element={
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">MFE Template</h2>
                <ErrorBoundary 
                  fallback={({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
                    <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
                  )}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    <MfeTemplateApp />
                  </Suspense>
                </ErrorBoundary>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
