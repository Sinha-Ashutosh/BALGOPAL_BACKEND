import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";

import { db } from "@/database/index";
import { admissions } from "@/database/schema/index";
import { AdmissionStatus } from "@/constants/admission";
import type {
  CreateAdmissionDto,
  GetAdmissionQueryDto,
  UpdateAdmissionDto,
} from "@/modules/admissions/validations/admission.validation";

export class AdmissionRepository {
  async create(data: CreateAdmissionDto) {
    const [admission] = await db
      .insert(admissions)
      .values(data)
      .returning();

    return admission;
  }

  async findById(id: string) {
    return db.query.admissions.findFirst({
      where: eq(admissions.id, id),
    });
  }

  async findByEmail(email: string) {
    return db.query.admissions.findFirst({
      where: eq(admissions.email, email),
    });
  }

  async findAll(query: GetAdmissionQueryDto) {
    const {
      page,
      limit,
      search,
      status,
      sortBy,
      order,
    } = query;

    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (status) {
      conditions.push(eq(admissions.status, status));
    }

    if (search) {
      conditions.push(
        or(
          ilike(admissions.parentName, `%${search}%`),
          ilike(admissions.childName, `%${search}%`),
          ilike(admissions.email, `%${search}%`),
          ilike(admissions.phone, `%${search}%`)
        )!
      );
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumns = {
      parentName: admissions.parentName,
      childName: admissions.childName,
      status: admissions.status,
      createdAt: admissions.createdAt,
    } as const;

    type SortKey = keyof typeof sortColumns;

    const sortColumn =
      sortColumns[(sortBy ?? "createdAt") as SortKey];

    const orderByClause =
      order === "asc"
        ? asc(sortColumn)
        : desc(sortColumn);

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(admissions)
        .where(whereClause)
        .orderBy(orderByClause, asc(admissions.id))
        .limit(limit)
        .offset(offset),

      db
        .select({
          total: count(),
        })
        .from(admissions)
        .where(whereClause),
    ]);

    return {
      admissions: items,
      total,
    };
  }

  async update(
    id: string,
    data: Partial<UpdateAdmissionDto>
  ) {
    const [admission] = await db
      .update(admissions)
      .set(data)
      .where(eq(admissions.id, id))
      .returning();

    return admission;
  }

  async updateStatus(id: string, status: typeof admissions.$inferInsert.status) {
    const [admission] = await db
      .update(admissions)
      .set({ status })
      .where(eq(admissions.id, id))
      .returning();

    return admission;
  }

  async delete(id: string) {
    const [admission] = await db
      .delete(admissions)
      .where(eq(admissions.id, id))
      .returning();

    return admission;
  }

  async count(): Promise<number> {
    const [{ total }] = await db.select({ total: count() }).from(admissions);
    return total;
  }

  async countByStatus(status: AdmissionStatus): Promise<number> {
    const [{ total }] = await db
      .select({ total: count() })
      .from(admissions)
      .where(eq(admissions.status, status));
    return total;
  }

  async findRecent(limit = 5) {
  return db
    .select()
    .from(admissions)
    .orderBy(desc(admissions.createdAt))
    .limit(limit);
}
}

export const admissionRepository = new AdmissionRepository();