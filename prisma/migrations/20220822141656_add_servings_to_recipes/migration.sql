/*
  Warnings:

  - Added the required column `servings` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "servings" JSONB NOT NULL;
