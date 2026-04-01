import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/skills
router.get("/", async (_req: Request, res: Response) => {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  res.json(skills);
});

// POST /api/skills
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { name, iconUrl, category, proficiency, order } = req.body;
  const skill = await prisma.skill.create({
    data: {
      name,
      iconUrl: iconUrl || "",
      category,
      proficiency: proficiency || "Intermediate",
      order: order ?? 0,
    },
  });
  res.status(201).json(skill);
});

// PUT /api/skills/:id
router.put("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { name, iconUrl, category, proficiency, order } = req.body;

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Skill not found" });
    return;
  }

  const skill = await prisma.skill.update({
    where: { id },
    data: {
      name: name ?? undefined,
      iconUrl: iconUrl ?? undefined,
      category: category ?? undefined,
      proficiency: proficiency ?? undefined,
      order: order ?? undefined,
    },
  });
  res.json(skill);
});

// DELETE /api/skills/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Skill not found" });
    return;
  }

  await prisma.skill.delete({ where: { id } });
  res.json({ message: "Skill deleted" });
});

export default router;
