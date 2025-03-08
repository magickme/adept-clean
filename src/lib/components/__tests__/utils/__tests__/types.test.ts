import { describe, test, expect } from 'vitest';
import type { 
  DomQuery, 
  AsyncAction, 
  Verification, 
  TestQueries,
  TestVerifications,
  TestSelectors
} from '../types';

describe('test types', () => {
  test('DomQuery type can be implemented', () => {
    const query: DomQuery = () => document.createElement('div');
    expect(typeof query).toBe('function');
  });

  test('AsyncAction type can be implemented', async () => {
    const action: AsyncAction = async () => undefined;
    await expect(action()).resolves.toBeUndefined();
  });

  test('TestQueries interface can be implemented', () => {
    const queries: TestQueries = {
      getElement: () => document.createElement('div'),
      findByText: () => document.createElement('p')
    };
    expect(typeof queries.getElement).toBe('function');
  });

  test('TestVerifications interface can be implemented', () => {
    const verifications: TestVerifications = {
      checkVisibility: () => undefined,
      validateContent: () => undefined
    };
    expect(typeof verifications.checkVisibility).toBe('function');
  });

  test('TestSelectors interface can be implemented', () => {
    const selectors: TestSelectors = {
      container: '.container',
      button: (name: string) => `[aria-label="${name}"]`
    };
    expect(typeof selectors.container).toBe('string');
    expect(typeof selectors.button).toBe('function');
  });
}); 