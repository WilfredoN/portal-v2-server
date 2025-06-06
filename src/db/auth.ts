import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";


export const auth = pgTable("auth", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    signedInAt: timestamp("signed_in_at", {withTimezone: true}),
    provider: varchar("provider", { length: 255 }).notNull(),
    identifier: varchar("identifier", { length: 255 })
})
