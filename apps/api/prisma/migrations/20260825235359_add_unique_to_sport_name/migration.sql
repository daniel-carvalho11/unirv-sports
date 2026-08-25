/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `sports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `sports_name_key` ON `sports`(`name`);
