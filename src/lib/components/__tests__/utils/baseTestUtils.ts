import type { DomQueries, TestData, Verifications } from './types';

export abstract class BaseTestUtilsFactory<
  TQueries extends DomQueries,
  TVerifications extends Verifications,
  TTestData extends TestData
> {
  protected readonly config: Record<string, any>;

  constructor(config: Record<string, any>) {
    this.config = config;
    this.validateConfig();
  }

  private validateConfig() {
    if (!this.config || typeof this.config !== 'object') {
      throw new Error('Config must be a valid object');
    }
    if (!this.config.SELECTORS) {
      throw new Error('Config must contain SELECTORS');
    }
  }

  protected validateQueries(queries: TQueries): asserts queries is TQueries {
    if (!queries || typeof queries !== 'object') {
      throw new Error('Queries must be a valid object');
    }
    Object.entries(queries).forEach(([key, value]) => {
      if (typeof value !== 'object') {
        throw new Error(`Query group "${key}" must be an object`);
      }
      Object.entries(value as Record<string, unknown>).forEach(([queryKey, queryValue]) => {
        if (typeof queryValue !== 'function') {
          throw new Error(`Query "${key}.${queryKey}" must be a function`);
        }
      });
    });
  }

  protected validateVerifications(verifications: TVerifications): asserts verifications is TVerifications {
    if (!verifications || typeof verifications !== 'object') {
      throw new Error('Verifications must be a valid object');
    }
    Object.entries(verifications).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
          if (typeof nestedValue !== 'function') {
            throw new Error(`Verification "${key}.${nestedKey}" must be a function`);
          }
        });
      } else if (typeof value !== 'function') {
        throw new Error(`Verification "${key}" must be a function`);
      }
    });
  }

  protected abstract createDomQueries(): TQueries;
  protected abstract createVerifications(): TVerifications;
  protected abstract createTestData(): TTestData;

  public create() {
    const queries = this.createDomQueries();
    const verifications = this.createVerifications();
    const testData = this.createTestData();

    this.validateQueries(queries);
    this.validateVerifications(verifications);

    return {
      config: this.config,
      queries,
      verify: verifications,
      testData
    };
  }
} 