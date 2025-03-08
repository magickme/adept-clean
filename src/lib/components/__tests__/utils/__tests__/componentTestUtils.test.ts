import { describe, test, expect, vi } from 'vitest';
import { createComponentTestUtils } from '../componentTestUtils';
import type { ComponentType } from 'svelte';
import { render } from '@testing-library/svelte/svelte5';

// Mock the render function
vi.mock('@testing-library/svelte/svelte5', () => ({
  render: vi.fn()
}));

describe('componentTestUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const MockComponent = vi.fn() as unknown as ComponentType;

  const defaultConfig = {
    component: MockComponent,
    config: {
      selectors: { test: 'test-selector' },
      classes: { test: { base: 'test-class' } }
    },
    defaultProps: { prop: 'value' },
    createDomQueries: vi.fn(() => ({ test: { query: vi.fn() } })),
    createVerifications: vi.fn(() => ({ verify: vi.fn() })),
    createTestData: vi.fn(() => ({ data: 'test' }))
  };

  test('creates test utils with all required properties', () => {
    const utils = createComponentTestUtils(defaultConfig);
    expect(utils).toHaveProperty('config');
    expect(utils).toHaveProperty('setup');
    expect(utils).toHaveProperty('dom');
    expect(utils).toHaveProperty('actions');
    expect(utils).toHaveProperty('verify');
    expect(utils).toHaveProperty('testData');
  });

  test('setup merges default and custom props', () => {
    const utils = createComponentTestUtils(defaultConfig);
    const customProps = { customProp: 'custom' };
    
    utils.setup(customProps);
    
    expect(render).toHaveBeenCalledWith(MockComponent, {
      prop: 'value',
      customProp: 'custom'
    });
  });

  test('freezes config and utility objects', () => {
    const utils = createComponentTestUtils(defaultConfig);
    expect(Object.isFrozen(utils.config)).toBe(true);
    expect(Object.isFrozen(utils.dom)).toBe(true);
    expect(Object.isFrozen(utils.actions)).toBe(true);
    expect(Object.isFrozen(utils.verify)).toBe(true);
    expect(Object.isFrozen(utils.testData)).toBe(true);
  });
}); 