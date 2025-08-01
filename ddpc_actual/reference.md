# Project Architecture Reference

This document provides a high-level overview of the major architectural files in this project. It is intended to help developers understand the project's flow and function.

---

### `host/src/App.tsx`

**Description:**
This is the main application container, responsible for orchestrating the different micro-frontends. It handles the overall layout, routing, and lazy-loading of each micro-frontend.

**Connections:**
-   `host/src/components/Navigation.tsx`: Renders the main navigation bar.
-   `packages/mfe-home/src/App.tsx`: The "Home" micro-frontend, lazy-loaded on the `/` route.
-   `packages/mfe-garage/src/App.tsx`: The "Garage" micro-frontend, lazy-loaded on the `/garage` route.
-   `packages/mfe-build-plans/src/App.tsx`: The "Build Plans" micro-frontend, lazy-loaded on the `/build-plans` route.
-   `packages/mfe-dashboard/src/App.tsx`: The "Dashboard" micro-frontend, lazy-loaded on the `/dashboard` route.
-   `shared-ui`: Imports shared UI components like `Toaster`, `TooltipProvider`, etc.

---

### `packages/mfe-home/src/App.tsx`

**Description:**
This is the entry point for the "Home" micro-frontend. It renders the landing page content, including a hero section, feature highlights, and calls to action.

**Connections:**
-   `shared_ui/button`: Uses the shared Button component.
-   `react-router-dom`: Uses `<Link>` to navigate to other micro-frontends.
-   `lucide-react`: Imports icons.
-   Connects to `/garage` and `/dashboard` routes.

---

### `packages/mfe-garage/src/App.tsx`

**Description:**
This micro-frontend displays a user's collection of vehicles and their build status. It shows information like vehicle name, make, model, year, status, and build progress.

**Connections:**
-   `shared_ui/card`, `shared_ui/button`, `shared_ui/badge`: Uses shared UI components.
-   `react-router-dom`: Could potentially link to build plans or vehicle details.
-   `lucide-react`: Imports icons.

---

### `packages/mfe-build-plans/src/App.tsx`

**Description:**
This micro-frontend allows users to create and manage detailed build plans for their vehicles. It includes task management with priorities, cost estimates, and time tracking.

**Connections:**
-   `shared_ui/card`, `shared_ui/button`, `shared_ui/badge`, `shared_ui/progress`, `shared_ui/checkbox`: Uses a variety of shared UI components.
-   `lucide-react`: Imports icons.

---

### `packages/mfe-dashboard/src/App.tsx`

**Description:**
This micro-frontend provides a high-level overview of the user's garage. It displays key statistics, recent activities, and the progress of current builds.

**Connections:**
-   `shared_ui/card`, `shared_ui/progress`, `shared_ui/badge`: Uses shared UI components.
-   `lucide-react`: Imports icons.

---

### `packages/shared-ui`

**Description:**
This package contains a library of reusable React components that are shared across all micro-frontends. This ensures a consistent look and feel throughout the application. The components are built using `tailwindcss` for styling.

**Important Components:**
-   `button.tsx`: A standard button component with various styles.
-   `card.tsx`: A flexible content container.
-   `input.tsx`: A standard text input field.
-   `toaster.tsx`: A component for displaying toast notifications.
-   `dialog.tsx`: A modal dialog component.
-   `table.tsx`: A component for displaying data in a table.
-   ...and many more, covering most common UI needs.
