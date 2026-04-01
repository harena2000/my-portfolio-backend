import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    token,
    user: { id: admin.id, email: admin.email, name: admin.name },
  });
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true },
  });

  if (!admin) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json(admin);
});

export default router;
