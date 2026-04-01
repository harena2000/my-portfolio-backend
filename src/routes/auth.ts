import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true },
    });

    if (!admin) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(admin);
  } catch (error) {
    console.error("Auth me error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

// POST /api/auth/setup — Create or reset the admin account
// Uses ADMIN_EMAIL and ADMIN_PASSWORD from env, or request body
router.post("/setup", async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.body.email || process.env.ADMIN_EMAIL || "admin@admin.com";
    const password = req.body.password || process.env.ADMIN_PASSWORD || "admin123";
    const name = req.body.name || "Admin";

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.admin.upsert({
      where: { email },
      update: { password: hashedPassword, name },
      create: { email, password: hashedPassword, name },
    });

    res.json({
      message: "Admin account created/reset successfully",
      user: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

export default router;
