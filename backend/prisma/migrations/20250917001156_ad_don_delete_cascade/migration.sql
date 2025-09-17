-- DropForeignKey
ALTER TABLE `ponto` DROP FOREIGN KEY `Ponto_rotaId_fkey`;

-- DropIndex
DROP INDEX `Ponto_rotaId_fkey` ON `ponto`;

-- AddForeignKey
ALTER TABLE `Ponto` ADD CONSTRAINT `Ponto_rotaId_fkey` FOREIGN KEY (`rotaId`) REFERENCES `Rota`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
