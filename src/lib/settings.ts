import { prisma } from "@/lib/prisma";

export type RestaurantSettings = {
  restaurantName: string;
  description: string;
  address: string;
  phone: string;
  workingHours: string;
  deliveryInfo: string;
  legalName: string;
  inn: string;
  ogrnip: string;
  legalEmail: string;
};

export const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: process.env.NEXT_PUBLIC_RESTAURANT_NAME ?? "Анор",
  description: "",
  address: "",
  phone: "",
  workingHours: "",
  deliveryInfo: "",
  legalName: "",
  inn: "",
  ogrnip: "",
  legalEmail: "",
};

const SETTINGS_KEYS: (keyof RestaurantSettings)[] = [
  "restaurantName",
  "description",
  "address",
  "phone",
  "workingHours",
  "deliveryInfo",
  "legalName",
  "inn",
  "ogrnip",
  "legalEmail",
];

const SETTINGS_ID = "singleton";

type SettingsRow = Record<keyof RestaurantSettings, string>;

function toSettings(row: SettingsRow): RestaurantSettings {
  const result = {} as RestaurantSettings;
  for (const key of SETTINGS_KEYS) result[key] = row[key];
  return result;
}

/** Returns the singleton settings row, creating it with defaults if missing. */
export async function getSettings(): Promise<RestaurantSettings> {
  const row = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID, restaurantName: DEFAULT_SETTINGS.restaurantName },
  });
  return toSettings(row);
}

export async function updateSettings(
  data: Partial<RestaurantSettings>
): Promise<RestaurantSettings> {
  const clean: Partial<RestaurantSettings> = {};
  for (const key of SETTINGS_KEYS) {
    const value = data[key];
    if (typeof value === "string") clean[key] = value.trim();
  }

  const row = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: clean,
    create: {
      id: SETTINGS_ID,
      ...clean,
      restaurantName: clean.restaurantName || DEFAULT_SETTINGS.restaurantName,
    },
  });
  return toSettings(row);
}
