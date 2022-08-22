-- CreateTable
CREATE TABLE "recipes" (
    "id" UUID NOT NULL,
    "hash" TEXT NOT NULL,
    "ingredients" JSONB NOT NULL,
    "nutrition" JSONB NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipes_hash_key" ON "recipes"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_slug_key" ON "recipes"("slug");

-- CreateIndex
CREATE INDEX "recipes_hash_idx" ON "recipes"("hash");

-- CreateIndex
CREATE INDEX "recipes_slug_idx" ON "recipes"("slug");
