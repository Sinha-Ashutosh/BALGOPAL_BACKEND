import { and, asc, count, desc, eq, ilike, isNull, lte, gt, type SQL } from "drizzle-orm";
import { db } from "@/database/index.js";
import { announcements } from "@/database/schema/index.js";
import type {
  CreateAnnouncementDto,
  GetAnnouncementQueryDto,
  UpdateAnnouncementDto,
} from "@/modules/announcements/validations/announcement.validation.js";
import { or } from "drizzle-orm";

export class AnnouncementRepository {
  async create(data: CreateAnnouncementDto) {
    const [announcement] = await db
      .insert(announcements)
      .values(data)
      .returning();
    return announcement;
  }

  async findById(id: string) {
    return db.query.announcements.findFirst({
      where: eq(announcements.id, id),
    });
  }

  async findAll(query: GetAnnouncementQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = "createdAt",
      order = "desc",
    } = query;

    const offset = (page - 1) * limit;
    const conditions: SQL[] = [];

    if (search) {
      conditions.push(
  or(
    ilike(announcements.title, `%${search}%`),
    ilike(announcements.description, `%${search}%`)
  )!
);
    }
    if (isActive !== undefined) {
      conditions.push(eq(announcements.isActive, isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumns = {
    title: announcements.title,
    createdAt: announcements.createdAt,
    publishAt: announcements.publishAt,
    } as const;

    type SortKey = keyof typeof sortColumns;

    const sortColumn = sortColumns[sortBy as SortKey];
    const orderByClause = order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(announcements)
        .where(whereClause)
        .orderBy(orderByClause, asc(announcements.id))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(announcements).where(whereClause),
    ]);

    return { announcements: items, total };
  }
    async findPublicActive() {
        const now = new Date();
        return db
        .select()
        .from(announcements)
        .where(
            and(
            eq(announcements.isActive, true),
            or(isNull(announcements.publishAt), lte(announcements.publishAt, now)),
            or(isNull(announcements.expiresAt), gt(announcements.expiresAt, now))
            )
        )
        .orderBy(desc(announcements.createdAt), asc(announcements.id));
    }

  async update(id: string, data: UpdateAnnouncementDto) {
  const [announcement] = await db
    .update(announcements)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(announcements.id, id))
    .returning();

  return announcement;
}

  async delete(id: string) {
    const [announcement] = await db
      .delete(announcements)
      .where(eq(announcements.id, id))
      .returning();
    return announcement;
  }
}

export const announcementRepository = new AnnouncementRepository();