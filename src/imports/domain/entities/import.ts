import { ImportStatus } from 'generated/prisma/client';

export interface Import {
  id: string;
  userId: string;
  originalFileName: string;
  status: ImportStatus;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  failedAt: Date | null;
  errorMessage: string | null;
}
