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
} as const;

export const testConfig = Object.freeze({
  timeouts: Object.freeze({
    render: 1000,
    animation: 300,
    network: 5000,
    interaction: 100
  }),
  limits: Object.freeze({
    maxTextLength: 1000,
    maxArrayLength: 100,
    maxNestedDepth: 3
  }),
  features: Object.freeze({
    useRealTimers: false,
    mockNetwork: true,
    isolateComponents: true
  }),
  environment: Object.freeze({
    isTest: true,
    isDevelopment: false
  })
});

export const getTestConfig = (overrides: Partial<typeof testConfig>) => {
  return Object.freeze({
    ...testConfig,
    ...overrides,
    timeouts: Object.freeze({
      ...testConfig.timeouts,
      ...overrides.timeouts
    }),
    features: Object.freeze({
      ...testConfig.features,
      ...overrides.features
    })
  });
}; 