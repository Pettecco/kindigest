-- CreateTable
CREATE TABLE "Books" (
    "id" UUID NOT NULL,
    "kindleBookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Books_kindleBookId_key" ON "Books"("kindleBookId");
