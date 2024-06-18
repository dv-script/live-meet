/*
  Warnings:

  - Changed the type of `location` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Location" AS ENUM ('ANDAR1', 'ANDAR2', 'ANDAR3', 'ANDAR4', 'ANDAR5');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "location",
ADD COLUMN     "location" "Location" NOT NULL;
