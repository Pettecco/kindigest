-- CreateTable
CREATE TABLE "Import" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "originalFileName" VARCHAR(255) NOT NULL,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "errorMessage" VARCHAR(1000),

    CONSTRAINT "Import_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Import" ADD CONSTRAINT "Import_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
