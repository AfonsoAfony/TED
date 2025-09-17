-- CreateTable
CREATE TABLE `relatorio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `volume` VARCHAR(191) NOT NULL,
    `rota` INTEGER NOT NULL,
    `operador` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
