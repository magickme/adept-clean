import { describe, test, expect } from 'vitest';
import { BaseTestUtilsFactory } from '../baseTestUtils';

describe('BaseTestUtilsFactory', () => {
  class TestFactory extends BaseTestUtilsFactory<any, any, any> {
    protected createDomQueries() {
      return {
        test: {
          getElement: () => document.createElement('div')
        }
      };
    }
    protected createVerifications() {
      return {
        test: () => true
      };
    }
    protected createTestData() {
      return {
        test: 'data'
      };
    }
  }

  test('validates config on construction', () => {
    expect(() => new TestFactory({}))
      .toThrow('Config must contain SELECTORS');

    expect(() => new TestFactory({ SELECTORS: {} }))
      .not.toThrow();
  });

  test('validates queries structure', () => {
    const factory = new TestFactory({ SELECTORS: {} });
    expect(() => factory.create()).not.toThrow();

    const invalidFactory = new TestFactory({ SELECTORS: {} });
    // @ts-ignore - Testing runtime validation
    invalidFactory.createDomQueries = () => ({ invalid: 'not an object' });
    
    expect(() => invalidFactory.create())
      .toThrow('Query group "invalid" must be an object');

    const invalidNestedFactory = new TestFactory({ SELECTORS: {} });
    // @ts-ignore - Testing runtime validation
    invalidNestedFactory.createDomQueries = () => ({
      test: { invalid: 'not a function' }
    });
    
    expect(() => invalidNestedFactory.create())
      .toThrow('Query "test.invalid" must be a function');
  });

  test('validates verifications structure', () => {
    const factory = new TestFactory({ SELECTORS: {} });
    expect(() => factory.create()).not.toThrow();

    const invalidFactory = new TestFactory({ SELECTORS: {} });
    // @ts-ignore - Testing runtime validation
    invalidFactory.createVerifications = () => ({ invalid: 'not a function' });
    
    expect(() => invalidFactory.create())
      .toThrow('Verification "invalid" must be a function');
  });

  test('creates complete test utils object', () => {
    const factory = new TestFactory({ SELECTORS: {} });
    const utils = factory.create();

    expect(utils).toHaveProperty('config');
    expect(utils).toHaveProperty('queries');
    expect(utils).toHaveProperty('verify');
    expect(utils).toHaveProperty('testData');
  });
}); 