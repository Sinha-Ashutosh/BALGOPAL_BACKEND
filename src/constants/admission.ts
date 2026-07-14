export const ADMISSION_STATUS = {
  PENDING: "pending",
  REVIEWING: "reviewing",
  WAITLISTED: "waitlisted",
  APPROVED: "approved",
  REJECTED: "rejected",
  ENROLLED: "enrolled",
} as const;

export const ADMISSION_STATUS_VALUES = Object.values(
  ADMISSION_STATUS
);