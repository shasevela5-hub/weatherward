import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const outfitScans = mysqlTable("outfitScans", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  imageUrl: text("imageUrl").notNull(),
  detectedItems: text("detectedItems").notNull(), // JSON array of clothing items
  colorPalette: text("colorPalette").notNull(), // JSON array of dominant colors
  styleScore: int("styleScore").notNull(), // 1-10 rating
  styleTags: text("styleTags").notNull(), // JSON array of style tags
  weatherCondition: varchar("weatherCondition", { length: 100 }),
  temperature: int("temperature"), // in Celsius
  weatherIcon: varchar("weatherIcon", { length: 50 }),
  recommendations: text("recommendations"), // JSON array of recommendations
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OutfitScan = typeof outfitScans.$inferSelect;
export type InsertOutfitScan = typeof outfitScans.$inferInsert;