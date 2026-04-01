import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@admin.com" },
    update: { password: hashedPassword },
    create: {
      email: process.env.ADMIN_EMAIL || "admin@admin.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  // Seed Home singleton
  await prisma.home.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      fullName: "Harena Rico",
      tagline: "Full-stack Mobile & Web Developer",
      bio: "Passionate developer specializing in Flutter, Next.js, TypeScript, and GIS solutions.",
      avatarUrl: "",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "hello@example.com",
    },
  });

  // Seed Resume singleton
  await prisma.resume.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      summary:
        "Passionate full-stack developer with experience in web and mobile development.",
      skills: ["React", "Next.js", "TypeScript", "Node.js", "Flutter", "Docker"],
    },
  });

  // Seed skills
  const skills = [
    { name: "React", iconUrl: "react", category: "Frontend", proficiency: "Expert", order: 0 },
    { name: "Next.js", iconUrl: "nextjs", category: "Frontend", proficiency: "Expert", order: 1 },
    { name: "TypeScript", iconUrl: "typescript", category: "Frontend", proficiency: "Expert", order: 2 },
    { name: "Node.js", iconUrl: "nodejs", category: "Backend", proficiency: "Intermediate", order: 0 },
    { name: "Docker", iconUrl: "docker", category: "DevOps", proficiency: "Intermediate", order: 0 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!existing) {
      await prisma.skill.create({ data: skill });
    }
  }

  // Seed languages
  const languages = [
    { name: "French", level: "Native" },
    { name: "English", level: "Fluent" },
  ];
  for (const lang of languages) {
    const existing = await prisma.language.findFirst({ where: { name: lang.name } });
    if (!existing) {
      await prisma.language.create({ data: lang });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
