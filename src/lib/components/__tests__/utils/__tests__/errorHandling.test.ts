import { describe, test, expect, vi } from 'vitest';
import { TestError, createErrorHandler } from '../errorHandling';

describe('errorHandling', () => {
  describe('TestError', () => {
    test('creates error with context', () => {
      const error = new TestError('test message', { foo: 'bar' });
      expect(error.message).toBe('test message');
      expect(error.context).toEqual({ foo: 'bar' });
      expect(error.name).toBe('TestError');
    });
  });

  describe('createErrorHandler', () => {
    const config = {
      handlers: {
        find: (error, context) => new TestError(`Find error: ${error.message}`, context),
        verify: (error, context) => new TestError(`Verify error: ${error.message}`, context)
      },
      defaultMessage: 'Default error'
    };

    const handler = createErrorHandler(config);

    test('wrapQuery handles successful execution', () => {
      const result = handler.wrapQuery(
        () => 'success',
        'find',
        'element'
      );
      expect(result).toBe('success');
    });

    test('wrapQuery uses custom handler for known action', () => {
      expect(() => 
        handler.wrapQuery(
          () => { throw new Error('failed'); },
          'find',
          'element'
        )
      ).toThrow('Find error: failed');
    });

    test('wrapQuery uses default handler for unknown action', () => {
      expect(() => 
        handler.wrapQuery(
          () => { throw new Error('failed'); },
          'unknown',
          'element'
        )
      ).toThrow('Failed to unknown element: failed');
    });

    test('createError generates error with context', () => {
      const error = handler.createError('find', 'element', { extra: 'info' });
      expect(error.message).toBe('Failed to find element');
      expect(error.context).toEqual({
        action: 'find',
        target: 'element',
        extra: 'info'
      });
    });
  });
}); 