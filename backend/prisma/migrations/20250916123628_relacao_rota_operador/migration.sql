/*
  Warnings:

  - A unique constraint covering the columns `[rotaId]` on the table `operadores` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `operadores` ADD COLUMN `rotaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `rota` ADD COLUMN `detalhe` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `operadores_rotaId_key` ON `operadores`(`rotaId`);

-- AddForeignKey
ALTER TABLE `operadores` ADD CONSTRAINT `operadores_rotaId_fkey` FOREIGN KEY (`rotaId`) REFERENCES `Rota`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
