/*
  Warnings:

  - You are about to drop the column `amount` on the `OrderProduct` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrderProduct` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "quantity" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderProduct" DROP COLUMN "amount",
DROP COLUMN "quantity";
