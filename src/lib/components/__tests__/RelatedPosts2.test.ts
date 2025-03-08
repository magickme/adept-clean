import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte/svelte5';
import RelatedPosts2 from '../RelatedPosts2.svelte';
import { createPostTestUtils, POST_TEST_DATA } from './utils/postTestUtils';

describe('RelatedPosts2', () => {
  const { queries, verify, testData } = createPostTestUtils();

  describe('Basic Rendering', () => {
    it('renders with posts', () => {
      render(RelatedPosts2, { posts: [testData.createPost()] });
      expect(screen.getByTestId('RelatedPosts')).toBeInTheDocument();
      expect(screen.getByText('Browse related articles')).toBeInTheDocument();
    });

    it.each([
      ['empty array', []],
      ['undefined', undefined]
    ])('does not render with %s', (_, posts) => {
      render(RelatedPosts2, { posts });
      expect(screen.queryByTestId('RelatedPosts')).not.toBeInTheDocument();
    });
  });

  describe('Post Content', () => {
    it('renders post details correctly', () => {
      const post = testData.createPost();
      render(RelatedPosts2, { posts: [post] });
      verify.postContent(post);
    });

    it('handles missing post data gracefully', () => {
      const incompletePost = testData.createPost({
        title: '',
        primary_author: undefined,
        excerpt: undefined,
        reading_time: undefined,
        tags: undefined
      });
      
      render(RelatedPosts2, { posts: [incompletePost] });
      
      expect(screen.getByText('Untitled')).toBeInTheDocument();
      expect(screen.queryByRole('img', { name: /author/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('formats dates correctly', () => {
      const post = testData.createPost();
      render(RelatedPosts2, { posts: [post] });
      expect(queries.posts.getTimeElement(post.published_at)).toBeInTheDocument();
    });

    it('handles invalid dates gracefully', () => {
      const post = testData.createPost({ published_at: POST_TEST_DATA.DATES.INVALID });
      render(RelatedPosts2, { posts: [post] });
      
      expect(screen.getByText((_, element) => 
        element?.tagName.toLowerCase() === 'time' && 
        element.textContent === 'Invalid Date'
      )).toBeInTheDocument();
    });
  });

  describe('Text Truncation', () => {
    it.each([
      ['truncates long excerpts', POST_TEST_DATA.EXCERPTS.LONG, true],
      ['preserves short excerpts', POST_TEST_DATA.EXCERPTS.SHORT, false]
    ])('%s', (_, excerpt, shouldTruncate) => {
      const post = testData.createPost({ excerpt });
      render(RelatedPosts2, { posts: [post] });
      
      const displayedExcerpt = screen.getByText(
        shouldTruncate ? /a+\.\.\./ : excerpt
      );
      
      if (shouldTruncate) {
        expect(displayedExcerpt.textContent.length).toBeLessThanOrEqual(103);
      } else {
        expect(displayedExcerpt.textContent).toBe(excerpt);
      }
    });
  });

  describe('Links and Navigation', () => {
    it('generates correct post URLs', () => {
      const post = testData.createPost();
      render(RelatedPosts2, { posts: [post] });
      expect(screen.getByText(post.title).closest('a'))
        .toHaveAttribute('href', `/blog/${post.slug}`);
    });
  });

  describe('Images', () => {
    it('renders post and author images with fallbacks', () => {
      const post = testData.createPost();
      render(RelatedPosts2, { posts: [post] });
      
      const postImage = screen.getByRole('img', { name: post.title });
      const authorImage = screen.getByRole('img', { name: post.primary_author.name });
      
      expect(postImage).toBeInTheDocument();
      expect(authorImage).toBeInTheDocument();
      expect(authorImage).toHaveAttribute('src', post.primary_author.profile_image);
    });

    it('handles missing images gracefully', () => {
      const post = testData.createPost({
        feature_image: '',
        primary_author: { name: 'Author', profile_image: '' }
      });
      render(RelatedPosts2, { posts: [post] });
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img.getAttribute('src')).toBeFalsy();
      });
    });
  });

  describe('Tags', () => {
    it('renders post tags', () => {
      const post = testData.createPost({ tags: POST_TEST_DATA.TAGS });
      render(RelatedPosts2, { posts: [post] });
      
      POST_TEST_DATA.TAGS.forEach(tag => {
        expect(screen.getByText(tag.name)).toBeInTheDocument();
      });
    });

    it('handles missing tags gracefully', () => {
      const post = testData.createPost({ tags: undefined });
      render(RelatedPosts2, { posts: [post] });
      expect(queries.posts.getTagsContainer()?.children.length).toBe(0);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      render(RelatedPosts2, { posts: [testData.createPost()] });
      verify.accessibility();
    });

    it('provides proper image alt text', () => {
      const post = testData.createPost();
      render(RelatedPosts2, { posts: [post] });
      
      expect(queries.posts.getAuthorImage(post.primary_author.name))
        .toHaveAttribute('alt', post.primary_author.name);
    });
  });
}); 