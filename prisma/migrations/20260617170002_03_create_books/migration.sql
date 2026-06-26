-- CreateTable
CREATE TABLE "Book" (
    "id" UUID NOT NULL,
    "kindleBookId" VARCHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_kindleBookId_key" ON "Book"("kindleBookId");
