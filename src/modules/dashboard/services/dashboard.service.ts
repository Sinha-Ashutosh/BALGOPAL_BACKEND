import { admissionRepository } from "@/repositories/admission.repository.js";
import { contactMessageRepository } from "@/repositories/contact-message.repository.js";
import { galleryRepository } from "@/repositories/gallery.repository.js";
import { announcementRepository } from "@/repositories/announcement.repository.js";
import { ADMISSION_STATUS } from "@/constants/admission";

export interface DashboardStats {
  totalEnquiries: number;
  pendingEnquiries: number;
  unreadMessages: number;
  totalMessages: number;
  galleryImages: number;
  announcements: number;
}

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const [
      totalEnquiries,
      pendingEnquiries,
      unreadMessages,
      totalMessages,
      galleryImages,
      announcements,
    ] = await Promise.all([
      admissionRepository.count(),
      admissionRepository.countByStatus(ADMISSION_STATUS.PENDING),
      contactMessageRepository.countUnread(),
      contactMessageRepository.countAll(),
      galleryRepository.count(),
      announcementRepository.count(),
    ]);

    return {
      totalEnquiries,
      pendingEnquiries,
      unreadMessages,
      totalMessages,
      galleryImages,
      announcements,
    };
  }
  async getRecentAdmissions() {
    return admissionRepository.findRecent(5);
  }
}

export const dashboardService = new DashboardService();