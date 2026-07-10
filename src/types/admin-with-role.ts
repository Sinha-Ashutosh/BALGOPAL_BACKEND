import { Role } from "@/constants/role";

export interface AdminWithRole {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  profileImage: string | null;
  role: Role;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}