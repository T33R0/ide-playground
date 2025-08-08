"use strict";
// Shared configuration for all MFEs
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Default configuration values
var defaultEndpoints = {
    vehicles: '/vehicles',
    maintenanceLogs: '/maintenance_logs',
    buildPlanParts: '/build_plan_parts',
    users: '/users'
};
var defaultConfig = {
    api: {
        baseUrl: 'http://localhost:8001',
        endpoints: defaultEndpoints,
        timeout: 10000 // 10 seconds
    },
    features: {
        enableAnalytics: false,
        enableErrorReporting: false
    }
};
// Get environment variables in a cross-platform way
var getEnvVar = function (name) {
    // @ts-ignore - Vite provides import.meta.env
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        return import.meta.env["VITE_".concat(name)] || import.meta.env["REACT_APP_".concat(name)];
    }
    // Fallback for other environments (Node.js/webpack)
    // Check if process exists before accessing it
    if (typeof process !== 'undefined' && process.env) {
        return process.env["VITE_".concat(name)] || process.env["REACT_APP_".concat(name)];
    }
    // Browser fallback - return undefined if no environment variables are available
    return undefined;
};
// Build the configuration
var buildConfig = function () {
    var apiUrl = getEnvVar('API_URL') || defaultConfig.api.baseUrl;
    return {
        api: __assign(__assign({}, defaultConfig.api), { baseUrl: apiUrl, getUrl: function (endpoint) {
                var path = defaultConfig.api.endpoints[endpoint] || '';
                return "".concat(apiUrl).concat(path);
            } }),
        features: __assign(__assign({}, defaultConfig.features), { enableAnalytics: getEnvVar('ENABLE_ANALYTICS') === 'true', enableErrorReporting: getEnvVar('ENABLE_ERROR_REPORTING') === 'true' })
    };
};
// Export the config
var config = buildConfig();
exports.default = config;
