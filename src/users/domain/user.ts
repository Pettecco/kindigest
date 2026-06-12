import { PreferredDisplayMode } from '../../../generated/prisma/client.js';

export interface User {
  id: string;
  email: string;
  preferredDisplayMode: PreferredDisplayMode;
  createdAt: Date;
}
