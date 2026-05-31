-- CreateTable
CREATE TABLE "daily_menus" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT,
    "sopaName" TEXT NOT NULL,
    "sopaExtras" TEXT,
    "proteinaName" TEXT NOT NULL,
    "guarniciones" TEXT,
    "ensalada" TEXT,
    "bebida" TEXT,
    "postre" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "daily_menus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "daily_menus_restaurantId_idx" ON "daily_menus"("restaurantId");

-- CreateIndex
CREATE INDEX "daily_menus_date_idx" ON "daily_menus"("date");

-- AddForeignKey
ALTER TABLE "daily_menus" ADD CONSTRAINT "daily_menus_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
