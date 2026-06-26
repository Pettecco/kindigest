-- CreateEnum
CREATE TYPE "PreferredDisplayMode" AS ENUM ('IMMERSIVE', 'TRANSLATED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'PT', 'ES', 'FR');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "hashedRefreshToken" VARCHAR(255),
    "preferredDisplayMode" "PreferredDisplayMode" NOT NULL DEFAULT 'TRANSLATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
