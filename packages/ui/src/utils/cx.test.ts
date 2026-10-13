import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins class names and ignores falsy values', () => {
    expect(cx('a', false, undefined, 'b')).toBe('a b');
  });

  it('ignores null and empty strings', () => {
    expect(cx('a', null, '', 'b')).toBe('a b');
  });

  it('returns an empty string when there is nothing to join', () => {
    expect(cx()).toBe('');
  });
});
