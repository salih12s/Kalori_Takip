-- Add external food cache metadata without changing existing local foods.
ALTER TABLE "Food" ADD COLUMN "externalProvider" TEXT;
ALTER TABLE "Food" ADD COLUMN "cachedAt" TIMESTAMP(3);

CREATE INDEX "Food_externalProvider_externalId_idx" ON "Food"("externalProvider", "externalId");
CREATE UNIQUE INDEX "Food_externalProvider_externalId_key" ON "Food"("externalProvider", "externalId");
