<?php
/**
 * ENHANCED MFE Factory App Shortcode with CORS headers and debugging
 * 
 * Add this to your WordPress functions.php file, replacing the existing shortcode
 */

function mfe_factory_app_shortcode() {
    // Enable CORS for cross-subdomain requests
    if (!headers_sent()) {
        header('Access-Control-Allow-Origin: https://app.myddpc.com');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }

    $host_script_filename = 'main.d25b4c30c67cfad7e395.js';
    $host_script_url = 'https://app.myddpc.com/' . $host_script_filename;
    $app_container_id = 'ddpc-mfe-factory-root';

    // Debug information (remove in production)
    $debug_info = '';
    if (current_user_can('administrator')) {
        $debug_info = '<div id="mfe-debug" style="background: #f0f0f0; padding: 10px; margin: 10px 0; font-family: monospace; font-size: 12px; border: 1px solid #ccc;">
            <strong>MFE Debug Info:</strong><br>
            Script URL: ' . $host_script_url . '<br>
            Container ID: ' . $app_container_id . '<br>
            Current URL: ' . home_url() . '<br>
            User Agent: ' . $_SERVER['HTTP_USER_AGENT'] . '<br>
            <button onclick="testMFEConnection()">Test Connection</button>
        </div>';
    }

    $html = $debug_info;
    $html .= '<div id="' . esc_attr($app_container_id) . '" style="width: 100%; min-height: 100vh;">';
    $html .= '<div id="mfe-loading" style="text-align: center; padding: 50px; font-size: 18px;">Loading application...</div>';
    $html .= '</div>';
    
    // Enhanced script loading with error handling
    $html .= '<script>
        console.log("MFE: Starting application load...");
        
        function testMFEConnection() {
            fetch("' . $host_script_url . '")
                .then(response => {
                    console.log("MFE: Script connectivity test:", response.status);
                    alert("Script reachable: " + response.status);
                })
                .catch(error => {
                    console.error("MFE: Script connectivity error:", error);
                    alert("Script unreachable: " + error.message);
                });
        }
        
        // Monitor for script load
        window.addEventListener("load", function() {
            setTimeout(function() {
                const container = document.getElementById("' . $app_container_id . '");
                const loading = document.getElementById("mfe-loading");
                if (container && container.children.length <= 1 && loading) {
                    loading.innerHTML = "⚠️ Application failed to load. Check console for errors.";
                    loading.style.color = "red";
                }
            }, 3000);
        });
        
        // Load script with error handling
        const script = document.createElement("script");
        script.src = "' . esc_url($host_script_url) . '";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        
        script.onload = function() {
            console.log("MFE: Script loaded successfully");
        };
        
        script.onerror = function(error) {
            console.error("MFE: Script failed to load", error);
            const container = document.getElementById("' . $app_container_id . '");
            if (container) {
                container.innerHTML = "<div style=\"text-align: center; padding: 50px; color: red;\">❌ Failed to load application. Check browser console.</div>";
            }
        };
        
        document.head.appendChild(script);
    </script>';

    return $html;
}

// Replace the existing shortcode
remove_shortcode('mfe_factory_app');
add_shortcode('mfe_factory_app', 'mfe_factory_app_shortcode');

/**
 * Add CORS headers for MFE assets
 */
function add_mfe_cors_headers() {
    if (strpos($_SERVER['REQUEST_URI'], 'mfe-factory') !== false) {
        header('Access-Control-Allow-Origin: https://app.myddpc.com');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}
add_action('init', 'add_mfe_cors_headers');
?>