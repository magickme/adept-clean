import type { ComponentType } from 'svelte';
import { render } from '@testing-library/svelte/svelte5';
import type { BaseConfig, DomQueries, Actions, Verifications, TestData } from './types';

export interface ComponentTestConfig<TSelectors extends Record<string, string>, TClasses extends Record<string, Record<string, string>>> extends BaseConfig {
  readonly selectors: TSelectors;
  readonly classes: TClasses;
}

interface ComponentTestFactoryConfig<
  TComponent extends ComponentType,
  TProps extends Record<string, any>,
  TConfig extends ComponentTestConfig<any, any>
> {
  readonly component: TComponent;
  readonly config: TConfig;
  readonly defaultProps: TProps;
  readonly createDomQueries: (config: TConfig) => DomQueries;
  readonly createActions?: () => Actions;
  readonly createVerifications: (config: TConfig) => Verifications;
  readonly createTestData: () => TestData;
}

export function createComponentTestUtils<
  TComponent extends ComponentType,
  TProps extends Record<string, any>,
  TConfig extends ComponentTestConfig<any, any>
>(factoryConfig: ComponentTestFactoryConfig<TComponent, TProps, TConfig>) {
  const {
    component,
    config,
    defaultProps,
    createDomQueries,
    createActions = () => ({}),
    createVerifications,
    createTestData
  } = factoryConfig;

  function setup(customProps: Partial<TProps> = {}) {
    const props = { ...defaultProps, ...customProps };
    return render(component, props);
  }

  return Object.freeze({
    config: Object.freeze(config),
    setup,
    dom: Object.freeze(createDomQueries(config)),
    actions: Object.freeze(createActions()),
    verify: Object.freeze(createVerifications(config)),
    testData: Object.freeze(createTestData())
  });
} 