-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "importId" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "wordId" UUID NOT NULL,
    "context" VARCHAR(2000),
    "learnCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vocabulary_userId_createdAt_idx" ON "Vocabulary"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Vocabulary_userId_learnCount_idx" ON "Vocabulary"("userId", "learnCount");

-- CreateIndex
CREATE UNIQUE INDEX "Vocabulary_userId_bookId_wordId_key" ON "Vocabulary"("userId", "bookId", "wordId");

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
