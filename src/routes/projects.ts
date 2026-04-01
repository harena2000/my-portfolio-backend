import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/projects
router.get("/", async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
    });
    res.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

// POST /api/projects
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      title, shortDescription, fullDescription, techStack,
      thumbnailUrl, liveDemoUrl, githubUrl, featured, displayOrder,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        shortDescription: shortDescription || "",
        fullDescription: fullDescription || "",
        techStack: techStack || [],
        thumbnailUrl: thumbnailUrl || "",
        liveDemoUrl: liveDemoUrl || "",
        githubUrl: githubUrl || "",
        featured: featured ?? false,
        displayOrder: displayOrder ?? 0,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error("Projects POST error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

// PUT /api/projects/:id
router.put("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: req.body.title ?? undefined,
        shortDescription: req.body.shortDescription ?? undefined,
        fullDescription: req.body.fullDescription ?? undefined,
        techStack: req.body.techStack ?? undefined,
        thumbnailUrl: req.body.thumbnailUrl ?? undefined,
        liveDemoUrl: req.body.liveDemoUrl ?? undefined,
        githubUrl: req.body.githubUrl ?? undefined,
        featured: req.body.featured ?? undefined,
        displayOrder: req.body.displayOrder ?? undefined,
      },
    });
    res.json(project);
  } catch (error) {
    console.error("Projects PUT error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    await prisma.project.delete({ where: { id } });
    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Projects DELETE error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

export default router;
