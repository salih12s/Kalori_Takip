-- AddEnumValue
ALTER TYPE "LeaderboardPeriod" ADD VALUE IF NOT EXISTS 'DAILY';

-- CreateEnum
CREATE TYPE "LeaderboardPointSource" AS ENUM (
    'AGGREGATE',
    'FOOD_LOG',
    'CALORIE_GOAL',
    'PROTEIN_GOAL',
    'STEP_GOAL',
    'WORKOUT',
    'RUN_DISTANCE',
    'WALK_DISTANCE',
    'OFF_DAY',
    'WATER',
    'DAILY_COMPLETION'
);

-- AlterTable
ALTER TABLE "LeaderboardPoint" ADD COLUMN "source" "LeaderboardPointSource" NOT NULL DEFAULT 'AGGREGATE';

-- DropIndex
DROP INDEX IF EXISTS "LeaderboardPoint_userId_period_periodStart_key";

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardPoint_userId_period_periodStart_source_key" ON "LeaderboardPoint"("userId", "period", "periodStart", "source");

-- CreateIndex
CREATE INDEX "LeaderboardPoint_period_periodStart_source_idx" ON "LeaderboardPoint"("period", "periodStart", "source");
