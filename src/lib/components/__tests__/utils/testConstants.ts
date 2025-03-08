export const TEST_CONSTANTS = {
  DATES: {
    VALID: '2024-01-01T00:00:00.000Z',
    INVALID: 'invalid-date',
    FUTURE: '2025-01-01T00:00:00.000Z',
    PAST: '2023-01-01T00:00:00.000Z'
  },
  TEXT: {
    SHORT: 'Short text',
    LONG: 'a'.repeat(200),
    EMPTY: '',
    WHITESPACE: '   ',
    SPECIAL_CHARS: '<script>alert("xss")</script>'
  },
  IMAGES: {
    VALID: '/test-image.jpg',
    INVALID: 'not-an-image',
    EMPTY: '',
    SVG: '<svg></svg>'
  },
  ROLES: {
    ARTICLE: 'article',
    HEADING: 'heading',
    IMAGE: 'img',
    TIME: 'time',
    LINK: 'link'
  },
  ARIA: {
    LABELS: {
      AUTHOR: 'Author',
      POST: 'Post',
      TIME: 'Publication date'
    }
  },
  SELECTORS: {
    COMMON: {
      CONTAINER: '[data-testid="{id}"]',
      HEADING: 'h{level}',
      IMAGE: 'img[alt="{alt}"]',
      LINK: 'a[href="{href}"]'
    }
  }
} as const;

export type TestConstant = typeof TEST_CONSTANTS; 