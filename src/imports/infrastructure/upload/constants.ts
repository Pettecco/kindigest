import { join } from 'node:path';

export const MAX_VOCAB_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_EXTENSIONS = ['.db'];
export const TEMP_UPLOAD_DIR = join(process.cwd(), 'tmp', 'uploads');

export const EXPECTED_VOCAB_TABLES = ['BOOK_INFO', 'WORDS', 'LOOKUPS'];

export const MAX_VOCAB_ROWS = 50_000;

export const INVALID_FILENAME_CHARS = /[<>:"/\\|?*\x00-\x1f]/g;

export const CONTROL_CHARS = /[\x00-\x08\x0b\x0c\x0e-\x1f]/g;
