/*
  Warnings:

  - A unique constraint covering the columns `[cart_id]` on the table `CartProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CartProduct_cart_id_key" ON "CartProduct"("cart_id");
