import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio Backend API",
      version: "1.0.0",
      description: "REST API for portfolio admin backoffice",
    },
    servers: [
      { url: "/", description: "Current server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // ── Auth ──
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@admin.com" },
            password: { type: "string", example: "admin123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                name: { type: "string" },
              },
            },
          },
        },
        AdminUser: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
          },
        },

        // ── Home ──
        Home: {
          type: "object",
          properties: {
            fullName: { type: "string" },
            tagline: { type: "string" },
            bio: { type: "string" },
            avatarUrl: { type: "string" },
            socialLinks: {
              type: "object",
              properties: {
                github: { type: "string" },
                linkedin: { type: "string" },
                twitter: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
        HomeUpdate: {
          type: "object",
          properties: {
            fullName: { type: "string" },
            tagline: { type: "string" },
            bio: { type: "string" },
            avatarUrl: { type: "string" },
            socialLinks: {
              type: "object",
              properties: {
                github: { type: "string" },
                linkedin: { type: "string" },
                twitter: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },

        // ── Skill ──
        Skill: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            iconUrl: { type: "string" },
            category: { type: "string" },
            proficiency: { type: "string" },
            order: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SkillCreate: {
          type: "object",
          required: ["name", "category"],
          properties: {
            name: { type: "string" },
            category: { type: "string" },
            iconUrl: { type: "string" },
            proficiency: { type: "string", default: "Intermediate" },
            order: { type: "integer", default: 0 },
          },
        },

        // ── Project ──
        Project: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            shortDescription: { type: "string" },
            fullDescription: { type: "string" },
            techStack: { type: "array", items: { type: "string" } },
            thumbnailUrl: { type: "string" },
            liveDemoUrl: { type: "string" },
            githubUrl: { type: "string" },
            featured: { type: "boolean" },
            displayOrder: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ProjectCreate: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string" },
            shortDescription: { type: "string" },
            fullDescription: { type: "string" },
            techStack: { type: "array", items: { type: "string" } },
            thumbnailUrl: { type: "string" },
            liveDemoUrl: { type: "string" },
            githubUrl: { type: "string" },
            featured: { type: "boolean", default: false },
            displayOrder: { type: "integer", default: 0 },
          },
        },

        // ── Experience ──
        Experience: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string", enum: ["Work", "Education"] },
            companyOrSchool: { type: "string" },
            roleOrDegree: { type: "string" },
            location: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date", nullable: true },
            isPresent: { type: "boolean" },
            description: { type: "string" },
            logoUrl: { type: "string" },
          },
        },
        ExperienceCreate: {
          type: "object",
          required: ["type", "companyOrSchool", "roleOrDegree", "startDate"],
          properties: {
            type: { type: "string", enum: ["Work", "Education"] },
            companyOrSchool: { type: "string" },
            roleOrDegree: { type: "string" },
            location: { type: "string" },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            isPresent: { type: "boolean", default: false },
            description: { type: "string" },
            logoUrl: { type: "string" },
          },
        },

        // ── Contact ──
        ContactMessage: {
          type: "object",
          properties: {
            id: { type: "string" },
            senderName: { type: "string" },
            senderEmail: { type: "string" },
            message: { type: "string" },
            dateReceived: { type: "string", format: "date-time" },
            status: { type: "string", enum: ["Unread", "Read", "Archived"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ContactCreate: {
          type: "object",
          required: ["senderName", "senderEmail", "message"],
          properties: {
            senderName: { type: "string" },
            senderEmail: { type: "string", format: "email" },
            message: { type: "string" },
          },
        },
        ContactStatusUpdate: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", enum: ["Unread", "Read", "Archived"] },
          },
        },

        // ── Resume ──
        Resume: {
          type: "object",
          properties: {
            pdfUrl: { type: "string", nullable: true },
            summary: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            workExperience: {
              type: "array",
              items: { $ref: "#/components/schemas/Experience" },
            },
            education: {
              type: "array",
              items: { $ref: "#/components/schemas/Experience" },
            },
            certifications: {
              type: "array",
              items: { $ref: "#/components/schemas/Certification" },
            },
            languages: {
              type: "array",
              items: { $ref: "#/components/schemas/Language" },
            },
          },
        },
        ResumeUpdate: {
          type: "object",
          properties: {
            summary: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            certifications: {
              type: "array",
              items: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  issuer: { type: "string" },
                  date: { type: "string" },
                  url: { type: "string" },
                },
              },
            },
            languages: {
              type: "array",
              items: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  level: { type: "string" },
                },
              },
            },
          },
        },
        Certification: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            issuer: { type: "string" },
            date: { type: "string" },
            url: { type: "string" },
          },
        },
        Language: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            level: { type: "string" },
          },
        },

        // ── Generic ──
        MessageResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    paths: {
      // ── Health ──
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            200: {
              description: "Server is running",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      timestamp: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ── Auth ──
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Admin login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            400: { description: "Missing email or password" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current admin user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Current user",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AdminUser" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "User not found" },
          },
        },
      },

      // ── Home ──
      "/api/home": {
        get: {
          tags: ["Home"],
          summary: "Get home/profile data",
          responses: {
            200: {
              description: "Home data",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Home" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Home"],
          summary: "Update home/profile data",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HomeUpdate" },
              },
            },
          },
          responses: {
            200: {
              description: "Updated home data",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Home" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },

      // ── Skills ──
      "/api/skills": {
        get: {
          tags: ["Skills"],
          summary: "List all skills",
          responses: {
            200: {
              description: "Array of skills",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Skill" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Skills"],
          summary: "Create a skill",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SkillCreate" },
              },
            },
          },
          responses: {
            201: {
              description: "Created skill",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Skill" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/skills/{id}": {
        put: {
          tags: ["Skills"],
          summary: "Update a skill",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SkillCreate" },
              },
            },
          },
          responses: {
            200: {
              description: "Updated skill",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Skill" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Skill not found" },
          },
        },
        delete: {
          tags: ["Skills"],
          summary: "Delete a skill",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Skill deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Skill not found" },
          },
        },
      },

      // ── Projects ──
      "/api/projects": {
        get: {
          tags: ["Projects"],
          summary: "List all projects",
          responses: {
            200: {
              description: "Array of projects",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Projects"],
          summary: "Create a project",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProjectCreate" },
              },
            },
          },
          responses: {
            201: {
              description: "Created project",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Project" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/projects/{id}": {
        put: {
          tags: ["Projects"],
          summary: "Update a project",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProjectCreate" },
              },
            },
          },
          responses: {
            200: {
              description: "Updated project",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Project" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Project not found" },
          },
        },
        delete: {
          tags: ["Projects"],
          summary: "Delete a project",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Project deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Project not found" },
          },
        },
      },

      // ── Experience ──
      "/api/experience": {
        get: {
          tags: ["Experience"],
          summary: "List all experiences",
          responses: {
            200: {
              description: "Array of experiences",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Experience" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Experience"],
          summary: "Create an experience entry",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExperienceCreate" },
              },
            },
          },
          responses: {
            201: {
              description: "Created experience",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Experience" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/experience/{id}": {
        put: {
          tags: ["Experience"],
          summary: "Update an experience entry",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExperienceCreate" },
              },
            },
          },
          responses: {
            200: {
              description: "Updated experience",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Experience" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Entry not found" },
          },
        },
        delete: {
          tags: ["Experience"],
          summary: "Delete an experience entry",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Entry deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Entry not found" },
          },
        },
      },

      // ── Contact ──
      "/api/contact": {
        get: {
          tags: ["Contact"],
          summary: "List contact messages (admin)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "status",
              in: "query",
              schema: { type: "string", enum: ["Unread", "Read", "Archived"] },
              description: "Filter by status",
            },
          ],
          responses: {
            200: {
              description: "Array of messages",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/ContactMessage" },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          tags: ["Contact"],
          summary: "Send a contact message",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactCreate" },
              },
            },
          },
          responses: {
            201: {
              description: "Message sent",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ContactMessage" },
                },
              },
            },
            400: { description: "All fields are required" },
          },
        },
      },
      "/api/contact/{id}": {
        put: {
          tags: ["Contact"],
          summary: "Update message status",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactStatusUpdate" },
              },
            },
          },
          responses: {
            200: {
              description: "Updated message",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ContactMessage" },
                },
              },
            },
            400: { description: "Invalid status" },
            401: { description: "Unauthorized" },
            404: { description: "Message not found" },
          },
        },
        delete: {
          tags: ["Contact"],
          summary: "Delete a contact message",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            200: {
              description: "Message deleted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Message not found" },
          },
        },
      },

      // ── Resume ──
      "/api/resume": {
        get: {
          tags: ["Resume"],
          summary: "Get full resume data",
          responses: {
            200: {
              description: "Resume data",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Resume" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Resume"],
          summary: "Update resume data",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResumeUpdate" },
              },
            },
          },
          responses: {
            200: {
              description: "Updated resume",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Resume" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/resume/upload": {
        post: {
          tags: ["Resume"],
          summary: "Upload resume PDF",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["pdf"],
                  properties: {
                    pdf: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "PDF uploaded",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      pdfUrl: { type: "string" },
                    },
                  },
                },
              },
            },
            400: { description: "No file uploaded or invalid format" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/resume/pdf": {
        delete: {
          tags: ["Resume"],
          summary: "Delete resume PDF",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "PDF removed",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MessageResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
    },
    tags: [
      { name: "Health", description: "Health check" },
      { name: "Auth", description: "Authentication" },
      { name: "Home", description: "Home / profile section" },
      { name: "Skills", description: "Skills management" },
      { name: "Projects", description: "Projects management" },
      { name: "Experience", description: "Work & education experience" },
      { name: "Contact", description: "Contact messages" },
      { name: "Resume", description: "Resume / CV data" },
    ],
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
