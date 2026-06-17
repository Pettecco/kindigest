-- CreateTable
CREATE TABLE "Words" (
    "id" UUID NOT NULL,
    "word" TEXT NOT NULL,
    "stem" TEXT,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "translatedWord" TEXT,

    CONSTRAINT "Words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Words_word_language_key" ON "Words"("word", "language");
