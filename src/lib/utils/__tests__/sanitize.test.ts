import { describe, test, expect } from 'vitest';
import DOMPurify from 'isomorphic-dompurify';
import { sanitizeHtml } from '../sanitize';

vi.mock('isomorphic-dompurify', () => ({
  default: {
    sanitize: vi.fn((html) => html)
  }
}));

describe('sanitizeHtml', () => {
  test('calls DOMPurify.sanitize with input', () => {
    const html = '<p>Test</p>';
    sanitizeHtml(html);
    expect(DOMPurify.sanitize).toHaveBeenCalledWith(html);
  });

  test('handles empty input', () => {
    sanitizeHtml('');
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('');
  });

  test('handles null/undefined', () => {
    sanitizeHtml();
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('');
  });
}); 