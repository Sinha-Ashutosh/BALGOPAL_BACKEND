import bcrypt from "bcrypt";
import { adminRepository } from "@/repositories/admin.repository";
import { roleRepository } from "@/repositories/role.repository";
import { AppError } from "@/core/errors/app-error";
import type { CreateAdminDto, GetAdminsQueryDto, UpdateAdminDto } from "../validations/admin.validation.js";
import { env } from "@/config";
import { Role } from "@/constants/role";
import { ROLES } from "@/constants/role";
import { PaginationMeta } from "@/types/pagination.types.ts";
import { refreshTokenRepository } from "@/repositories/refresh-token.repository";

export class AdminService {

    async createAdmin(
  data: CreateAdminDto,
  currentUser: {
    adminId: string;
    role: Role;
        }
    ) {
  if (currentUser.role === ROLES.TEACHER) {
    throw AppError.forbidden("Teachers are not allowed to create users.");
  }

  if (currentUser.role === ROLES.PRINCIPAL && data.role !== ROLES.TEACHER) {
    throw AppError.forbidden("Principals can only create teachers.");
  }

  const existingAdmin = await adminRepository.findByEmail(data.email);
  if (existingAdmin) {
    throw AppError.conflict("An account with this email already exists.");
  }

  const role = await roleRepository.findByName(data.role);
  if (!role) {
    throw AppError.badRequest("Selected role does not exist.");
  }

  const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_SALT_ROUNDS);

  const admin = await adminRepository.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    profileImage: data.profileImage,
    roleId: role.id,
  });

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    profileImage: admin.profileImage,
    role: role.name,
    isActive: admin.isActive,
    createdAt: admin.createdAt,
    };
}

async getAdmins(query: GetAdminsQueryDto) {
  const { page, limit } = query;

  const { admins, total } = await adminRepository.findAll(query);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const pagination: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return {
    admins,
    pagination,
  };
}

async getAdminById(id: string) {
  const admin = await adminRepository.findById(id);

  if (!admin) {
    throw AppError.notFound("Admin not found.");
  }

  const { password, ...safeAdmin } = admin;

  return safeAdmin;
}

async updateAdmin(
  id: string,
  data: UpdateAdminDto,
  currentUser: {
    adminId: string;
    role: Role;
        }
) {
  // 1. Check if admin exists
  const existingAdmin = await adminRepository.findById(id);

  if (!existingAdmin) {
    throw AppError.notFound("Admin not found.");
  }

  // 2. Authorization
  if (currentUser.role === ROLES.TEACHER) {
    throw AppError.forbidden(
      "Teachers are not allowed to update users."
    );
  }

  if (
    currentUser.role === ROLES.PRINCIPAL &&
    existingAdmin.role !== ROLES.TEACHER
  ) {
    throw AppError.forbidden(
      "Principals can only update teachers."
    );
  }

  // 3. Prevent self role change
  if (
    data.role &&
    currentUser.adminId === existingAdmin.id
  ) {
    throw AppError.badRequest(
      "You cannot change your own role."
    );
  }

  // 4. Prevent self deactivation
  if (
    data.isActive === false &&
    currentUser.adminId === existingAdmin.id
  ) {
    throw AppError.badRequest(
      "You cannot deactivate your own account."
    );
  }

  // 5. Check email uniqueness
  if (
    data.email &&
    data.email !== existingAdmin.email
  ) {
    const emailExists = await adminRepository.findByEmail(
      data.email
    );

    if (emailExists) {
      throw AppError.conflict(
        "An account with this email already exists."
      );
    }
  }

  // 6. Prepare update payload
  const updateData: Partial<{
    name: string;
    email: string;
    phone: string;
    profileImage: string | null;
    isActive: boolean;
    roleId: string;
  }> = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.phone !== undefined) {
    updateData.phone = data.phone;
  }

  if (data.profileImage !== undefined) {
    updateData.profileImage = data.profileImage;
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  // 7. Resolve role if role is changing
  let updatedRole = existingAdmin.role;

  if (data.role) {
    const role = await roleRepository.findByName(data.role);

    if (!role) {
      throw AppError.badRequest(
        "Selected role does not exist."
      );
    }

    updateData.roleId = role.id;
    updatedRole = role.name;
  }

  // 8. Update admin
  const updatedAdmin = await adminRepository.update(
    id,
    updateData
  );

  if (!updatedAdmin) {
    throw AppError.internal(
      "Failed to update admin."
    );
  }

  // 9. Return response
  return {
    id: updatedAdmin.id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
    phone: updatedAdmin.phone,
    profileImage: updatedAdmin.profileImage,
    role: updatedRole,
    isActive: updatedAdmin.isActive,
    lastLogin: updatedAdmin.lastLogin,
    createdAt: updatedAdmin.createdAt,
    updatedAt: updatedAdmin.updatedAt,
  };
}

async deleteAdmin(
  id: string,
  currentUser: {
    adminId: string;
    role: Role;
  }
): Promise<void> {
  const existingAdmin = await adminRepository.findById(id);

  if (!existingAdmin) {
    throw AppError.notFound("Admin not found.");
  }

  if (currentUser.role === ROLES.TEACHER) {
    throw AppError.forbidden(
      "Teachers are not allowed to delete users."
    );
  }

  if (
    currentUser.role === ROLES.PRINCIPAL &&
    existingAdmin.role !== ROLES.TEACHER
  ) {
    throw AppError.forbidden(
      "Principals can only delete teachers."
    );
  }

  if (currentUser.adminId === existingAdmin.id) {
    throw AppError.badRequest(
      "You cannot delete your own account."
    );
  }

  if (!existingAdmin.isActive) {
    throw AppError.badRequest(
      "Admin is already inactive."
    );
  }

  const updatedAdmin = await adminRepository.update(id, {
    isActive: false,
  });

  if (!updatedAdmin) {
    throw AppError.internal("Failed to delete admin.");
  }

  await refreshTokenRepository.revokeAllForAdmin(id);
}

}
export const adminService = new AdminService()