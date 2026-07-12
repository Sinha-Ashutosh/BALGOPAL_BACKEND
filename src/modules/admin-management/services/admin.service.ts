import bcrypt from "bcrypt";
import { adminRepository } from "@/repositories/admin.repository";
import { roleRepository } from "@/repositories/role.repository";
import { AppError } from "@/core/errors/app-error";
import type { CreateAdminDto } from "../validations/admin.validation.js";
import { env } from "@/config";
import { Role } from "@/constants/role";
import { ROLES } from "@/constants/role";

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
}
export const adminService = new AdminService()