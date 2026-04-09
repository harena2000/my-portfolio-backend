import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // ── Home (singleton) ──
  await prisma.home.upsert({
    where: { id: "singleton" },
    update: {
      fullName: "Harena Rico Mahefaniaina",
      tagline: "Mobile & Web Developer",
      bio: "Experienced full-stack mobile and web developer with over 4 years of expertise at Futurmap. Specialized in Flutter development with a strong command of modern web technologies (Node.js, Vue.js, Django, Next.js). Expert in GIS solutions and complex geospatial systems integration.",
      avatarUrl: "",
      github: "https://github.com/harena2000",
      linkedin: "https://linkedin.com/in/harena-rico",
      twitter: "",
      email: "harenaricom@gmail.com",
    },
    create: {
      id: "singleton",
      fullName: "Harena Rico Mahefaniaina",
      tagline: "Mobile & Web Developer",
      bio: "Experienced full-stack mobile and web developer with over 4 years of expertise at Futurmap. Specialized in Flutter development with a strong command of modern web technologies (Node.js, Vue.js, Django, Next.js). Expert in GIS solutions and complex geospatial systems integration.",
      avatarUrl: "",
      github: "https://github.com/harena2000",
      linkedin: "https://linkedin.com/in/harena-rico",
      twitter: "",
      email: "harenaricom@gmail.com",
    },
  });
  console.log("✓ Home");

  // ── Resume (singleton) ──
  await prisma.resume.upsert({
    where: { id: "singleton" },
    update: {
      summary:
        "Experienced full-stack mobile and web developer with over 4 years of expertise at Futurmap. Specialized in Flutter development with a strong command of modern web technologies (Node.js, Vue.js, Django, Next.js). Expert in GIS solutions and complex geospatial systems integration.",
      skills: [
        "Flutter",
        "Vue.js",
        "TypeScript",
        "Express.js",
        "Next.js",
        "React",
        "PostgreSQL",
        "Laravel",
      ],
    },
    create: {
      id: "singleton",
      summary:
        "Experienced full-stack mobile and web developer with over 4 years of expertise at Futurmap. Specialized in Flutter development with a strong command of modern web technologies (Node.js, Vue.js, Django, Next.js). Expert in GIS solutions and complex geospatial systems integration.",
      skills: [
        "Flutter",
        "Vue.js",
        "TypeScript",
        "Express.js",
        "Next.js",
        "React",
        "PostgreSQL",
        "Laravel",
      ],
    },
  });
  console.log("✓ Resume");

  // ── Skills (delete all then re-create to avoid duplicates) ──
  await prisma.skill.deleteMany();
  const skills = [
    { name: "Flutter", iconUrl: "/logos/flutter.svg", category: "Mobile", proficiency: "Expert", order: 0 },
    { name: "Vue.js", iconUrl: "/logos/vue.svg", category: "Frontend", proficiency: "Advanced", order: 1 },
    { name: "TypeScript", iconUrl: "/logos/typescript.svg", category: "Frontend", proficiency: "Advanced", order: 2 },
    { name: "Express.js", iconUrl: "/logos/express.svg", category: "Backend", proficiency: "Advanced", order: 3 },
    { name: "Next.js", iconUrl: "/logos/nextjs.svg", category: "Frontend", proficiency: "Intermediate", order: 4 },
    { name: "React", iconUrl: "/logos/react.svg", category: "Frontend", proficiency: "Intermediate", order: 5 },
    { name: "PostgreSQL", iconUrl: "/logos/postgresql.svg", category: "Database", proficiency: "Intermediate", order: 6 },
    { name: "Laravel", iconUrl: "/logos/laravel.svg", category: "Backend", proficiency: "Intermediate", order: 7 },
  ];
  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`✓ Skills (${skills.length})`);

  // ── Experiences (delete all then re-create) ──
  await prisma.experience.deleteMany();
  const experiences = [
    {
      type: "work",
      companyOrSchool: "Aureon Madagascar",
      roleOrDegree: "Lead Developer",
      location: "",
      startDate: new Date("2026-01-01"),
      endDate: null,
      isPresent: true,
      description:
        "Lead developer responsible for technical architecture, team management, and development of mobile and web applications.",
    },
    {
      type: "work",
      companyOrSchool: "Futurmap",
      roleOrDegree: "Lead Mobile Developer",
      location: "",
      startDate: new Date("2024-10-01"),
      endDate: new Date("2026-01-01"),
      isPresent: false,
      description:
        "Lead developer in the beyond map department for code maintainability, project management, and team supervision.",
    },
    {
      type: "work",
      companyOrSchool: "Futurmap",
      roleOrDegree: "Mobile Developer",
      location: "",
      startDate: new Date("2022-01-01"),
      endDate: new Date("2024-01-01"),
      isPresent: false,
      description:
        "Development of mobile applications with Flutter, Java and Kotlin.",
    },
    {
      type: "work",
      companyOrSchool: "Fitiavana.MG",
      roleOrDegree: "Fullstack Developer Vue / Laravel",
      location: "",
      startDate: new Date("2021-01-01"),
      endDate: new Date("2022-01-01"),
      isPresent: false,
      description:
        "Developed a storage management application with Vue.js and Laravel.",
    },
  ];
  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`✓ Experiences (${experiences.length})`);

  // ── Projects (delete all then re-create) ──
  await prisma.project.deleteMany();
  const projects = [
    {
      title: "MENTO",
      shortDescription: "AUREON | Mobile Application",
      fullDescription:
        "MENTO is your personal companion for mental strength. An app that helps you organize your thoughts, understand your feelings, and gain new perspectives. No hocus-pocus, but modern psychology made simple and accessible.",
      techStack: ["Flutter", "Firebase", "Gemini", "Stripe"],
      featured: true,
      displayOrder: 0,
      liveDemoUrl: "/projects/mento",
    },
    {
      title: "WebGIS Platform",
      shortDescription: "Futurmap | Web GIS Application",
      fullDescription:
        "Development of a complete WebGIS platform with QGIS integration. Creation of a custom QGIS plugin communicating via WebSocket to synchronize changes directly with the web application. Implementation of a system for displaying geospatial layers on images and an interactive map. Development of an innovative viewer transforming panoramic images into an immersive 360° experience.",
      techStack: ["Django", "Next.js", "TypeScript", "Leaflet", "Docker", "QGIS", "Shadcn/ui", "PostgreSQL"],
      featured: true,
      displayOrder: 1,
    },
    {
      title: "InsideGolf",
      shortDescription: "Futurmap | Cross-platform Mobile",
      fullDescription:
        "Development of a dedicated mobile application for learning golf, offering an optimal user experience and advanced features for golf enthusiasts.",
      techStack: ["Flutter", "Stripe", "Firebase"],
      featured: true,
      displayOrder: 2,
      liveDemoUrl: "https://play.google.com/store/apps/details?id=com.idevshop.oppgolf&pcampaignid=web_share",
    },
    {
      title: "ZakaJiaby",
      shortDescription: "Freelance | Cross-platform Web and Mobile",
      fullDescription:
        "Mobile application for budget, event, and activity management for groups of people. Allows users to track expenses, plan events, and manage activities collaboratively within a user-friendly interface.",
      techStack: ["Flutter", "Express.js", "PostgreSQL"],
      featured: false,
      displayOrder: 3,
    },
    {
      title: "Product Ticketing",
      shortDescription: "Freelance | Web Application",
      fullDescription:
        "Design and development of a complete product ticket management platform. With a robust architecture allowing for efficient request management, ticket tracking, and real-time collaboration.",
      techStack: ["Express.js", "Vue.js", "TailwindCSS", "Docker", "PostgreSQL"],
      featured: false,
      displayOrder: 4,
    },
    {
      title: "SingSong",
      shortDescription: "Freelance | Mobile Application",
      fullDescription:
        "A social karaoke mobile application allowing users to sing, listen, and record songs. This application is targeted for Adventists.",
      techStack: ["Flutter"],
      featured: false,
      displayOrder: 5,
      liveDemoUrl: "/projects/singsong",
    },
  ];
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✓ Projects (${projects.length})`);

  // ── Languages ──
  await prisma.language.deleteMany();
  const languages = [
    { name: "French", level: "Native" },
    { name: "English", level: "Fluent" },
  ];
  for (const lang of languages) {
    await prisma.language.create({ data: lang });
  }
  console.log(`✓ Languages (${languages.length})`);

  console.log("\nAll data seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
