export const ROLES = {
  ADMIN: "Admin",
  PRINCIPAL: "Principal",
  TEACHER: "Teacher",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_VALUES = Object.values(ROLES) as [Role, ...Role[]];