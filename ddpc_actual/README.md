# DDPC Monorepo

This repository is a production-ready Micro-Frontend (MFE) application built on React 18, TypeScript, and Webpack 5 with Module Federation. It is structured as a monorepo, providing a scalable and maintainable foundation for building complex, single-page applications.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)

### First-Time Setup

This procedure is for cloning the repository on a new machine or for recovering a corrupted local environment.

1.  **Clean the Workspace:**
    This script removes all `node_modules` folders, `dist` folders, and `package-lock.json` files.
    ```bash
    npm run clean
    ```

2.  **Install All Dependencies:**
    This command reads the `workspaces` configuration in the root `package.json` and installs all dependencies for the host and all packages.
    ```bash
    npm install
    ```

### Local Development

To run the entire MFE ecosystem for local development, use a single command from the project root:

```bash
npm start
```

The host application will be available at `http://localhost:8080`.

---

## Project Documentation

For a detailed understanding of the project's architecture and file structure, please refer to the following documents:

-   **[Project Structure (`structure.md`)]** - A visual guide to the file and directory layout of the monorepo.
-   **[Architecture Reference (`reference.md`)]** - A detailed description of each major architectural file and its connections.

---

## Where to Make Changes

This section provides guidance on which files or directories to modify for common development tasks.

### Global Visual & Layout Changes

To make changes that affect the entire application's look and feel, such as updating the color palette, fonts, or primary layout, you should look in these locations:

-   **Global Styles & Theme:** `packages/shared-ui/src/index.css`
-   **Main Application Layout:** `host/src/App.tsx` (for the overall page structure)
-   **Navigation Bar:** `host/src/components/Navigation.tsx`

### Adding or Modifying a Feature (Micro-Frontend)

If you want to add a new feature or modify an existing one, you will likely be working within a specific micro-frontend package.

-   **Home Page:** `packages/mfe-home/`
-   **Garage Page:** `packages/mfe-garage/`
-   **Build Plans Page:** `packages/mfe-build-plans/`
-   **Dashboard Page:** `packages/mfe-dashboard/`

Each of these directories contains a full React application. The main entry point is typically `src/App.tsx`.

### Shared Components & Functions

To create or modify a component or utility function that can be used by multiple micro-frontends, work in the `shared-ui` package:

-   **Shared UI Components:** `packages/shared-ui/src/components/ui/`
-   **Shared Hooks & Utilities:** `packages/shared-ui/src/lib/`

### API & Data Fetching Logic

API interactions and data fetching logic are generally co-located with the micro-frontend that uses them. For example, if the "Garage" page needs to fetch a list of vehicles, that logic would reside within `packages/mfe-garage/`.

### Build & Deployment Configuration

To change how the application is built or deployed, you will need to modify the Webpack configuration files.

-   **Host Configuration:** `host/webpack.*.js`
-   **Package Configuration:** `packages/*/webpack.*.js`

---

## Production Build

To compile the entire application for production, run the following command from the root directory:

```bash
npm run build
```

This will generate a `dist` folder in the `host` directory and in each of the micro-frontend package directories, containing the optimized static assets ready for deployment.
