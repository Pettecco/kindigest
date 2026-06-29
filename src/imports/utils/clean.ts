import { CONTROL_CHARS } from '../infrastructure/upload/constants';

export const clean = (value: string | null): string | null => {
  if (!value) return null;
  return value.replace(CONTROL_CHARS, '').trim() || null;
};
