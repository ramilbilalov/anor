-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "restaurantName" TEXT NOT NULL DEFAULT 'Анор',
    "description" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "workingHours" TEXT NOT NULL DEFAULT '',
    "deliveryInfo" TEXT NOT NULL DEFAULT '',
    "legalName" TEXT NOT NULL DEFAULT '',
    "inn" TEXT NOT NULL DEFAULT '',
    "ogrnip" TEXT NOT NULL DEFAULT '',
    "legalEmail" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("address", "deliveryInfo", "description", "id", "phone", "restaurantName", "updatedAt", "workingHours") SELECT "address", "deliveryInfo", "description", "id", "phone", "restaurantName", "updatedAt", "workingHours" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
