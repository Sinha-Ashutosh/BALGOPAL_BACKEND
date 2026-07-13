import { AppError } from "@/core/errors/app-error";

import { settingsRepository } from "@/repositories/settings.repository";

import type { UpdateWebsiteSettingsDto } from "../validations/settings.validation";

export class SettingsService {
  /**
   * Returns website settings.
   */
  async getSettings() {
    const settings = await settingsRepository.find();

    if (!settings) {
      throw AppError.notFound("Website settings not found.");
    }

    return settings;
  }

  /**
   * Creates or updates website settings.
   */
  async updateSettings(
    data: UpdateWebsiteSettingsDto
  ) {
    const existing = await settingsRepository.find();

if (!existing) {
  throw AppError.notFound(
    "Website settings not found."
  );
}

return settingsRepository.update(data);
  }
}

export const settingsService = new SettingsService();