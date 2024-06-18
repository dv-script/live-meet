/*
  Warnings:

  - Changed the type of `department` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Department" AS ENUM ('COMERCIAL', 'DIREITOS', 'CONTEUDO', 'ENTIDADES', 'FINANCEIRO', 'OPERACOES', 'RH', 'NEGOCIOS');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL;

-- DropEnum
DROP TYPE "Departament";
