import { clean } from '../../../src/imports/utils/clean';

describe('clean', () => {
  it('should return null for null input', () => {
    expect(clean(null)).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(clean('')).toBeNull();
  });

  it('should return null for whitespace-only string', () => {
    expect(clean('   ')).toBeNull();
  });

  it('should trim leading and trailing whitespace', () => {
    expect(clean('  hello  ')).toBe('hello');
  });

  it('should strip control characters', () => {
    expect(clean('hel\x00lo')).toBe('hello');
  });

  it('should preserve printable characters', () => {
    expect(clean('café résumé')).toBe('café résumé');
  });

  it('should preserve tabs and newlines', () => {
    expect(clean('hello\tworld\n')).toBe('hello\tworld');
  });

  it('should strip null bytes', () => {
    expect(clean('test\x00word')).toBe('testword');
  });

  it('should return null when only control chars remain', () => {
    expect(clean('\x00\x01\x02')).toBeNull();
  });
});
