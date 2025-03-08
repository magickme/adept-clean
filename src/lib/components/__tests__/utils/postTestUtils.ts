import type { Post } from '$lib/types';
import { screen } from '@testing-library/svelte/svelte5';
import type { BaseTestUtils, DomQueries, TestData, Verifications } from './types';
import { BaseTestUtilsFactory } from './baseTestUtils';
import { testErrorHandler } from './errorHandling';
import { TEST_CONSTANTS } from './testConstants';

// Constants
export const POST_TEST_DATA = {
  DATES: TEST_CONSTANTS.DATES,
  EXCERPTS: {
    SHORT: TEST_CONSTANTS.TEXT.SHORT,
    LONG: TEST_CONSTANTS.TEXT.LONG
  },
  TAGS: [
    { name: 'Tag 1' },
    { name: 'Tag 2' }
  ],
  SELECTORS: {
    TAGS_CONTAINER: '.absolute.bottom-0.right-0.p-2',
    POST_IMAGE: TEST_CONSTANTS.SELECTORS.COMMON.IMAGE.replace('{alt}', ''),
    POST_LINK: (slug: string) => 
      TEST_CONSTANTS.SELECTORS.COMMON.LINK.replace('{href}', `/blog/${slug}`)
  }
} as const;

// Types
interface PostDomQueries extends DomQueries {
  posts: {
    getTimeElement(datetime: string): HTMLElement;
    getTagsContainer(): HTMLElement | null;
    getPostImage(container: HTMLElement): HTMLElement;
    getAuthorImage(name: string): HTMLImageElement;
  }
}

interface PostVerifications extends Verifications {
  postContent(post: Post): void;
  images(post: Post): void;
  accessibility(): void;
}

interface PostTestData extends TestData {
  createPost(overrides?: Partial<Post>): Post;
}

interface PostTestConfig {
  readonly maxExcerptLength: number;
  readonly defaultReadingTime: number;
  readonly defaultAuthorName: string;
}

const DEFAULT_CONFIG: PostTestConfig = {
  maxExcerptLength: 103,
  defaultReadingTime: 5,
  defaultAuthorName: 'Test Author'
} as const;

// Factory class
export class PostTestUtilsFactory extends BaseTestUtilsFactory<
  PostDomQueries,
  PostVerifications,
  PostTestData
> {
  private queries: PostDomQueries;

  constructor(
    private readonly config: PostTestConfig = DEFAULT_CONFIG
  ) {
    super(POST_TEST_DATA);
    this.queries = this.createDomQueries();
  }

  protected createDomQueries(): PostDomQueries {
    return {
      posts: {
        getTimeElement: (datetime: string) => 
          testErrorHandler.wrapQuery(
            () => screen.getByText((_, element) => 
              element?.tagName.toLowerCase() === 'time' && 
              element.getAttribute('datetime') === datetime
            ),
            'find',
            `time element with datetime "${datetime}"`,
            { datetime }
          ),

        getTagsContainer: () => 
          testErrorHandler.wrapQuery(
            () => {
              const container = screen.getByTestId('RelatedPosts')
                .querySelector(POST_TEST_DATA.SELECTORS.TAGS_CONTAINER);
              if (!container) {
                throw new Error('Tags container not found');
              }
              return container;
            },
            'find',
            'tags container'
          ),

        getPostImage: (container: HTMLElement): HTMLElement => {
          const img = screen.getByRole('img', { name: 'Test Post' });
          if (!img) {
            throw new Error('Post image not found');
          }
          return img;
        },

        getAuthorImage: (name: string) => 
          testErrorHandler.wrapQuery(
            () => {
              const img = screen.getByRole('img', { name });
              if (!(img instanceof HTMLImageElement)) {
                throw new Error('Element is not an image');
              }
              return img;
            },
            'find',
            `author image for "${name}"`
          )
      }
    };
  }

  protected createVerifications(): PostVerifications {
    return {
      postContent: (post: Post) => {
        testErrorHandler.wrapQuery(
          () => {
            expect(screen.getByText(post.title)).toBeInTheDocument();
            expect(screen.getByText(post.excerpt)).toBeInTheDocument();
            expect(screen.getByText(post.primary_author.name)).toBeInTheDocument();
            expect(screen.getByText(`${post.reading_time} min read`)).toBeInTheDocument();
          },
          'verify',
          'post content',
          { post }
        );
      },

      images: (post: Post) => {
        const { container } = screen;
        const postImage = this.queries.posts.getPostImage(container);
        const authorImage = this.queries.posts.getAuthorImage(post.primary_author?.name || '');

        if (post.feature_image) {
          expect(postImage).toHaveAttribute('src', post.feature_image);
        } else {
          expect(postImage).toHaveAttribute('src', '');
        }

        if (post.primary_author?.profile_image) {
          expect(authorImage).toHaveAttribute('src', post.primary_author.profile_image);
        } else {
          expect(authorImage).toHaveAttribute('src', '');
        }
      },

      accessibility: () => {
        testErrorHandler.wrapQuery(
          () => {
            expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
            expect(screen.getByRole('article')).toBeInTheDocument();
          },
          'verify',
          'accessibility requirements'
        );
      }
    };
  }

  protected createTestData(): PostTestData {
    return {
      createPost: (overrides?: Partial<Post>): Post => ({
        title: 'Test Post',
        slug: 'test-post',
        feature_image: '/test-image.jpg',
        published_at: POST_TEST_DATA.DATES.VALID,
        excerpt: 'Test excerpt',
        primary_author: {
          name: this.config.defaultAuthorName,
          profile_image: '/author-image.jpg'
        },
        reading_time: this.config.defaultReadingTime,
        tags: [{ name: 'Test Tag' }],
        ...overrides
      })
    };
  }
}

// Export factory instance
export const createPostTestUtils = () => {
  const factory = new PostTestUtilsFactory();
  return factory.create();
};

export type PostTestUtils = ReturnType<typeof createPostTestUtils>; 