# Project Structure

This document outlines the file and directory structure of the project, providing a visual guide to how the codebase is organized.

## Root Directory

The project is structured as a monorepo, with a `host` application and several `packages`.

```
/
├── host/
├── packages/
├── media/
├── package.json
└── ... (other configuration files)
```

---

## `host` Directory

The `host` directory contains the main application shell that orchestrates all the micro-frontends.

```
host/
├── public/              # Static assets (e.g., index.html)
├── src/
│   ├── App.tsx          # Main app component, handles routing and lazy-loading MFEs
│   ├── components/      # Components specific to the host (e.g., Navigation)
│   └── bootstrap.tsx    # Mounts the React application
├── package.json
└── webpack.*.js         # Webpack configs for the host
```

---

## `packages` Directory

This directory contains all the micro-frontends (MFEs) and shared libraries.

```
packages/
├── mfe-build-plans/
├── mfe-dashboard/
├── mfe-garage/
├── mfe-home/
├── mfe-template/
└── shared-ui/
```

### Micro-frontend (`mfe-*`) Structure

Each micro-frontend (e.g., `mfe-home`, `mfe-garage`) follows a standardized structure:

```
mfe-*/
├── public/
├── src/
│   ├── App.tsx      # Entry component for the MFE
│   └── components/  # Components specific to this MFE
├── package.json
└── webpack.*.js     # Webpack configs for the MFE
```

### `shared-ui` Package

This package contains the shared component library used across all micro-frontends.

```
shared-ui/
└── src/
    ├── components/
    │   └── ui/      # Individual, reusable UI components (Button, Card, etc.)
    └── lib/         # Utility functions (e.g., cn for classnames)
```
