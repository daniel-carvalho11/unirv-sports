-- AlterTable
ALTER TABLE `matches` ADD COLUMN `endedAt` DATETIME(3) NULL,
    ADD COLUMN `startedAt` DATETIME(3) NULL,
    ADD COLUMN `tableOfficialId` INTEGER NULL;

-- CreateTable
CREATE TABLE `athlete_sport_registrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `athleticsId` INTEGER NOT NULL,
    `sportId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `notes` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `athlete_sport_registrations_userId_sportId_key`(`userId`, `sportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `athlete_sport_registrations` ADD CONSTRAINT `athlete_sport_registrations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athlete_sport_registrations` ADD CONSTRAINT `athlete_sport_registrations_athleticsId_fkey` FOREIGN KEY (`athleticsId`) REFERENCES `athletics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athlete_sport_registrations` ADD CONSTRAINT `athlete_sport_registrations_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_tableOfficialId_fkey` FOREIGN KEY (`tableOfficialId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
