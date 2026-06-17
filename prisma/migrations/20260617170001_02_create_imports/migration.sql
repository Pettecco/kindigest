-- CreateTable
CREATE TABLE "Imports" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Imports" ADD CONSTRAINT "Imports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
