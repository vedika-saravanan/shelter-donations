import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Exported Vite configuration.
 * 
 * @returns {import('vite').UserConfig} The Vite configuration object.
 */
export default defineConfig({
  plugins: [react()], // Enables React Fast Refresh and JSX transformation
  server: {
    port: 5173 // Local development port for the frontend
  }
});
