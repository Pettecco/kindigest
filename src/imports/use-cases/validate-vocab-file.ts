import { BadRequestException } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { extname } from 'node:path';
import Database from 'better-sqlite3';
import {
  ALLOWED_EXTENSIONS,
  INVALID_FILENAME_CHARS,
  EXPECTED_VOCAB_TABLES,
} from '../infrastructure/upload/constants';

export function validateVocabFile(filePath: string, originalName: string): void {
  const sanitized = originalName.replace(INVALID_FILENAME_CHARS, '');

  if (sanitized !== originalName) {
    throw new BadRequestException(
      'Filename contains invalid characters ( < > : " / \\ | ? * )',
    );
  }

  const extension = extname(originalName).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new BadRequestException(
      `Invalid file extension "${extension}". Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed.`,
    );
  }

  if (!existsSync(filePath)) {
    throw new BadRequestException('Uploaded file not found on disk');
  }

  let db: Database.Database | null = null;

  try {
    db = new Database(filePath, { readonly: true });

    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all() as { name: string }[];

    const tableNames = new Set(tables.map((t) => t.name));

    for (const table of EXPECTED_VOCAB_TABLES) {
      if (!tableNames.has(table)) {
        throw new BadRequestException(
          `Invalid vocab file: missing "${table}" table. Expected a Kindle vocab.db file.`,
        );
      }
    }
  } catch (error) {
    if (error instanceof BadRequestException) throw error;

    throw new BadRequestException(
      'Invalid vocab file: unable to open as a Kindle vocabulary database.',
    );
  } finally {
    db?.close();
  }
}
