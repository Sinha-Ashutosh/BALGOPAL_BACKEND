import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/database/index";
import { contactMessages } from "@/database/schema/index";
import type {
  CreateContactMessageDto,
  GetContactMessageQueryDto,
} from "@/modules/contact-messages/validations/contact-message.validation";

export class ContactMessageRepository {
  async create(data: CreateContactMessageDto) {
    const [message] = await db.insert(contactMessages).values(data).returning();
    return message;
  }

  async findById(id: string) {
    return db.query.contactMessages.findFirst({
      where: eq(contactMessages.id, id),
    });
  }

  async findAll(query: GetContactMessageQueryDto) {
    const { page, limit, search, isRead, sortBy, order } = query;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (search) {
      conditions.push(
        or(
          ilike(contactMessages.name, `%${search}%`),
          ilike(contactMessages.email, `%${search}%`),
          ilike(contactMessages.subject, `%${search}%`)
        )!
      );
    }
    if (isRead !== undefined) {
      conditions.push(eq(contactMessages.isRead, isRead));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumns = {
      name: contactMessages.name,
      createdAt: contactMessages.createdAt,
    } as const;

    type SortKey = keyof typeof sortColumns;

    const sortColumn =
    sortColumns[(sortBy ?? "createdAt") as SortKey];

    const orderByClause = order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(contactMessages)
        .where(whereClause)
        .orderBy(orderByClause, asc(contactMessages.id))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(contactMessages).where(whereClause),
    ]);

    return { messages: items, total };
  }

  async update(id: string, isRead: boolean) {
    const [message] = await db
      .update(contactMessages)
      .set({ isRead })
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  async delete(id: string) {
    const [message] = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  async countUnread() {
    const [{ total }] = await db
      .select({ total: count() })
      .from(contactMessages)
      .where(eq(contactMessages.isRead, false));
    return total;
  }

  async countAll(): Promise<number> {
    const [{ total }] = await db.select({ total: count() }).from(contactMessages);
    return total;
  }
}

export const contactMessageRepository = new ContactMessageRepository();