import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/project-work-management/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
