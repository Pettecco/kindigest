-- CreateTable
CREATE TABLE "Words" (
    "id" UUID NOT NULL,
    "word" VARCHAR(100) NOT NULL,
    "stem" VARCHAR(100),
    "language" "Language" NOT NULL DEFAULT 'PT',
    "translatedWord" VARCHAR(255),

    CONSTRAINT "Words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Words_word_language_key" ON "Words"("word", "language");
