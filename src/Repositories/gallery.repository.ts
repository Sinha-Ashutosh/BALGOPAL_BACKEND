import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  type SQL,
} from "drizzle-orm";

import { db } from "@/database/index";
import { gallery } from "@/database/schema/index";

import type {
  CreateGalleryDto,
  GetGalleryQueryDto,
  UpdateGalleryDto,
} from "@/modules/gallery/validations/gallery.validation";

type GalleryCreateData = CreateGalleryDto & {
  imageUrl: string;
  imagePublicId: string;
};

type GalleryUpdateData = Partial<
  UpdateGalleryDto & {
    imageUrl: string;
    imagePublicId: string;
  }
>;

export class GalleryRepository {
  async create(data: GalleryCreateData) {
    const [item] = await db.insert(gallery).values(data).returning();

    return item;
  }

  async findById(id: string) {
    return db.query.gallery.findFirst({
      where: eq(gallery.id, id),
    });
  }

  async findAll(query: GetGalleryQueryDto) {
const {
  page = 1,
  limit = 12,
  category,
  search,
  sortBy = "createdAt",
  order = "desc",
} = query;

    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (category) {
      conditions.push(eq(gallery.category, category));
    }

    if (search) {
      conditions.push(ilike(gallery.title, `%${search}%`));
    }

    const whereClause =
      conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumns: Record<
    NonNullable<GetGalleryQueryDto["sortBy"]>,
    typeof gallery.title
    > = {
    title: gallery.title,
    category: gallery.category,
    createdAt: gallery.createdAt,
    };

    const sortColumn = sortColumns[sortBy];

    const orderByClause =
      order === "asc"
        ? asc(sortColumn)
        : desc(sortColumn);

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(gallery)
        .where(whereClause)
        .orderBy(orderByClause, asc(gallery.id))
        .limit(limit)
        .offset(offset),

      db
        .select({
          total: count(),
        })
        .from(gallery)
        .where(whereClause),
    ]);

    return {
      gallery: items,
      total,
    };
  }

  async update(
    id: string,
    data: GalleryUpdateData
  ) {
    const [item] = await db
      .update(gallery)
      .set(data)
      .where(eq(gallery.id, id))
      .returning();

    return item;
  }

  async delete(id: string) {
    const [item] = await db
      .delete(gallery)
      .where(eq(gallery.id, id))
      .returning();

    return item;
  }

  async count(): Promise<number> {
    const [{ total }] = await db.select({ total: count() }).from(gallery);
    return total;
  }
}

export const galleryRepository = new GalleryRepository();