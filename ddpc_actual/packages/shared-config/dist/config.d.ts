export interface ApiEndpoints {
    vehicles: string;
    maintenanceLogs: string;
    buildPlanParts: string;
    users: string;
    [key: string]: string;
}
export interface ApiConfig {
    baseUrl: string;
    endpoints: ApiEndpoints;
    timeout: number;
    getUrl: (endpoint: keyof ApiEndpoints) => string;
}
export interface FeaturesConfig {
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
}
export interface AppConfig {
    api: ApiConfig;
    features: FeaturesConfig;
}
declare const config: AppConfig;
export default config;
