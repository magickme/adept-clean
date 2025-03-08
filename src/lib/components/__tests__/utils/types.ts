import type { ComponentType, SvelteComponent } from 'svelte';
import type { RenderResult } from '@testing-library/svelte';

// Core types for test utilities
export type DomQuery<T = HTMLElement | HTMLElement[]> = (...args: any[]) => T;
export type AsyncAction<TArgs extends any[] = any[], TReturn = void> = 
  (...args: TArgs) => Promise<TReturn>;
export type Verification<TArgs extends any[] = any[]> = (...args: TArgs) => void;

// Configuration interfaces
export interface BaseConfig {
  readonly selectors: Readonly<Record<string, string>>;
  readonly classes: Readonly<Record<string, Record<string, string>>>;
}

// Query and action interfaces
export interface DomQueries {
  readonly [category: string]: Readonly<Record<string, DomQuery>>;
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

// Component test configuration
export interface TestUtilsConfig<TConfig extends BaseConfig> {
  readonly config: TConfig;
  readonly defaultProps: Record<string, unknown>;
}

// Test utilities result interface
export interface BaseTestUtils<
  TComponent,
  TProps extends Record<string, any>,
  TConfig extends BaseConfig
> {
  readonly config: Readonly<TConfig>;
  setup(customProps?: Partial<TProps>): RenderResult<TComponent>;
  readonly dom: Readonly<DomQueries>;
  readonly actions: Readonly<Actions>;
  readonly verify: Readonly<Verifications>;
  readonly testData: Readonly<TestData>;
}

// Factory method type
export type TestUtilsFactory<
  TComponent,
  TProps extends Record<string, any>,
  TConfig extends BaseConfig
> = () => BaseTestUtils<TComponent, TProps, TConfig>;

export interface TestQueries {
  [key: string]: (...args: any[]) => HTMLElement | null | undefined;
}

export interface TestVerifications {
  [key: string]: (...args: any[]) => void;
}

export interface TestSelectors {
  [key: string]: string | ((...args: any[]) => string);
} 