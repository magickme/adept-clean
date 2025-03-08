export interface TestConfig {
  readonly timeouts: {
    readonly render: number;
    readonly animation: number;
    readonly network: number;
    readonly interaction: number;
  };
  readonly limits: {
    readonly maxTextLength: number;
    readonly maxArrayLength: number;
    readonly maxNestedDepth: number;
  };
  readonly features: {
    readonly useRealTimers: boolean;
    readonly mockNetwork: boolean;
    readonly isolateComponents: boolean;
  };
  readonly environment: {
    readonly isCi: boolean;
    readonly isDebug: boolean;
    readonly testEnv: 'unit' | 'integration' | 'e2e';
  };
}

const DEFAULT_CONFIG: TestConfig = {
  timeouts: {
    render: 1000,
    animation: 300,
    network: 5000,
    interaction: 100
  },
  limits: {
    maxTextLength: 1000,
    maxArrayLength: 100,
    maxNestedDepth: 3
  },
  features: {
    useRealTimers: false,
    mockNetwork: true,
    isolateComponents: true
  },
  environment: {
    isCi: process.env.CI === 'true',
    isDebug: process.env.DEBUG === 'true',
    testEnv: (process.env.TEST_ENV || 'unit') as TestConfig['environment']['testEnv']
  }
};

function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.keys(obj).forEach(prop => {
    const value = obj[prop as keyof T];
    if (value && typeof value === 'object') {
      deepFreeze(value as object);
    }
  });
  return Object.freeze(obj);
}

export const getTestConfig = (overrides?: Partial<TestConfig>): Readonly<TestConfig> => {
  const baseConfig = structuredClone(DEFAULT_CONFIG);
  
  if (overrides) {
    Object.entries(overrides).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        Object.assign(baseConfig[key as keyof TestConfig], value);
      } else {
        (baseConfig as any)[key] = value;
      }
    });
  }
  
  return deepFreeze(baseConfig);
};

const frozenConfig = deepFreeze(structuredClone(DEFAULT_CONFIG));
export const testConfig = frozenConfig; 