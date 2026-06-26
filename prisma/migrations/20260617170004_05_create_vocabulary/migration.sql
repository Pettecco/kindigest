-- CreateTable
CREATE TABLE "WordLearning" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "importId" UUID NOT NULL,
    "bookId" UUID NOT NULL,
    "wordId" UUID NOT NULL,
    "context" VARCHAR(2000),
    "learnCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WordLearning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WordLearning_userId_createdAt_idx" ON "WordLearning"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "WordLearning_userId_learnCount_idx" ON "WordLearning"("userId", "learnCount");

-- CreateIndex
CREATE UNIQUE INDEX "WordLearning_userId_bookId_wordId_key" ON "WordLearning"("userId", "bookId", "wordId");

-- AddForeignKey
ALTER TABLE "WordLearning" ADD CONSTRAINT "WordLearning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordLearning" ADD CONSTRAINT "WordLearning_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordLearning" ADD CONSTRAINT "WordLearning_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordLearning" ADD CONSTRAINT "WordLearning_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
