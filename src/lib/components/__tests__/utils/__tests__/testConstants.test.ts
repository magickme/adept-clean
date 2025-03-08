import { describe, test, expect } from 'vitest';
import { TEST_CONSTANTS } from '../testConstants';

describe('testConstants', () => {
  test('provides valid date constants', () => {
    expect(Date.parse(TEST_CONSTANTS.DATES.VALID)).not.toBeNaN();
    expect(Date.parse(TEST_CONSTANTS.DATES.FUTURE)).not.toBeNaN();
    expect(Date.parse(TEST_CONSTANTS.DATES.PAST)).not.toBeNaN();
  });

  test('provides text constants', () => {
    expect(TEST_CONSTANTS.TEXT.SHORT.length).toBeLessThan(20);
    expect(TEST_CONSTANTS.TEXT.LONG.length).toBeGreaterThan(100);
    expect(TEST_CONSTANTS.TEXT.SPECIAL_CHARS).toContain('script');
  });

  test('provides valid selectors', () => {
    const { SELECTORS } = TEST_CONSTANTS;
    expect(SELECTORS.COMMON.CONTAINER).toContain('data-testid');
    expect(SELECTORS.COMMON.HEADING).toContain('h{level}');
    expect(SELECTORS.COMMON.IMAGE).toContain('alt');
    expect(SELECTORS.COMMON.LINK).toContain('href');
  });
}); 