# MyDDPC MFE Factory (`ddpc_actual`)

This repository contains a boilerplate project for building scalable web applications using a Micro-Frontend (MFE) architecture. It serves as a "factory" to quickly spin up new, independent features that integrate into a cohesive whole.

## Core Architecture

This project uses a **Host/Remote** pattern powered by Webpack 5's Module Federation.

The system is composed of the following independent applications:

* **`host` (Root Directory)**: The main application shell. It is responsible for rendering the primary layout (header, footer), handling top-level routing, and dynamically loading the appropriate Micro-Frontend.
* **`packages/mfe-home`**: A remote application that serves as the "Home" page.
* **`packages/mfe-garage`**: A remote application that serves as the "Garage" page.
* **`packages/shared-ui`**: A special remote application that acts as a shared component library, exporting common UI elements like buttons to ensure design consistency.

## Tech Stack

* **Framework**: React
* **Language**: TypeScript
* **MFE Technology**: Webpack 5 with Module Federation
* **Styling**: Tailwind CSS
* **Routing**: React Router

## Setup and Installation

To get the project running locally, you must install the dependencies for the host application AND for each individual package.

1.  **Prerequisites**: Ensure you have Node.js and npm installed on your system.
2.  **Install Host Dependencies**: In the root directory (`/ddpc_actual_cursor`), run the following command:
    ```bash
    npm install
    ```
3.  **Install Package Dependencies**: You must also install the dependencies for each application inside the `/packages` directory. Navigate into each folder and run `npm install`:
    ```bash
    cd packages/mfe-home
    npm install

    cd ../mfe-garage
    npm install

    cd ../shared-ui
    npm install
    ```

## Running the Development Environment

The Micro-Frontend architecture requires that **all services run simultaneously** in their own terminal sessions.

1.  **Open four separate terminals.**
2.  Navigate to the project's root directory in each terminal.
3.  Run the following commands, one in each terminal:

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
4.  Wait for all four terminals to report **"compiled successfully"**.
5.  Access the application by navigating to the Host URL in your browser: **`http://localhost:8080`**

## Project Duplication & Self-Containment

This project folder is **fully self-contained**. It includes all the source code and configuration required to run the application. You can copy this entire directory to create a new, clean version of the MFE factory for other projects (e.g., `ddsr_actual`).

### Important Note on Port Usage

The port numbers for each service are currently **hardcoded** in their respective `webpack.config.js` files:

* **host**: 8080
* **mfe-home**: 3001
* **mfe-garage**: 3002
* **shared-ui**: 3003

This means you can only run **one instance** of this MFE factory at a time. If you duplicate this project and try to run the original and the copy simultaneously, you will encounter port collision errors. For a more advanced setup that allows parallel project development, these hardcoded ports should be replaced with environment variables.