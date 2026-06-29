-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "UserGoal" ADD COLUMN     "dailyCarbGoal" INTEGER,
ADD COLUMN     "dailyFatGoal" INTEGER;
