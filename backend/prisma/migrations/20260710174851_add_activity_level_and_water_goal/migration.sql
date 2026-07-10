-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "activityLevel" "ActivityLevel";

-- AlterTable
ALTER TABLE "UserGoal" ADD COLUMN     "dailyWaterGoal" INTEGER;
