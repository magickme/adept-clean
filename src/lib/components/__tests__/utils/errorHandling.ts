type ErrorHandler = (error: Error, context: Record<string, any>) => Error;

export interface ErrorConfig {
  readonly handlers: Record<string, ErrorHandler>;
  readonly defaultMessage: string;
}

export class TestError extends Error {
  constructor(
    message: string,
    public readonly context: Record<string, any> = {}
  ) {
    super(message);
    this.name = 'TestError';
  }
}

export const createErrorHandler = (config: ErrorConfig) => {
  return {
    wrapQuery: <T>(
      queryFn: () => T,
      action: string,
      target: string,
      context: Record<string, any> = {}
    ): T => {
      try {
        return queryFn();
      } catch (error) {
        const handler = config.handlers[action] || defaultHandler;
        throw handler(error as Error, { action, target, ...context });
      }
    },
    
    createError: (
      action: string,
      target: string,
      context: Record<string, any> = {}
    ) => {
      return new TestError(
        `Failed to ${action} ${target}`,
        { action, target, ...context }
      );
    }
  };
};

const defaultHandler: ErrorHandler = (error, { action, target }) => 
  new TestError(
    `Failed to ${action} ${target}: ${error.message}`,
    { action, target, originalError: error }
  );

export const testErrorHandler = createErrorHandler({
  handlers: {
    find: (error, context) => 
      new TestError(
        `Element not found: ${context.target}`,
        { ...context, originalError: error }
      ),
    verify: (error, context) => 
      new TestError(
        `Verification failed: ${context.target}`,
        { ...context, originalError: error }
      )
  },
  defaultMessage: 'Test operation failed'
}); 