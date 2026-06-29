import { join } from 'node:path';

export const MAX_VOCAB_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_EXTENSIONS = ['.db'];
export const TEMP_UPLOAD_DIR = join(process.cwd(), 'tmp', 'uploads');
