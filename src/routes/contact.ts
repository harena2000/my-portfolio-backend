import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/contact
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const { status } = req.query;

  const where = status && typeof status === "string" ? { status } : {};

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { dateReceived: "desc" },
  });

  res.json(messages);
});

// POST /api/contact (public — for the portfolio contact form)
router.post("/", async (req: Request, res: Response) => {
  const { senderName, senderEmail, message } = req.body;

  if (!senderName || !senderEmail || !message) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const msg = await prisma.contactMessage.create({
    data: { senderName, senderEmail, message },
  });

  res.status(201).json(msg);
});

// PUT /api/contact/:id
router.put("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Message not found" });
    return;
  }

  if (!["Unread", "Read", "Archived"].includes(status)) {
    res.status(400).json({ message: "Invalid status" });
    return;
  }

  const msg = await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
  res.json(msg);
});

// DELETE /api/contact/:id
router.delete("/:id", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ message: "Message not found" });
    return;
  }

  await prisma.contactMessage.delete({ where: { id } });
  res.json({ message: "Message deleted" });
});

export default router;
