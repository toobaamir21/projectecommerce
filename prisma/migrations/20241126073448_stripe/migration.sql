/*
  Warnings:

  - You are about to alter the column `quantity` on the `orderitems` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `price` on the `orderitems` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `cartitems` DROP FOREIGN KEY `CartItems_cartId_fkey`;

-- AlterTable
ALTER TABLE `orderitems` MODIFY `quantity` INTEGER NOT NULL,
    MODIFY `price` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CartItems` ADD CONSTRAINT `CartItems_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
