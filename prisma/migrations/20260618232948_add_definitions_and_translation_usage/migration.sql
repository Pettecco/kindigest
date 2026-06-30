-- CreateTable
CREATE TABLE "Definition" (
    "id" UUID NOT NULL,
    "wordId" UUID NOT NULL,
    "definition" VARCHAR(2000),
    "translatedDefinition" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Definition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationUsage" (
    "id" UUID NOT NULL,
    "month" INTEGER NOT NULL,
    "charsUsed" INTEGER NOT NULL DEFAULT 0,
    "limit" INTEGER NOT NULL DEFAULT 500000,

    CONSTRAINT "TranslationUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Definition_wordId_key" ON "Definition"("wordId");

-- CreateIndex
CREATE INDEX "Definition_wordId_idx" ON "Definition"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationUsage_month_key" ON "TranslationUsage"("month");

-- AddForeignKey
ALTER TABLE "Definition" ADD CONSTRAINT "Definition_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
