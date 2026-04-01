import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/experience
router.get("/", async (_req: Request, res: Response) => {
  const entries = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  res.json(
    entries.map((e) => ({
      id: e.id,
      type: e.type,
      companyOrSchool: e.companyOrSchool,
      roleOrDegree: e.roleOrDegree,
      location: e.location,
      startDate: e.startDate.toISOString().split("T")[0],
      endDate: e.endDate ? e.endDate.toISOString().split("T")[0] : null,
      isPresent: e.isPresent,
      description: e.description,
      logoUrl: e.logoUrl,
    }))
  );
});

// POST /api/experience
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const {
    type,
    companyOrSchool,
    roleOrDegree,
    location,
    startDate,
    endDate,
    isPresent,
    description,
    logoUrl,
  } = req.body;

  const entry = await prisma.experience.create({
    data: {
      type,
      companyOrSchool,
      roleOrDegree,
      location: location || "",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      isPresent: isPresent ?? false,
      description: description || "",
      logoUrl: logoUrl || "",
    },
  });

  res.status(201).json({
    ...entry,
    startDate: entry.startDate.toISOString().split("T")[0],
    endDate: entry.endDate ? entry.endDate.toISOString().split("T")[0] : null,
  });
});

// PUT /api/experience/:id
router.put("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Entry not found" });
    return;
  }

  const data: Record<string, unknown> = {};
  if (req.body.type !== undefined) data.type = req.body.type;
  if (req.body.companyOrSchool !== undefined) data.companyOrSchool = req.body.companyOrSchool;
  if (req.body.roleOrDegree !== undefined) data.roleOrDegree = req.body.roleOrDegree;
  if (req.body.location !== undefined) data.location = req.body.location;
  if (req.body.startDate !== undefined) data.startDate = new Date(req.body.startDate);
  if (req.body.endDate !== undefined) data.endDate = req.body.endDate ? new Date(req.body.endDate) : null;
  if (req.body.isPresent !== undefined) data.isPresent = req.body.isPresent;
  if (req.body.description !== undefined) data.description = req.body.description;
  if (req.body.logoUrl !== undefined) data.logoUrl = req.body.logoUrl;

  const entry = await prisma.experience.update({ where: { id }, data });

  res.json({
    ...entry,
    startDate: entry.startDate.toISOString().split("T")[0],
    endDate: entry.endDate ? entry.endDate.toISOString().split("T")[0] : null,
  });
});

// DELETE /api/experience/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Entry not found" });
    return;
  }

  await prisma.experience.delete({ where: { id } });
  res.json({ message: "Entry deleted" });
});

export default router;
