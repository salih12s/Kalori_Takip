-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "fiber" DECIMAL(8,2),
ADD COLUMN     "normalizedName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sugar" DECIMAL(8,2);

-- AlterTable
ALTER TABLE "FoodAlias" ADD COLUMN     "normalizedAlias" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "FoodEntry" ADD COLUMN     "fiber" DECIMAL(8,2),
ADD COLUMN     "sugar" DECIMAL(8,2);

-- Backfill normalized values for existing local data.
UPDATE "Food"
SET "normalizedName" = lower(trim(translate("name", 'çğıöşüÇĞİIÖŞÜ', 'cgiosucgiiosu')))
WHERE "normalizedName" = '';

UPDATE "FoodAlias"
SET "normalizedAlias" = lower(trim(translate("alias", 'çğıöşüÇĞİIÖŞÜ', 'cgiosucgiiosu')))
WHERE "normalizedAlias" = '';

-- CreateIndex
CREATE INDEX "Food_normalizedName_idx" ON "Food"("normalizedName");

-- CreateIndex
CREATE INDEX "Food_deletedAt_idx" ON "Food"("deletedAt");

-- CreateIndex
CREATE INDEX "FoodAlias_normalizedAlias_idx" ON "FoodAlias"("normalizedAlias");
