import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// El frontend React usa CRUD JavaScript + localStorage según el documento 040.
// Las imágenes se sirven desde public/static/img; no hace falta iniciar Flask.
export default defineConfig({ plugins: [react()] });
