-- CreateTable
CREATE TABLE "Word" (
    "id" UUID NOT NULL,
    "word" VARCHAR(100) NOT NULL,
    "stem" VARCHAR(100),
    "language" "Language" NOT NULL DEFAULT 'PT',
    "translatedWord" VARCHAR(255),

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_word_language_key" ON "Word"("word", "language");
