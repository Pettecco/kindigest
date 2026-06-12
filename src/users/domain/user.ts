import { PreferredDisplayMode } from '../../../generated/prisma/client.js';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  hashedRefreshToken: string | null;
  preferredDisplayMode: PreferredDisplayMode;
  createdAt: Date;
}
