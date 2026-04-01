import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/home
router.get("/", async (_req: Request, res: Response) => {
  try {
    let home = await prisma.home.findUnique({ where: { id: "singleton" } });

    if (!home) {
      home = await prisma.home.create({
        data: { id: "singleton", fullName: "", tagline: "", bio: "" },
      });
    }

    res.json({
      fullName: home.fullName,
      tagline: home.tagline,
      bio: home.bio,
      avatarUrl: home.avatarUrl,
      socialLinks: {
        github: home.github,
        linkedin: home.linkedin,
        twitter: home.twitter,
        email: home.email,
      },
    });
  } catch (error) {
    console.error("Home GET error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

// PUT /api/home
router.put("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { fullName, tagline, bio, avatarUrl, socialLinks } = req.body;

    const home = await prisma.home.upsert({
      where: { id: "singleton" },
      update: {
        fullName: fullName ?? undefined,
        tagline: tagline ?? undefined,
        bio: bio ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        github: socialLinks?.github ?? undefined,
        linkedin: socialLinks?.linkedin ?? undefined,
        twitter: socialLinks?.twitter ?? undefined,
        email: socialLinks?.email ?? undefined,
      },
      create: {
        id: "singleton",
        fullName: fullName || "",
        tagline: tagline || "",
        bio: bio || "",
        avatarUrl: avatarUrl || "",
        github: socialLinks?.github || "",
        linkedin: socialLinks?.linkedin || "",
        twitter: socialLinks?.twitter || "",
        email: socialLinks?.email || "",
      },
    });

    res.json({
      fullName: home.fullName,
      tagline: home.tagline,
      bio: home.bio,
      avatarUrl: home.avatarUrl,
      socialLinks: {
        github: home.github,
        linkedin: home.linkedin,
        twitter: home.twitter,
        email: home.email,
      },
    });
  } catch (error) {
    console.error("Home PUT error:", error);
    res.status(500).json({ message: "Internal server error", error: String(error) });
  }
});

export default router;
