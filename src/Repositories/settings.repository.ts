import { eq } from "drizzle-orm";

import { db } from "@/database/index";
import { websiteSettings } from "@/database/schema/index";
import { WEBSITE_SETTINGS_ID } from "@/constants/settings";
import type { UpdateWebsiteSettingsDto } from "@/modules/settings/validations/settings.validation";

// Fixed ID — this table only ever holds one row.


export class SettingsRepository {
  /**
   * Returns the website settings.
   */
  async find() {
    return db.query.websiteSettings.findFirst({
      where: eq(
        websiteSettings.id,
        WEBSITE_SETTINGS_ID
      ),
    });
  }

  /**
   * Creates or updates the singleton settings row.
   */
  async update(data: UpdateWebsiteSettingsDto) {
  const [settings] = await db
    .update(websiteSettings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(websiteSettings.id, WEBSITE_SETTINGS_ID))
    .returning();

  return settings;
}
}

export const settingsRepository =
  new SettingsRepository();