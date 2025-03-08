import { describe, test, expect } from 'vitest';
import { getTestConfig, testConfig } from '../testConfig';

describe('testConfig', () => {
  test('provides default timeouts', () => {
    expect(testConfig.timeouts).toEqual({
      render: 1000,
      animation: 300,
      network: 5000,
      interaction: 100
    });
  });

  test('provides default limits', () => {
    expect(testConfig.limits).toEqual({
      maxTextLength: 1000,
      maxArrayLength: 100,
      maxNestedDepth: 3
    });
  });

  test('provides default features', () => {
    expect(testConfig.features).toEqual({
      useRealTimers: false,
      mockNetwork: true,
      isolateComponents: true
    });
  });

  test('getTestConfig allows partial overrides', () => {
    const custom = getTestConfig({
      timeouts: { render: 2000 },
      features: { mockNetwork: false }
    });

    expect(custom.timeouts.render).toBe(2000);
    expect(custom.timeouts.animation).toBe(testConfig.timeouts.animation);
    expect(custom.features.mockNetwork).toBe(false);
    expect(custom.features.isolateComponents).toBe(true);
  });

  test('configuration is deeply frozen', () => {
    expect(Object.isFrozen(testConfig)).toBe(true);
    expect(Object.isFrozen(testConfig.timeouts)).toBe(true);
    expect(Object.isFrozen(testConfig.limits)).toBe(true);
    expect(Object.isFrozen(testConfig.features)).toBe(true);
    expect(Object.isFrozen(testConfig.environment)).toBe(true);
  });
}); 