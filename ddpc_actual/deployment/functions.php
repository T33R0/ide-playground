<?php
/**
 * Registers the [mfe_factory_app] shortcode.
 *
 * This shortcode embeds the React MFE application by creating a root div
 * and loading the main JavaScript entry file.
 */
function mfe_factory_app_shortcode() {

    $host_script_filename = 'main.d25b4c30c67cfad7e395.js';
    $host_script_url = 'https://app.myddpc.com/' . $host_script_filename;
    $app_container_id = 'ddpc-mfe-factory-root';

    $html = '<div id="' . esc_attr($app_container_id) . '">';
    $html .= '<!-- React App Will Load Here -->';
    $html .= '</div>';
    $html .= '<script src="' . esc_url($host_script_url) . '" async defer></script>';

    return $html;
}
add_shortcode('mfe_factory_app', 'mfe_factory_app_shortcode');
