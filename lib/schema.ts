import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const forms = sqliteTable("form", {
  id: integer("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  text: text("text", { length: 255 }).notNull(),
  url: text("url", { length: 255 }).notNull(),
  platforms: text("platforms").notNull(),
  icons: text("icons"),
  order: integer("order").default(0), // Definir a ordem de exibição
});

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;

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
  userId: text("userId").notNull(),
  templateId: integer("templateId").notNull(),
});

export type UserTemplateChoice = typeof userTemplateChoices.$inferSelect;
export type NewUserTemplateChoice = typeof userTemplateChoices.$inferInsert;

// export const userTemplateChoicesUniqueConstraint = sqliteTable("user_template_choices_unique_constraint", {
//   id: integer("id").primaryKey(),
//   userId: integer("userId").notNull(),
//   templateId: integer("templateId").notNull(),
//   unique: [userId, templateId], // Garante a unicidade da combinação
// });

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
