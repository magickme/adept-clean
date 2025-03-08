import { render, screen } from '@testing-library/svelte/svelte5';
import { expect, describe, it } from 'vitest';
import RelatedPosts from '../RelatedPosts.svelte';
import type { Post } from '$lib/types';

describe('RelatedPosts', () => {
  // Constants
  const SELECTORS = {
    excerpt: '.text-gray-500.dark\\:text-gray-300',
    container: '[data-testid="RelatedPosts"]'
  } as const;

  const TEST_IDS = {
    container: 'RelatedPosts'
  } as const;

  const TEXTS = {
    heading: 'Browse related articles',
    readingTime: 'min read'
  } as const;

  const CLASSES = {
    darkMode: {
      container: 'dark:bg-kohl',
      article: 'dark:bg-gray-800'
    }
  } as const;

  const PERFORMANCE = {
    renderThreshold: 100, // ms
    maxPosts: 50
  } as const;

  // Types
  interface SetupResult {
    container: HTMLElement;
    getContainer: () => HTMLElement;
    getArticles: () => HTMLElement[];
    getTimeElements: () => NodeListOf<HTMLTimeElement>;
    getFeatureImage: (article: HTMLElement) => HTMLImageElement | null;
    getTitleLink: (title: string) => HTMLAnchorElement | null;
    getExcerptElement: (article: HTMLElement) => HTMLParagraphElement | null;
  }

  // Test data factory
  const createMockPost = (overrides: Partial<Post> = {}): Post => ({
    title: 'Test Post 1',
    slug: 'test-post-1',
    feature_image: '/test1.jpg',
    published_at: '2024-01-01T00:00:00.000Z',
    excerpt: 'Test excerpt 1',
    author: {
      name: 'John Doe',
      profile_image: '/author1.jpg'
    },
    reading_time: 5,
    tags: ['tag1', 'tag2'],
    ...overrides
  });

  const createMockPosts = (count = 2): Post[] => 
    Array(count).fill(null).map((_, index) => 
      createMockPost({
        title: `Test Post ${index + 1}`,
        slug: `test-post-${index + 1}`,
        feature_image: `/test${index + 1}.jpg`,
        published_at: new Date(2024, 0, index + 1).toISOString(),
        author: {
          name: index === 0 ? 'John Doe' : 'Jane Smith',
          profile_image: `/author${index + 1}.jpg`
        },
        reading_time: 5 * (index + 1),
        tags: index === 0 ? ['tag1', 'tag2'] : ['tag3']
      })
    );

  // Helper functions
  const setup = (posts: Post[] = createMockPosts()): SetupResult => {
    const utils = render(RelatedPosts, { relatedPosts: posts });
    
    return {
      ...utils,
      getContainer: () => screen.getByTestId(TEST_IDS.container),
      getArticles: () => Array.from(screen.getAllByRole('article')),
      getTimeElements: () => utils.container.querySelectorAll('time'),
      getFeatureImage: (article: HTMLElement) => article.querySelector('img'),
      getTitleLink: (title: string) => screen.getByText(title).closest('a'),
      getExcerptElement: (article: HTMLElement) => 
        article.querySelector<HTMLParagraphElement>(SELECTORS.excerpt)
    };
  };

  // Test groups
  describe('rendering', () => {
    it('renders the component with correct structure', () => {
      const { getContainer, getArticles } = setup();
      
      expect(getContainer()).toBeInTheDocument();
      expect(screen.getByText(TEXTS.heading)).toBeInTheDocument();
      expect(getArticles()).toHaveLength(2);
    });

    it('handles empty posts array gracefully', () => {
      const { getContainer } = setup([]);
      
      expect(getContainer()).toBeInTheDocument();
      expect(screen.queryByRole('article')).not.toBeInTheDocument();
    });

    it('matches snapshot', () => {
      const { container } = setup();
      // Clean up Svelte-generated comments before snapshot
      const cleanContainer = container.cloneNode(true) as HTMLElement;
      Array.from(cleanContainer.querySelectorAll('*'))
        .forEach(element => {
          // Remove comment nodes
          element.childNodes.forEach(node => {
            if (node.nodeType === Node.COMMENT_NODE) {
              node.remove();
            }
          });
        });
      
      expect(cleanContainer).toMatchSnapshot();
    });
  });

  describe('content', () => {
    describe('post details', () => {
      it('renders post content correctly', () => {
        const mockPost = createMockPost();
        const { getArticles, getFeatureImage, getTitleLink } = setup([mockPost]);
        
        const article = getArticles()[0];
        
        // Image
        const featureImage = getFeatureImage(article);
        expect(featureImage).toHaveAttribute('src', mockPost.feature_image);
        
        // Title and link
        const titleLink = getTitleLink(mockPost.title);
        expect(titleLink).toHaveAttribute('href', `/blog/${mockPost.slug}`);
        
        // Date
        const timeElement = article.querySelector('time');
        expect(timeElement).toHaveAttribute('datetime', mockPost.published_at);
        
        // Author
        expect(screen.getByText(mockPost.author.name)).toBeInTheDocument();
        const authorImage = screen.getByAltText(mockPost.author.name);
        expect(authorImage).toHaveAttribute('src', mockPost.author.profile_image);
        
        // Reading time
        expect(screen.getByText(`${mockPost.reading_time} ${TEXTS.readingTime}`)).toBeInTheDocument();
        
        // Tags
        mockPost.tags.forEach(tag => {
          expect(screen.getByText(tag)).toBeInTheDocument();
        });
      });

      it('handles malformed post data gracefully', () => {
        const malformedPost = createMockPost({ 
          author: undefined,
          tags: undefined,
          feature_image: undefined,
          reading_time: undefined
        } as any);
        
        const { getArticles, getFeatureImage } = setup([malformedPost]);
        const article = getArticles()[0];
        
        expect(article).toBeInTheDocument();
        expect(getFeatureImage(article)).toHaveAttribute('alt', '');
        expect(screen.queryByText(`${malformedPost.reading_time} ${TEXTS.readingTime}`))
          .not.toBeInTheDocument();
      });

      describe('error handling', () => {
        it('handles missing author data gracefully', () => {
          const postWithoutAuthor = createMockPost({ 
            author: {
              name: '',
              profile_image: ''
            }
          });
          
          const { getArticles } = setup([postWithoutAuthor]);
          const article = getArticles()[0];
          
          expect(article).toBeInTheDocument();
          const authorImage = article.querySelector('.h-10.w-10.rounded-full');
          expect(authorImage).toHaveAttribute('src', '');
          expect(authorImage).toHaveAttribute('alt', '');
        });

        it('handles completely malformed post data gracefully', () => {
          const malformedPost = {
            title: '',
            slug: '',
            feature_image: '',
            published_at: '',
            excerpt: '',
            author: null,
            reading_time: null,
            tags: null
          } as unknown as Post;
          
          const { getArticles, getFeatureImage } = setup([malformedPost]);
          const article = getArticles()[0];
          
          expect(article).toBeInTheDocument();
          expect(getFeatureImage(article)).toHaveAttribute('alt', '');
          expect(screen.queryByText('null min read')).not.toBeInTheDocument();
        });

        it('handles undefined post properties gracefully', () => {
          const postWithUndefinedProps = createMockPost({
            feature_image: undefined,
            excerpt: undefined,
            reading_time: undefined,
            tags: undefined,
            author: undefined
          } as Partial<Post>);
          
          const { getArticles } = setup([postWithUndefinedProps]);
          expect(getArticles()).toHaveLength(1);
        });
      });
    });

    describe('text handling', () => {
      it('truncates long excerpts correctly', () => {
        const longText = 'a'.repeat(150);
        const mockPost = createMockPost({ excerpt: longText });
        const { getArticles, getExcerptElement } = setup([mockPost]);
        
        const article = getArticles()[0];
        const excerptElement = getExcerptElement(article);
        
        expect(excerptElement).toBeInTheDocument();
        expect(excerptElement?.textContent?.length).toBeLessThanOrEqual(103);
        expect(excerptElement?.textContent?.endsWith('...')).toBe(true);
      });
    });
  });

  describe('accessibility', () => {
    it('meets accessibility requirements', () => {
      setup();
      
      // Images have alt text
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });

      // Links are accessible
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });

      // Heading hierarchy is correct
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent(TEXTS.heading);
    });
  });

  describe('dates', () => {
    it('formats dates correctly', () => {
      const mockPosts = createMockPosts();
      const { getTimeElements } = setup(mockPosts);
      
      const timeElements = getTimeElements();
      expect(timeElements[0]).toHaveAttribute('datetime', mockPosts[0].published_at);
      expect(timeElements[1]).toHaveAttribute('datetime', mockPosts[1].published_at);
    });
  });

  describe('styling', () => {
    it('includes dark mode classes', () => {
      const { getContainer, getArticles } = setup();
      
      expect(getContainer()).toHaveClass(CLASSES.darkMode.container);
      
      getArticles().forEach(article => {
        expect(article).toHaveClass(CLASSES.darkMode.article);
      });
    });
  });

  describe('performance', () => {
    it('renders efficiently with many posts', () => {
      const manyPosts = createMockPosts(PERFORMANCE.maxPosts);
      
      const start = performance.now();
      const { getArticles } = setup(manyPosts);
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(PERFORMANCE.renderThreshold);
      expect(getArticles()).toHaveLength(PERFORMANCE.maxPosts);
    });
  });
}); 