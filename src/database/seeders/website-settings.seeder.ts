import { eq } from "drizzle-orm";
import { logger } from "@/config";
import { db } from "@/database/index";
import { websiteSettings } from "@/database/schema/index";
import { WEBSITE_SETTINGS_ID } from "@/constants/settings";

export async function seedWebsiteSettings(): Promise<void> {
  try {
   const existingSettings = await db.query.websiteSettings.findFirst();
   
    if (existingSettings) {
      logger.info("Website settings already exist. Skipping seeding.");
      return;
    }

    await db.insert(websiteSettings).values({
      id: WEBSITE_SETTINGS_ID,
      schoolName: "Bal Gopal Play n Learn",
      phone: "8581928091",
      email: "BalGopalPlaynLearn@gmail.com",
      address: "C 74 Ag Colony, Near Ag Colony Park, Road Num 4c, Ashiana Nagar, Patna-800025, Bihar",
      about:
        "Bal Gopal Play n Learn provides a safe, joyful and engaging learning environment where children learn through play.",
      heroTitle: "Laying Strong Foundation",
      heroSubtitle:
        "A nurturing preschool dedicated to inspiring curiosity, creativity and confidence.",
      schoolTimings: "Monday - Friday | 8:30 AM - 1:00 PM",
    });

    logger.info("Website settings seeded successfully.");
  } catch (err) {
    logger.error({ err }, "Failed to seed website settings.");
    throw err;
  }
}