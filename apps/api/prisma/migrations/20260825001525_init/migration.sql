-- CreateTable
CREATE TABLE `athletics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `acronym` VARCHAR(20) NOT NULL,
    `degreeProgram` VARCHAR(100) NOT NULL,
    `logoUrl` VARCHAR(255) NULL,
    `foundationYear` INTEGER NULL,
    `city` VARCHAR(100) NOT NULL DEFAULT 'Rio Verde',
    `state` CHAR(2) NOT NULL DEFAULT 'GO',
    `historyMission` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `athletics_acronym_key`(`acronym`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `board_presidents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `athleticsId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `tenureYear` INTEGER NOT NULL,
    `photoUrl` VARCHAR(255) NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'President',
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trophy_conquests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `athleticsId` INTEGER NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `year` INTEGER NOT NULL,
    `description` TEXT NULL,
    `iconType` VARCHAR(50) NOT NULL DEFAULT 'trophy',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `athleticsId` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(14) NULL,
    `academicId` VARCHAR(20) NULL,
    `role` ENUM('ADMIN', 'REPRESENTATIVE', 'TABLE_OFFICIAL', 'ATHLETE', 'VISITOR') NOT NULL DEFAULT 'ATHLETE',
    `photoUrl` VARCHAR(255) NULL,
    `isHomeFeatured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_cpf_key`(`cpf`),
    UNIQUE INDEX `users_academicId_key`(`academicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'MIXED') NOT NULL,
    `type` ENUM('DIRECT_SCORE', 'SETS_PARTIALS', 'TIME_STOPWATCH', 'JUDGES_SCORE') NOT NULL,
    `iconUrl` VARCHAR(255) NULL,
    `shortDesc` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tournaments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `year` INTEGER NOT NULL,
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `status` ENUM('REGISTRATION_OPEN', 'IN_PROGRESS', 'FINISHED') NOT NULL DEFAULT 'REGISTRATION_OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tournament_sports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER NOT NULL,
    `sportId` INTEGER NOT NULL,
    `olympicWeightPoints` INTEGER NOT NULL DEFAULT 13,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `athleticsId` INTEGER NOT NULL,
    `tournamentSportId` INTEGER NOT NULL,
    `finalPosition` INTEGER NULL,
    `isJubsQualified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_athletes` (
    `teamId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `jerseyNumber` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`teamId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournamentSportId` INTEGER NOT NULL,
    `homeTeamId` INTEGER NULL,
    `awayTeamId` INTEGER NULL,
    `stage` VARCHAR(50) NOT NULL DEFAULT 'Group Stage',
    `scheduledAt` DATETIME(3) NOT NULL,
    `locationCourt` VARCHAR(100) NULL,
    `status` ENUM('SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELED') NOT NULL DEFAULT 'SCHEDULED',
    `homeScore` INTEGER NOT NULL DEFAULT 0,
    `awayScore` INTEGER NOT NULL DEFAULT 0,
    `stopwatchSeconds` INTEGER NOT NULL DEFAULT 0,
    `winnerTeamId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `teamId` INTEGER NULL,
    `userId` INTEGER NULL,
    `type` ENUM('GOAL_POINT', 'FOUL', 'YELLOW_CARD', 'RED_CARD', 'SET_PARTIAL', 'TIME_NOTE_RECORD') NOT NULL,
    `recordedValue` VARCHAR(50) NULL,
    `matchTimeSec` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `olympic_rankings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER NOT NULL,
    `athleticsId` INTEGER NOT NULL,
    `totalPoints` INTEGER NOT NULL DEFAULT 0,
    `goldCount` INTEGER NOT NULL DEFAULT 0,
    `silverCount` INTEGER NOT NULL DEFAULT 0,
    `bronzeCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `olympic_rankings_tournamentId_athleticsId_key`(`tournamentId`, `athleticsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(50) NOT NULL,
    `targetDate` DATETIME(3) NULL,
    `eventTitle` VARCHAR(100) NULL,
    `message` VARCHAR(255) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `system_settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `board_presidents` ADD CONSTRAINT `board_presidents_athleticsId_fkey` FOREIGN KEY (`athleticsId`) REFERENCES `athletics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trophy_conquests` ADD CONSTRAINT `trophy_conquests_athleticsId_fkey` FOREIGN KEY (`athleticsId`) REFERENCES `athletics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_athleticsId_fkey` FOREIGN KEY (`athleticsId`) REFERENCES `athletics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tournament_sports` ADD CONSTRAINT `tournament_sports_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tournament_sports` ADD CONSTRAINT `tournament_sports_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `sports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_athleticsId_fkey` FOREIGN KEY (`athleticsId`) REFERENCES `athletics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_tournamentSportId_fkey` FOREIGN KEY (`tournamentSportId`) REFERENCES `tournament_sports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_athletes` ADD CONSTRAINT `team_athletes_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_athletes` ADD CONSTRAINT `team_athletes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_tournamentSportId_fkey` FOREIGN KEY (`tournamentSportId`) REFERENCES `tournament_sports`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_homeTeamId_fkey` FOREIGN KEY (`homeTeamId`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_awayTeamId_fkey` FOREIGN KEY (`awayTeamId`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_winnerTeamId_fkey` FOREIGN KEY (`winnerTeamId`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_events` ADD CONSTRAINT `match_events_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_events` ADD CONSTRAINT `match_events_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_events` ADD CONSTRAINT `match_events_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `olympic_rankings` ADD CONSTRAINT `olympic_rankings_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `tournaments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `olympic_rankings` ADD CONSTRAINT `olympic_rankings_athleticsId_fkey` FOREIGN KEY (`athleticsId`) REFERENCES `athletics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
