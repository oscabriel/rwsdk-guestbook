import type { InferSelectModel } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth-schema";

export const guestbook_message = sqliteTable(
	"guestbook_message",
	{
		id: integer().primaryKey(),
		name: text().notNull(),
		message: text().notNull(),
		country: text(),
		userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => [
		index("idx_guestbook_created_at").on(table.createdAt),
		index("idx_guestbook_user_id").on(table.userId),
	],
);

export type GuestBookMessage = InferSelectModel<typeof guestbook_message>;
