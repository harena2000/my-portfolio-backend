import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { swaggerSpec } from "./swagger";

dotenv.config();

import authRoutes from "./routes/auth";
import homeRoutes from "./routes/home";
import skillsRoutes from "./routes/skills";
import projectsRoutes from "./routes/projects";
import experienceRoutes from "./routes/experience";
import contactRoutes from "./routes/contact";
import resumeRoutes from "./routes/resume";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Swagger docs
app.get("/api/docs.json", (_req, res) => {
  res.json(swaggerSpec);
});
app.get("/api/docs", (_req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Portfolio API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({ url: "/api/docs.json", dom_id: "#swagger-ui" });
  </script>
</body>
</html>`);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
