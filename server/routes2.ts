import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage2";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertPortfolioSchema,
  insertPageSchema,
  insertSectionSchema,
  insertMediaSchema,
} from "@shared/schema2";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolios", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolios = await storage.getUserPortfolios(userId);
      res.json(portfolios);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      res.status(500).json({ message: "Failed to fetch portfolios" });
    }
  });

  app.post("/api/portfolios", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const portfolioData = insertPortfolioSchema.parse({
        ...req.body,
        userId,
      });
      
      const portfolio = await storage.createPortfolio(portfolioData);
      
      // Create default home page
      await storage.createPage({
        portfolioId: portfolio.id,
        title: "Home",
        slug: "",
        isHomePage: true,
        order: 0,
      });
      
      res.json(portfolio);
    } catch (error) {
      console.error("Error creating portfolio:", error);
      res.status(500).json({ message: "Failed to create portfolio" });
    }
  });

  app.get("/api/portfolios/:id", isAuthenticated, async (req: any, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Check ownership
      if (portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Get pages with sections
      const pages = await storage.getPortfolioPages(portfolioId);
      const portfolioWithPages = { ...portfolio, pages };
      
      // Get sections for each page
      for (const page of portfolioWithPages.pages) {
        (page as any).sections = await storage.getPageSections(page.id);
      }
      
      res.json(portfolioWithPages);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  app.put("/api/portfolios/:id", isAuthenticated, async (req: any, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Check ownership
      if (portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updateData = insertPortfolioSchema.partial().parse(req.body);
      const updatedPortfolio = await storage.updatePortfolio(portfolioId, updateData);
      
      res.json(updatedPortfolio);
    } catch (error) {
      console.error("Error updating portfolio:", error);
      res.status(500).json({ message: "Failed to update portfolio" });
    }
  });

  app.delete("/api/portfolios/:id", isAuthenticated, async (req: any, res) => {
    try {
      const portfolioId = parseInt(req.params.id);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Check ownership
      if (portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deletePortfolio(portfolioId);
      res.json({ message: "Portfolio deleted successfully" });
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      res.status(500).json({ message: "Failed to delete portfolio" });
    }
  });

  // Page routes
  app.get("/api/portfolios/:portfolioId/pages", isAuthenticated, async (req: any, res) => {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Check ownership
      if (portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const pages = await storage.getPortfolioPages(portfolioId);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.post("/api/portfolios/:portfolioId/pages", isAuthenticated, async (req: any, res) => {
    try {
      const portfolioId = parseInt(req.params.portfolioId);
      const portfolio = await storage.getPortfolio(portfolioId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      // Check ownership
      if (portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const pageData = insertPageSchema.parse({
        ...req.body,
        portfolioId,
      });
      
      const page = await storage.createPage(pageData);
      res.json(page);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  // Section routes
  app.get("/api/pages/:pageId/sections", isAuthenticated, async (req: any, res) => {
    try {
      const pageId = parseInt(req.params.pageId);
      const page = await storage.getPage(pageId);
      
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      // Check ownership through portfolio
      const portfolio = await storage.getPortfolio(page.portfolioId);
      if (!portfolio || portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const sections = await storage.getPageSections(pageId);
      res.json(sections);
    } catch (error) {
      console.error("Error fetching sections:", error);
      res.status(500).json({ message: "Failed to fetch sections" });
    }
  });

  app.post("/api/pages/:pageId/sections", isAuthenticated, async (req: any, res) => {
    try {
      const pageId = parseInt(req.params.pageId);
      const page = await storage.getPage(pageId);
      
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      // Check ownership through portfolio
      const portfolio = await storage.getPortfolio(page.portfolioId);
      if (!portfolio || portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const sectionData = insertSectionSchema.parse({
        ...req.body,
        pageId,
      });
      
      const section = await storage.createSection(sectionData);
      res.json(section);
    } catch (error) {
      console.error("Error creating section:", error);
      res.status(500).json({ message: "Failed to create section" });
    }
  });

  app.put("/api/sections/:id", isAuthenticated, async (req: any, res) => {
    try {
      const sectionId = parseInt(req.params.id);
      const section = await storage.getSection(sectionId);
      
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      // Check ownership through portfolio
      const page = await storage.getPage(section.pageId);
      const portfolio = await storage.getPortfolio(page!.portfolioId);
      if (!portfolio || portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updateData = insertSectionSchema.partial().parse(req.body);
      const updatedSection = await storage.updateSection(sectionId, updateData);
      
      res.json(updatedSection);
    } catch (error) {
      console.error("Error updating section:", error);
      res.status(500).json({ message: "Failed to update section" });
    }
  });

  app.delete("/api/sections/:id", isAuthenticated, async (req: any, res) => {
    try {
      const sectionId = parseInt(req.params.id);
      const section = await storage.getSection(sectionId);
      
      if (!section) {
        return res.status(404).json({ message: "Section not found" });
      }
      
      // Check ownership through portfolio
      const page = await storage.getPage(section.pageId);
      const portfolio = await storage.getPortfolio(page!.portfolioId);
      if (!portfolio || portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteSection(sectionId);
      res.json({ message: "Section deleted successfully" });
    } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({ message: "Failed to delete section" });
    }
  });

  app.post("/api/pages/:pageId/sections/reorder", isAuthenticated, async (req: any, res) => {
    try {
      const pageId = parseInt(req.params.pageId);
      const { sectionIds } = req.body;
      
      const page = await storage.getPage(pageId);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      // Check ownership through portfolio
      const portfolio = await storage.getPortfolio(page.portfolioId);
      if (!portfolio || portfolio.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.reorderSections(pageId, sectionIds);
      res.json({ message: "Sections reordered successfully" });
    } catch (error) {
      console.error("Error reordering sections:", error);
      res.status(500).json({ message: "Failed to reorder sections" });
    }
  });

  // Media routes
  app.post("/api/media", isAuthenticated, upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const userId = req.user.claims.sub;
      const file = req.file;
      
      // Generate URL for the uploaded file
      const url = `/uploads/${file.filename}`;
      
      const mediaData = insertMediaSchema.parse({
        userId,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
      });
      
      const media = await storage.createMedia(mediaData);
      res.json(media);
    } catch (error) {
      console.error("Error uploading media:", error);
      res.status(500).json({ message: "Failed to upload media" });
    }
  });

  app.get("/api/media", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const media = await storage.getUserMedia(userId);
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.delete("/api/media/:id", isAuthenticated, async (req: any, res) => {
    try {
      const mediaId = parseInt(req.params.id);
      const mediaFile = await storage.getMedia(mediaId);
      
      if (!mediaFile) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      // Check ownership
      if (mediaFile.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteMedia(mediaId);
      res.json({ message: "Media deleted successfully" });
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ message: "Failed to delete media" });
    }
  });

  // Public portfolio view (no auth required)
  app.get("/api/public/portfolios/domain/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const portfolio = await storage.getPortfolioByDomain(domain);
      
      if (!portfolio || !portfolio.isPublished) {
        return res.status(404).json({ message: "Portfolio not found" });
      }
      
      const pages = await storage.getPortfolioPages(portfolio.id);
      const portfolioWithPages = { ...portfolio, pages };
      
      // Get sections for each page
      for (const page of portfolioWithPages.pages) {
        (page as any).sections = await storage.getPageSections(page.id);
      }
      
      res.json(portfolioWithPages);
    } catch (error) {
      console.error("Error fetching public portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
