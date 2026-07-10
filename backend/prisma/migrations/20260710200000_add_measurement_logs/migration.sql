CREATE TABLE "MeasurementLog" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "date" DATE NOT NULL,
  "weightKg" DECIMAL(5,2),
  "neckCm" DECIMAL(5,2),
  "waistCm" DECIMAL(5,2),
  "shoulderCm" DECIMAL(5,2),
  "hipCm" DECIMAL(5,2),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MeasurementLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MeasurementLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "MeasurementLog_userId_date_key" ON "MeasurementLog"("userId", "date");
CREATE INDEX "MeasurementLog_userId_date_idx" ON "MeasurementLog"("userId", "date");
