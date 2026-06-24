import { PreferredDisplayMode } from 'generated/prisma/client';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  hashedRefreshToken: string | null;
  preferredDisplayMode: PreferredDisplayMode;
  createdAt: Date;
}
