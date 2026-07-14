import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/database/index";
import { testimonials } from "@/database/schema/index";
import type {
  CreateTestimonialDto,
  GetTestimonialQueryDto,
  UpdateTestimonialDto,
} from "@/modules/testimonials/validations/testimonial.validation";

export class TestimonialRepository {
  async create(
    data: CreateTestimonialDto & { imageUrl?: string; imagePublicId?: string }
  ) {
    const [testimonial] = await db.insert(testimonials).values(data).returning();
    return testimonial;
  }

  async findById(id: string) {
    return db.query.testimonials.findFirst({ where: eq(testimonials.id, id) });
  }

  async findAll(query: GetTestimonialQueryDto) {
    const { page, limit, search, isActive, sortBy, order } = query;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (search) {
      conditions.push(
        or(
            ilike(testimonials.parentName, `%${search}%`),
            ilike(testimonials.studentName, `%${search}%`)
        )!
        );
    }
    if (isActive !== undefined) {
      conditions.push(eq(testimonials.isActive, isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumns = {
      parentName: testimonials.parentName,
      rating: testimonials.rating,
      createdAt: testimonials.createdAt,
    } as const;

    type SortKey = keyof typeof sortColumns;

    const sortColumn = sortColumns[
    (sortBy ?? "createdAt") as SortKey
    ];

    const orderByClause = order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(testimonials)
        .where(whereClause)
        .orderBy(orderByClause, asc(testimonials.id))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(testimonials).where(whereClause),
    ]);

    return { testimonials: items, total };
  }

  /**
   * Public-facing: only active testimonials.
   */
  async findPublicActive() {
    return db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(desc(testimonials.createdAt), asc(testimonials.id));
  }

  async update(
    id: string,
    data: Partial<UpdateTestimonialDto & { imageUrl: string ; imagePublicId: string }>
  ) {
    const [testimonial] = await db
      .update(testimonials)
      .set({
        ...data,
        updatedAt: new Date(),
        })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async delete(id: string) {
    const [testimonial] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }
}

export const testimonialRepository = new TestimonialRepository();