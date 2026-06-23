-- CreateTable
CREATE TABLE "Definitions" (
    "id" UUID NOT NULL,
    "wordId" UUID NOT NULL,
    "definition" VARCHAR(2000),
    "translatedDefinition" VARCHAR(2000),
    "source" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Definitions_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Definitions_wordId_key" ON "Definitions"("wordId");

-- CreateIndex
CREATE INDEX "Definitions_wordId_idx" ON "Definitions"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationUsage_month_key" ON "TranslationUsage"("month");

-- AddForeignKey
ALTER TABLE "Definitions" ADD CONSTRAINT "Definitions_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Words"("id") ON DELETE CASCADE ON UPDATE CASCADE;
