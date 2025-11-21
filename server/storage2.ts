import {
  users,
  portfolios,
  pages,
  sections,
  media as mediaTable,
  type User,
  type UpsertUser,
  type Portfolio,
  type InsertPortfolio,
  type Page,
  type InsertPage,
  type Section,
  type InsertSection,
  type Media,
  type InsertMedia,
} from "@shared/schema2";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Portfolio operations
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  getUserPortfolios(userId: string): Promise<Portfolio[]>;
  getPortfolio(id: number): Promise<Portfolio | undefined>;
  getPortfolioByDomain(domain: string): Promise<Portfolio | undefined>;
  updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio>;
  deletePortfolio(id: number): Promise<void>;
  
  // Page operations
  createPage(page: InsertPage): Promise<Page>;
  getPortfolioPages(portfolioId: number): Promise<Page[]>;
  getPage(id: number): Promise<Page | undefined>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page>;
  deletePage(id: number): Promise<void>;
  
  // Section operations
  createSection(section: InsertSection): Promise<Section>;
  getPageSections(pageId: number): Promise<Section[]>;
  getSection(id: number): Promise<Section | undefined>;
  updateSection(id: number, section: Partial<InsertSection>): Promise<Section>;
  deleteSection(id: number): Promise<void>;
  reorderSections(pageId: number, sectionIds: number[]): Promise<void>;
  
  // Media operations
  createMedia(media: InsertMedia): Promise<Media>;
  getUserMedia(userId: string): Promise<Media[]>;
  getMedia(id: number): Promise<Media | undefined>;
  deleteMedia(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Portfolio operations
  async createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio> {
    const [newPortfolio] = await db
      .insert(portfolios)
      .values(portfolio)
      .returning();
    return newPortfolio;
  }

  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .orderBy(desc(portfolios.createdAt));
  }

  async getPortfolio(id: number): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id));
    return portfolio;
  }

  async getPortfolioByDomain(domain: string): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.domain, domain));
    return portfolio;
  }

  async updatePortfolio(id: number, portfolio: Partial<InsertPortfolio>): Promise<Portfolio> {
    const [updatedPortfolio] = await db
      .update(portfolios)
      .set({ ...portfolio, updatedAt: new Date() })
      .where(eq(portfolios.id, id))
      .returning();
    return updatedPortfolio;
  }

  async deletePortfolio(id: number): Promise<void> {
    await db.delete(portfolios).where(eq(portfolios.id, id));
  }

  // Page operations
  async createPage(page: InsertPage): Promise<Page> {
    const [newPage] = await db
      .insert(pages)
      .values(page)
      .returning();
    return newPage;
  }

  async getPortfolioPages(portfolioId: number): Promise<Page[]> {
    return await db
      .select()
      .from(pages)
      .where(eq(pages.portfolioId, portfolioId))
      .orderBy(pages.order);
  }

  async getPage(id: number): Promise<Page | undefined> {
    const [page] = await db
      .select()
      .from(pages)
      .where(eq(pages.id, id));
    return page;
  }

  async updatePage(id: number, page: Partial<InsertPage>): Promise<Page> {
    const [updatedPage] = await db
      .update(pages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage;
  }

  async deletePage(id: number): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // Section operations
  async createSection(section: InsertSection): Promise<Section> {
    const [newSection] = await db
      .insert(sections)
      .values(section)
      .returning();
    return newSection;
  }

  async getPageSections(pageId: number): Promise<Section[]> {
    return await db
      .select()
      .from(sections)
      .where(eq(sections.pageId, pageId))
      .orderBy(sections.order);
  }

  async getSection(id: number): Promise<Section | undefined> {
    const [section] = await db
      .select()
      .from(sections)
      .where(eq(sections.id, id));
    return section;
  }

  async updateSection(id: number, section: Partial<InsertSection>): Promise<Section> {
    const [updatedSection] = await db
      .update(sections)
      .set({ ...section, updatedAt: new Date() })
      .where(eq(sections.id, id))
      .returning();
    return updatedSection;
  }

  async deleteSection(id: number): Promise<void> {
    await db.delete(sections).where(eq(sections.id, id));
  }

  async reorderSections(pageId: number, sectionIds: number[]): Promise<void> {
    for (let i = 0; i < sectionIds.length; i++) {
      await db
        .update(sections)
        .set({ order: i })
        .where(and(eq(sections.id, sectionIds[i]), eq(sections.pageId, pageId)));
    }
  }

  // Media operations
  async createMedia(mediaData: InsertMedia): Promise<Media> {
    const [newMedia] = await db
      .insert(mediaTable)
      .values(mediaData)
      .returning();
    return newMedia;
  }

  async getUserMedia(userId: string): Promise<Media[]> {
    return await db
      .select()
      .from(mediaTable)
      .where(eq(mediaTable.userId, userId))
      .orderBy(desc(mediaTable.createdAt));
  }

  async getMedia(id: number): Promise<Media | undefined> {
    const [mediaFile] = await db
      .select()
      .from(mediaTable)
      .where(eq(mediaTable.id, id));
    return mediaFile;
  }

  async deleteMedia(id: number): Promise<void> {
    await db.delete(mediaTable).where(eq(mediaTable.id, id));
  }
}

export const storage = new DatabaseStorage();
