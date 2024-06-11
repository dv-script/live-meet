/*
  Warnings:

  - Added the required column `department` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Departament" AS ENUM ('COMERCIAL', 'DIREITOS', 'CONTEUDO', 'ENTIDADES', 'FINANCEIRO', 'OPERACOES', 'RH', 'NEGOCIOS');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "department",
ADD COLUMN     "department" "Departament" NOT NULL;
