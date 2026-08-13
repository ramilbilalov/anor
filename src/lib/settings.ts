import { prisma } from "@/lib/prisma";

export type RestaurantSettings = {
  restaurantName: string;
  description: string;
  address: string;
  phone: string;
  workingHours: string;
  deliveryInfo: string;
};

export const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: process.env.NEXT_PUBLIC_RESTAURANT_NAME ?? "Анор",
  description: "",
  address: "",
  phone: "",
  workingHours: "",
  deliveryInfo: "",
};

const SETTINGS_ID = "singleton";

/** Returns the singleton settings row, creating it with defaults if missing. */
export async function getSettings(): Promise<RestaurantSettings> {
  const row = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID, restaurantName: DEFAULT_SETTINGS.restaurantName },
  });
  return {
    restaurantName: row.restaurantName,
    description: row.description,
    address: row.address,
    phone: row.phone,
    workingHours: row.workingHours,
    deliveryInfo: row.deliveryInfo,
  };
}

export async function updateSettings(
  data: Partial<RestaurantSettings>
): Promise<RestaurantSettings> {
  const clean: Partial<RestaurantSettings> = {};
  for (const key of [
    "restaurantName",
    "description",
    "address",
    "phone",
    "workingHours",
    "deliveryInfo",
  ] as const) {
    if (typeof data[key] === "string") clean[key] = data[key].trim();
  }

  const row = await prisma.settings.upsert({
    where: { id: SETTINGS_ID },
    update: clean,
    create: {
      id: SETTINGS_ID,
      restaurantName:
        clean.restaurantName || DEFAULT_SETTINGS.restaurantName,
      description: clean.description ?? "",
      address: clean.address ?? "",
      phone: clean.phone ?? "",
      workingHours: clean.workingHours ?? "",
      deliveryInfo: clean.deliveryInfo ?? "",
    },
  });
  return {
    restaurantName: row.restaurantName,
    description: row.description,
    address: row.address,
    phone: row.phone,
    workingHours: row.workingHours,
    deliveryInfo: row.deliveryInfo,
  };
}
