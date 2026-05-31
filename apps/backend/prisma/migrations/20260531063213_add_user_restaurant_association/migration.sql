-- CreateEnum
CREATE TYPE "RestaurantRole" AS ENUM ('OWNER', 'MANAGER', 'CHEF', 'STAFF');

-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_ownerId_fkey";

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "ownerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "user_restaurants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "role" "RestaurantRole" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_restaurants_userId_idx" ON "user_restaurants"("userId");

-- CreateIndex
CREATE INDEX "user_restaurants_restaurantId_idx" ON "user_restaurants"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "user_restaurants_userId_restaurantId_key" ON "user_restaurants"("userId", "restaurantId");

-- AddForeignKey
ALTER TABLE "user_restaurants" ADD CONSTRAINT "user_restaurants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_restaurants" ADD CONSTRAINT "user_restaurants_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
