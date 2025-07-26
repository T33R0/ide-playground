# MyDDPC MFE Factory (`ddpc_actual`) - v1.0

This repository contains a fully-configured boilerplate for building scalable web applications using a Micro-Frontend (MFE) architecture. It serves as a "white label" factory to quickly spin up new, independent features that integrate into a cohesive, single-page application.

## Core Architecture

This project uses a **Host/Remote** pattern powered by Webpack 5's Module Federation. The architecture is designed for independent development and deployment of features.

The system is composed of the following independent applications:

* **`host` (Root Directory)**: The main application shell. It is responsible for the primary layout (header, footer), top-level routing, and dynamically loading the appropriate Micro-Frontend.
* **`packages/mfe-home`**: A remote application serving as the "Home" page feature.
* **`packages/mfe-garage`**: A remote application serving as the "Garage" feature.
* **`packages/shared-ui`**: A remote application that acts as a shared component library, exporting common UI elements.
* **`packages/mfe-template`**: A non-runtime blueprint. This package is not part of the running application but serves as a clean template to be duplicated when creating new MFEs.

## Features & Architectural Concepts

* **Dynamic Federation**: The Host application dynamically loads MFE components at runtime as the user navigates, enabling code-splitting by feature.
* **Shared Component Library**: The `shared-ui` package allows for the creation of a consistent design system. Other MFEs (like `mfe-home`) can consume these shared components.
* **Global Event Bus**: The `host` exposes a global event bus, allowing for decoupled, event-driven communication between MFEs (e.g., `mfe-garage` dispatches an event that the `host` listens for).
* **Centralized Theming**: A root `tailwind-theme.js` file provides a single source of truth for design tokens (colors, fonts, etc.), ensuring brand consistency across all applications.
* **Environment-Managed Ports**: All port configurations are managed via `cross-env` in the `package.json` scripts, making the factory easily duplicatable without port conflicts.

## Tech Stack

* **Framework**: React
* **Language**: TypeScript
* **MFE Technology**: Webpack 5 with Module Federation
* **Styling**: Tailwind CSS
* **Routing**: React Router
* **Environment Variables**: cross-env

## Setup and Installation

1.  **Prerequisites**: Ensure you have Node.js and npm installed.
2.  **Install Host Dependencies**: In the root directory, run:
    ```bash
    npm install
    ```
3.  **Install Package Dependencies**: Run `npm install` inside each of the individual package directories:
    ```bash
    cd packages/mfe-home && npm install
    cd ../mfe-garage && npm install
    cd ../shared-ui && npm install
    cd ../mfe-template && npm install
    ```

## Running the Development Environment

The architecture requires that the **four primary services run simultaneously**. The `mfe-template` is not required for the application to run.

1.  **Open four separate terminals.**
2.  Run the following commands, one in each terminal:

    * **Terminal 1 (Host):**
        ```bash
        npm start
        ```
    * **Terminal 2 (Home MFE):**
        ```bash
        cd packages/mfe-home && npm start
        ```
    * **Terminal 3 (Garage MFE):**
        ```bash
        cd packages/mfe-garage && npm start
        ```
    * **Terminal 4 (Shared UI):**
        ```bash
        cd packages/shared-ui && npm start
        ```
3.  Wait for all terminals to report **"compiled successfully"**.
4.  Access the application by navigating to the Host URL: **`http://localhost:8080`**

## Project Duplication & Self-Containment

This project folder is **fully self-contained** and ready for duplication. You can copy this entire directory to create a new MFE application (e.g., `ddsr_actual`).

### Managing Ports for Duplicated Projects

The port for each service is now managed in the `"start"` script of its `package.json` file using `cross-env`. This makes it easy to resolve port conflicts when running multiple projects.

* **host**: 8080
* **mfe-home**: 3001
* **mfe-garage**: 3002
* **shared-ui**: 3003

If you duplicate this project, simply edit the port numbers in the `package.json` `start` scripts of the new project to avoid conflicts with the original.