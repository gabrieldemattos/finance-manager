/*
  Warnings:

  - Added the required column `financeName` to the `Finance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Finance" ADD COLUMN     "financeName" TEXT NOT NULL;
