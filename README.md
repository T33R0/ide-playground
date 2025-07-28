MFE App Factory v2.0
1. Project Overview
This repository is a production-ready Micro-Frontend (MFE) Application Factory built on React 18, TypeScript, and Webpack 5 with Module Federation. It is structured as an NPM Workspace monorepo, providing a scalable and maintainable foundation for building complex, single-page applications that can be deployed and integrated into any host environment, such as WordPress.

The factory provides a "white label" chassis for rapid development, with a stable local development workflow, a one-command production build process, and a clear deployment pipeline.

2. System Architecture
The architecture consists of a central host application and multiple remote micro-frontend applications (packages).

host (The Shell):

The main application container.

Responsible for the primary layout (header, footer), routing, and core navigation.

Loads and displays the remote MFE packages.

Exposes shared utilities, like an eventBus, for cross-application communication.

packages/* (The Features):

Each folder within the packages directory is an independent React application (an MFE).

Examples: mfe-home, mfe-garage, shared-ui.

Each MFE exposes one or more components that the host can dynamically import and render.

They can consume shared utilities from the host or other MFEs.

This structure allows for independent development, testing, and deployment of features, making the system highly scalable and resilient.

3. First-Time Setup & Environment Recovery
This procedure is for cloning the repository on a new machine or for recovering a corrupted local environment. It guarantees a clean, stable state.

Execute all commands from the root directory of the project (/ddpc_actual).

1. Clean the Workspace:
Run the clean script. This will delete all node_modules folders, dist folders, and package-lock.json files from the entire project.

npm run clean

(Note: If rm is not recognized on Windows, you may need to manually delete the specified folders.)

2. Install All Dependencies:
Run the master installation command. NPM will read the workspaces configuration in the root package.json and install all dependencies for the host and all packages correctly.

npm install

The environment is now stable and ready for development.

4. Local Development Workflow
The entire MFE ecosystem can be launched with a single command.

1. Start All Services:
From the root directory, run the start command.

npm start

This command uses npm-run-all to execute the individual start scripts for the host and every MFE package in parallel.

2. Access the Application:

The host application will be available at http://localhost:8080.

The individual MFEs will be running on their own ports (e.g., mfe-home on 3002, mfe-garage on 3003), but you should always develop against the host application.

5. Production Build Process
The entire application can be compiled for production with a single command.

1. Generate Production Artifacts:
From the root directory, run the build command.

npm run build

This command uses the NPM Workspaces build script to execute the build command in the host and every MFE package.

2. Verify the Output:
After the build completes, you will find a dist folder inside the host directory and inside each MFE package directory. These folders contain the optimized, static JavaScript and CSS files ready for deployment.

6. Production Deployment: SiteGround & WordPress
This is the end-to-end process for deploying the built application to a live server.

Step 1: Deploy Static Assets to a Subdomain

The built dist files will be hosted on a dedicated subdomain (e.g., app.myddpc.com), which acts as a CDN.

Navigate to Subdomain Root: In the SiteGround File Manager, go to the document root for your application subdomain (e.g., app.myddpc.com/public_html/). Delete any old files.

Upload Host Files: Upload the contents of your local host/dist folder directly into the subdomain's root directory.

Upload MFE Files:

Create a folder on the server for each MFE (e.g., mfe-home, mfe-garage).

Upload the contents of each local MFE's dist folder into its corresponding server folder.

Configure CORS: Ensure a .htaccess file exists in the subdomain's root and contains the following rule to allow your main WordPress site to fetch the scripts:

<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "https://www.myddpc.com"
</IfModule>

Step 2: Create a Custom WordPress Plugin

This plugin will define the shortcode used to embed the application.

Create Plugin Folder: In your main site's File Manager, navigate to myddpc.com/public_html/wp-content/plugins/ and create a new folder (e.g., myddpc-mfe-loader).

Create Plugin File: Inside the new folder, create a PHP file (e.g., myddpc-mfe-loader.php).

Add Plugin Code: Paste the following code into the PHP file. You must update the $host_script_filename variable to match the hashed filename of the main JavaScript file from your host/dist folder.

<?php
/**
 * Plugin Name:       MyDDPC MFE Loader
 * Description:       Loads the Micro-Frontend application via a shortcode.
 * Version:           1.0
 * Author:            Rory Teehan
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

function mfe_factory_app_shortcode() {
    // IMPORTANT: Update this filename to match the one in your host/dist folder!
    $host_script_filename = 'main.xxxxxxxxxxxxxxxx.js'; // e.g., main.50ab6d8d80881c311cf5.js

    $host_script_url = 'https://app.myddpc.com/' . $host_script_filename;
    $app_container_id = 'ddpc-mfe-factory-root';

    $html = '<div id="' . esc_attr($app_container_id) . '">';
    $html .= '<!-- React App Will Load Here -->';
    $html .= '</div>';
    $html .= '<script src="' . esc_url($host_script_url) . '" async defer></script>';

    return $html;
}
add_shortcode('mfe_factory_app', 'mfe_factory_app_shortcode');

Activate Plugin: In your WordPress dashboard, go to Plugins, find "MyDDPC MFE Loader," and click Activate.

Step 3: Create a Full-Width Page Template

This removes the theme's header and footer for a seamless app experience.

Create Template File: In your active theme's folder (wp-content/themes/your-theme-name/), create a new file named template-mfe-factory.php.

Add Template Code: Paste the following code into the file.

<?php
/**
 * Template Name: MFE Factory App Host
 * Template Post Type: page
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<main>
    <?php
    while ( have_posts() ) :
        the_post();
        the_content();
    endwhile;
    ?>
</main>
<?php wp_footer(); ?>
</body>
</html>

Apply Template: Edit the target page in WordPress (e.g., "app-factory"), and under Page Attributes -> Template, select "MFE Factory App Host."

Step 4: Add Final CSS

This CSS hides any residual theme elements and handles the WordPress admin bar for logged-in users.

In the WordPress dashboard, go to Appearance -> Customize -> Additional CSS.

Add the following CSS:

/* Target the page using our custom template */
body.page-template-template-mfe-factory {
    /* Hide theme header/footer if they still appear */
    #masthead, #colophon {
        display: none !important;
    }
}

/* Ensure the app container fills the viewport */
#ddpc-mfe-factory-root {
    min-height: 100vh;
}

/* Adjust height for logged-in users to account for the admin bar */
.logged-in #ddpc-mfe-factory-root {
    min-height: calc(100vh - 32px);
}

Publish the changes.

Step 5: Final Verification
Clear all server and browser caches, then navigate to the WordPress page containing the [mfe_factory_app] shortcode. The application should now load full-screen without errors.
