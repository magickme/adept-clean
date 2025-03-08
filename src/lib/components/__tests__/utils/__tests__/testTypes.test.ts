import { describe, test, expect } from 'vitest';
import type { 
  ComponentProps,
  SvelteConstructor,
  SvelteComponent,
  WithIndex,
  BaseTestUtils,
  TestUtilsFactory
} from '../testTypes';

describe('testTypes', () => {
  test('ComponentProps type works with Svelte components', () => {
    class TestComponent {
      $$prop_def!: { prop: string };
    }
    
    type Props = ComponentProps<typeof TestComponent>;
    const props: Props = { prop: 'test' };
    expect(props.prop).toBe('test');
  });

  test('SvelteConstructor type can be implemented', () => {
    const ctor: SvelteConstructor = class {
      constructor() {}
    };
    expect(new ctor()).toBeInstanceOf(ctor);
  });

  test('WithIndex type adds index signature', () => {
    interface Test {
      prop: string;
    }
    
    const obj: WithIndex<Test> = {
      prop: 'test',
      extra: 'value'
    };
    
    expect(obj.prop).toBe('test');
    expect(obj.extra).toBe('value');
  });
}); 