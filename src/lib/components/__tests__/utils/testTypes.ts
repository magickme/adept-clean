import type { ComponentType } from 'svelte';
import type { RenderResult } from '@testing-library/svelte';

// Core test utility types
export type DomQuery<TReturn = HTMLElement | HTMLElement[], TArgs extends any[] = any[]> = 
  (...args: TArgs) => TReturn;

export type AsyncAction<TArgs extends any[] = any[], TReturn = void> = 
  (...args: TArgs) => Promise<TReturn>;

export type Verification<TArgs extends any[] = any[]> = 
  (...args: TArgs) => void | Promise<void>;

// Configuration types
export interface BaseSelectors {
  readonly [key: string]: string;
}

export interface BaseClasses {
  readonly [key: string]: {
    readonly [key: string]: string;
  };
}

export interface BaseConfig<
  TSelectors extends BaseSelectors = BaseSelectors,
  TClasses extends BaseClasses = BaseClasses
> {
  readonly selectors: TSelectors;
  readonly classes: TClasses;
}

// Component test types
export interface DomCategory<TQueries extends Record<string, DomQuery>> {
  readonly [K in keyof TQueries]: TQueries[K];
}

export interface DomQueries {
  readonly [category: string]: DomCategory<Record<string, DomQuery>>;
}

export interface Actions {
  readonly [actionName: string]: AsyncAction;
}

export interface Verifications {
  readonly [verificationName: string]: Verification;
}

export interface TestData {
  readonly [key: string]: unknown;
}

// Component configuration
export interface ComponentConfig<
  TSelectors extends BaseSelectors,
  TClasses extends BaseClasses
> extends BaseConfig<TSelectors, TClasses> {}

// Props type helper
export type ComponentProps<T> = T extends ComponentType<infer P> ? P : Record<string, any>;

// Test utilities interface
export interface BaseTestUtils<
  TComponent extends ComponentType,
  TProps,
  TConfig extends BaseConfig
> {
  readonly config: Readonly<TConfig>;
  setup(customProps?: Partial<TProps>): RenderResult & {
    component: TComponent;
  };
  readonly dom: Readonly<DomQueries>;
  readonly actions: Readonly<Actions>;
  readonly verify: Readonly<Verifications>;
  readonly testData: Readonly<TestData>;
}

// Factory type
export type TestUtilsFactory<
  TComponent extends ComponentType,
  TProps,
  TConfig extends BaseConfig
> = () => BaseTestUtils<TComponent, TProps, TConfig>;

// Component type utilities
export type SvelteConstructor = new (...args: any[]) => any;
export type SvelteComponent = ReturnType<SvelteConstructor>;

// Index signature helper
export type WithIndex<T> = T & { [key: string]: any };