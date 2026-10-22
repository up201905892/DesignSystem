import { afterEach, describe, expect, it } from 'vitest';
import { readSpaceToken } from './spaceToken';

afterEach(() => {
  document.documentElement.removeAttribute('style');
});

describe('readSpaceToken', () => {
  it('converts a rem token to pixels using the root font size', () => {
    document.documentElement.style.setProperty('--ds-space-2', '0.5rem');
    document.documentElement.style.fontSize = '20px';
    expect(readSpaceToken('2')).toBe(10);
  });

  it('reads px values as they are', () => {
    document.documentElement.style.setProperty('--ds-space-1', '4px');
    expect(readSpaceToken('1')).toBe(4);
  });

  it('returns the fallback when the token is not defined', () => {
    expect(readSpaceToken('3')).toBe(0);
    expect(readSpaceToken('3', 7)).toBe(7);
  });
});
