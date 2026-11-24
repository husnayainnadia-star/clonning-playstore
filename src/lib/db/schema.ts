import {
  pgTable,
  text,
  varchar,
  integer,
  bigint,
  decimal,
  boolean,
  timestamp,
  serial,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  password: text("password"),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Accounts (NextAuth) ──────────────────────────────────────────────────────
export const accounts = pgTable("accounts", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 50 }),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

// ─── Sessions (NextAuth) ──────────────────────────────────────────────────────
export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

// ─── Verification Tokens (NextAuth) ──────────────────────────────────────────
export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
});

// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: text("icon"),
  color: varchar("color", { length: 20 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Applications ─────────────────────────────────────────────────────────────
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  developer: varchar("developer", { length: 255 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  icon: text("icon").notNull(),
  screenshots: text("screenshots").array(),
  description: text("description").notNull(),
  whatsNew: text("whats_new"),
  version: varchar("version", { length: 50 }).notNull().default("1.0.0"),
  size: varchar("size", { length: 50 }).notNull().default("10 MB"),
  minAndroid: varchar("min_android", { length: 50 }).default("5.0 and up"),
  downloads: bigint("downloads", { mode: "number" }).default(0).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  isFree: boolean("is_free").default(true).notNull(),
  isEditor: boolean("is_editor").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0).notNull(),
  contentRating: varchar("content_rating", { length: 50 }).default("Everyone"),
  website: text("website"),
  email: varchar("email", { length: 255 }),
  privacyPolicy: text("privacy_policy"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
}, (table) => ({
  nameIdx: index("app_name_idx").on(table.name),
  developerIdx: index("app_developer_idx").on(table.developer),
  categoryIdx: index("app_category_idx").on(table.categoryId),
}));

// ─── Application Categories (many-to-many) ───────────────────────────────────
export const applicationCategories = pgTable("application_categories", {
  appId: integer("app_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  appId: integer("app_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  body: text("body"),
  thumbsUp: integer("thumbs_up").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueReview: uniqueIndex("unique_user_app_review").on(table.userId, table.appId),
}));

// ─── Installations ────────────────────────────────────────────────────────────
export const installations = pgTable("installations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  appId: integer("app_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 30 }).default("installed").notNull(),
  installedAt: timestamp("installed_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueInstall: uniqueIndex("unique_user_app_install").on(table.userId, table.appId),
}));

// ─── Search History ───────────────────────────────────────────────────────────
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  query: varchar("query", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Banners ──────────────────────────────────────────────────────────────────
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  appId: integer("app_id").references(() => applications.id),
  isActive: boolean("is_active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  installations: many(installations),
  searchHistory: many(searchHistory),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  applications: many(applications),
  applicationCategories: many(applicationCategories),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  category: one(categories, {
    fields: [applications.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
  installations: many(installations),
  applicationCategories: many(applicationCategories),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  app: one(applications, { fields: [reviews.appId], references: [applications.id] }),
}));

export const installationsRelations = relations(installations, ({ one }) => ({
  user: one(users, { fields: [installations.userId], references: [users.id] }),
  app: one(applications, { fields: [installations.appId], references: [applications.id] }),
}));

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, { fields: [searchHistory.userId], references: [users.id] }),
}));

export const bannersRelations = relations(banners, ({ one }) => ({
  app: one(applications, { fields: [banners.appId], references: [applications.id] }),
}));
