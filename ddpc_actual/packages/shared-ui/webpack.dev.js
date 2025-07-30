const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const { ModuleFederationPlugin } = require("webpack").container;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const devConfig = {
  mode: "development",
  devServer: {
    port: 3004,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "http://localhost:3004/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shared_ui",
      filename: "remoteEntry.js",
      exposes: {
        "./accordion": "./src/components/ui/accordion.tsx",
        "./alert": "./src/components/ui/alert.tsx",
        "./alert-dialog": "./src/components/ui/alert-dialog.tsx",
        "./aspect-ratio": "./src/components/ui/aspect-ratio.tsx",
        "./avatar": "./src/components/ui/avatar.tsx",
        "./badge": "./src/components/ui/badge.tsx",
        "./breadcrumb": "./src/components/ui/breadcrumb.tsx",
        "./button": "./src/components/ui/button.tsx",
        "./calendar": "./src/components/ui/calendar.tsx",
        "./card": "./src/components/ui/card.tsx",
        "./carousel": "./src/components/ui/carousel.tsx",
        "./chart": "./src/components/ui/chart.tsx",
        "./checkbox": "./src/components/ui/checkbox.tsx",
        "./collapsible": "./src/components/ui/collapsible.tsx",
        "./command": "./src/components/ui/command.tsx",
        "./context-menu": "./src/components/ui/context-menu.tsx",
        "./dialog": "./src/components/ui/dialog.tsx",
        "./drawer": "./src/components/ui/drawer.tsx",
        "./dropdown-menu": "./src/components/ui/dropdown-menu.tsx",
        "./form": "./src/components/ui/form.tsx",
        "./hover-card": "./src/components/ui/hover-card.tsx",
        "./input-otp": "./src/components/ui/input-otp.tsx",
        "./input": "./src/components/ui/input.tsx",
        "./label": "./src/components/ui/label.tsx",
        "./menubar": "./src/components/ui/menubar.tsx",
        "./navigation-menu": "./src/components/ui/navigation-menu.tsx",
        "./pagination": "./src/components/ui/pagination.tsx",
        "./popover": "./src/components/ui/popover.tsx",
        "./progress": "./src/components/ui/progress.tsx",
        "./radio-group": "./src/components/ui/radio-group.tsx",
        "./resizable": "./src/components/ui/resizable.tsx",
        "./scroll-area": "./src/components/ui/scroll-area.tsx",
        "./select": "./src/components/ui/select.tsx",
        "./separator": "./src/components/ui/separator.tsx",
        "./sheet": "./src/components/ui/sheet.tsx",
        "./skeleton": "./src/components/ui/skeleton.tsx",
        "./slider": "./src/components/ui/slider.tsx",
        "./sonner": "./src/components/ui/sonner.tsx",
        "./switch": "./src/components/ui/switch.tsx",
        "./table": "./src/components/ui/table.tsx",
        "./tabs": "./src/components/ui/tabs.tsx",
        "./textarea": "./src/components/ui/textarea.tsx",
        "./toast": "./src/components/ui/toast.tsx",
        "./toaster": "./src/components/ui/toaster.tsx",
        "./toggle-group": "./src/components/ui/toggle-group.tsx",
        "./toggle": "./src/components/ui/toggle.tsx",
        "./tooltip": "./src/components/ui/tooltip.tsx",
        "./use-toast": "./src/components/ui/use-toast.ts",
        "./utils": "./src/lib/utils.ts",
        "./index.css": "./src/index.css",
      },
      shared: {
        ...deps,
        react: { singleton: true, requiredVersion: deps.react },
        "react-dom": { singleton: true, requiredVersion: deps["react-dom"] },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

module.exports = merge(commonConfig, devConfig); 