import {
	date,
	decimal,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const bookRoleEnum = pgEnum('book_role', ['owner', 'editor', 'viewer']);

export const budgetBook = pgTable('budget_book', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
	updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
	updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' })
});

export const budgetBookMember = pgTable(
	'budget_book_member',
	{
		bookId: uuid('book_id')
			.notNull()
			.references(() => budgetBook.id, { onDelete: 'cascade' }),
		userId: uuid('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		role: bookRoleEnum('role').notNull()
	},
	(table) => [
		primaryKey({ columns: [table.bookId, table.userId] }),
		index('budget_book_member_user_id_idx').on(table.userId)
	]
);

export const category = pgTable(
	'category',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		bookId: uuid('book_id')
			.notNull()
			.references(() => budgetBook.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		icon: text('icon'),
		budgetAmount: decimal('budget_amount', { precision: 12, scale: 2 }).notNull(),
		sortOrder: integer('sort_order').notNull(),
		createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
		updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date())
	},
	(table) => [
		index('category_book_id_idx').on(table.bookId),
		index('category_created_by_idx').on(table.createdBy)
	]
);

export const item = pgTable(
	'item',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		categoryId: uuid('category_id')
			.notNull()
			.references(() => category.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		sortOrder: integer('sort_order').notNull(),
		createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
		updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date())
	},
	(table) => [
		index('item_category_id_idx').on(table.categoryId),
		index('item_created_by_idx').on(table.createdBy)
	]
);

export const budgetTransaction = pgTable(
	'budget_transaction',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		itemId: uuid('item_id')
			.notNull()
			.references(() => item.id, { onDelete: 'cascade' }),
		amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
		transactionDate: date('transaction_date').notNull(),
		note: text('note'),
		createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
		updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date())
	},
	(table) => [
		index('budget_transaction_item_id_idx').on(table.itemId),
		index('budget_transaction_date_idx').on(table.transactionDate),
		index('budget_transaction_created_by_idx').on(table.createdBy)
	]
);

export * from './auth.schema';
