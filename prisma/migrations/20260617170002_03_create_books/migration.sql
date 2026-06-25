-- CreateTable
CREATE TABLE "Books" (
    "id" UUID NOT NULL,
    "kindleBookId" VARCHAR(10) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255) NOT NULL,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Books_kindleBookId_key" ON "Books"("kindleBookId");
