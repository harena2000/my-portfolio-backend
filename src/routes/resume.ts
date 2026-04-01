import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { prisma } from "../lib/prisma";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Multer config for PDF uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// GET /api/resume
router.get("/", async (_req: Request, res: Response) => {
  let resume = await prisma.resume.findUnique({ where: { id: "singleton" } });

  if (!resume) {
    resume = await prisma.resume.create({
      data: { id: "singleton", summary: "", skills: [] },
    });
  }

  const certifications = await prisma.certification.findMany();
  const languages = await prisma.language.findMany();

  // Fetch synced work/education from Experience
  const workExperience = await prisma.experience.findMany({
    where: { type: "Work" },
    orderBy: { startDate: "desc" },
  });
  const education = await prisma.experience.findMany({
    where: { type: "Education" },
    orderBy: { startDate: "desc" },
  });

  res.json({
    pdfUrl: resume.pdfUrl,
    summary: resume.summary,
    skills: resume.skills,
    workExperience: workExperience.map((e) => ({
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
    })),
    education: education.map((e) => ({
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
    })),
    certifications,
    languages,
  });
});

// PUT /api/resume
router.put("/", authMiddleware, async (req: Request, res: Response) => {
  const { summary, skills, certifications, languages } = req.body;

  // Update resume content
  const resume = await prisma.resume.upsert({
    where: { id: "singleton" },
    update: {
      summary: summary ?? undefined,
      skills: skills ?? undefined,
    },
    create: {
      id: "singleton",
      summary: summary || "",
      skills: skills || [],
    },
  });

  // Sync certifications — delete all then re-create
  if (certifications) {
    await prisma.certification.deleteMany();
    for (const cert of certifications) {
      await prisma.certification.create({
        data: {
          name: cert.name,
          issuer: cert.issuer || "",
          date: cert.date || "",
          url: cert.url || "",
        },
      });
    }
  }

  // Sync languages — delete all then re-create
  if (languages) {
    await prisma.language.deleteMany();
    for (const lang of languages) {
      await prisma.language.create({
        data: { name: lang.name, level: lang.level || "" },
      });
    }
  }

  const allCerts = await prisma.certification.findMany();
  const allLangs = await prisma.language.findMany();

  res.json({
    pdfUrl: resume.pdfUrl,
    summary: resume.summary,
    skills: resume.skills,
    certifications: allCerts,
    languages: allLangs,
  });
});

// POST /api/resume/upload
router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    // Delete old PDF if exists
    const existing = await prisma.resume.findUnique({ where: { id: "singleton" } });
    if (existing?.pdfUrl) {
      const oldPath = path.join(process.cwd(), existing.pdfUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await prisma.resume.upsert({
      where: { id: "singleton" },
      update: { pdfUrl },
      create: { id: "singleton", pdfUrl, summary: "", skills: [] },
    });

    res.json({ pdfUrl });
  }
);

// DELETE /api/resume/pdf
router.delete("/pdf", authMiddleware, async (_req: Request, res: Response) => {
  const resume = await prisma.resume.findUnique({ where: { id: "singleton" } });

  if (resume?.pdfUrl) {
    const filePath = path.join(process.cwd(), resume.pdfUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await prisma.resume.update({
    where: { id: "singleton" },
    data: { pdfUrl: null },
  });

  res.json({ message: "PDF removed" });
});

export default router;
