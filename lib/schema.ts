import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const forms = sqliteTable("form", {
  id: integer("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  text: text("text", { length: 255 }).notNull(),
  url: text("url", { length: 255 }).notNull(),
  platforms: text("platforms").notNull(),
  imageUrl: text("imageUrl", { length: 255 }),
});

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;

export const titles = sqliteTable("title", {
  id: integer("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id)
    .unique(),
  subtitulo: text("subtitulo", { length: 255 }).notNull(),
  title: text("title", { length: 255 }).notNull(),
});

export type Title = typeof forms.$inferSelect;
export type NewTitle = typeof forms.$inferInsert;

// Tabela de templates
export const templates = sqliteTable("templates", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  filePath: text("filePath").notNull(),
});

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;

// Tabela para salvar a escolha do template do usuário
export const userTemplateChoices = sqliteTable("user_template_choices", {
  id: integer("id").primaryKey(),
  userId: integer("userId").notNull(),
  templateId: integer("templateId").notNull(),
});

export type UserTemplateChoice = typeof userTemplateChoices.$inferSelect;
export type NewUserTemplateChoice = typeof userTemplateChoices.$inferInsert;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
