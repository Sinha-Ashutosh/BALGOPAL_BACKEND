import { eq } from "drizzle-orm";

import type { Role } from "@/constants/role";
import { db } from "@/database/index";
import { roles } from "@/database/schema/index";

export class RoleRepository {
  async findByName(role: Role) {
    return db.query.roles.findFirst({
      where: eq(roles.name, role),
      columns: {
        id: true,
        name: true,
      },
    });
  }

  async findById(id: string) {
    return db.query.roles.findFirst({
      where: eq(roles.id, id),
    });
  }

  async findAll() {
    return db.query.roles.findMany({
      orderBy: (roles, { asc }) => [asc(roles.name)],
    });
  }
}

export const roleRepository = new RoleRepository();