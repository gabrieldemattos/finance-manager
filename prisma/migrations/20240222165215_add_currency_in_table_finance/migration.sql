/*
  Warnings:

  - Added the required column `currency` to the `Finance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Finance" ADD COLUMN     "currency" TEXT NOT NULL;
