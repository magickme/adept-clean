import { render } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import RelatedPosts from '../../RelatedPosts.svelte';

describe('RelatedPosts Integration', () => {
  const mockPosts = [
    {
      title: 'Post 1',
      excerpt: 'This is a summary of post 1.',
      slug: 'post-1',
      published_at: '2023-01-01',
      feature_image: '/path/to/image1.jpg',
      author: { name: 'Author 1', profile_image: '/path/to/author1.jpg' },
      reading_time: 5,
      tags: ['Tag1', 'Tag2']
    },
    {
      title: 'Post 2',
      excerpt: 'This is a summary of post 2.',
      slug: 'post-2',
      published_at: '2023-02-01',
      feature_image: '/path/to/image2.jpg',
      author: { name: 'Author 2', profile_image: '/path/to/author2.jpg' },
      reading_time: 3,
      tags: ['Tag3']
    }
  ];

  const mockProps = {
    relatedPosts: mockPosts
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all related posts with correct content', () => {
    const { getByText, getAllByRole } = render(RelatedPosts, {
      props: mockProps
    });

    mockPosts.forEach(post => {
      expect(getByText(post.title)).toBeInTheDocument();
      expect(getByText(post.excerpt)).toBeInTheDocument();
      expect(getByText(post.author.name)).toBeInTheDocument();
    });

    const articles = getAllByRole('article');
    expect(articles).toHaveLength(mockPosts.length);
  });

  it('renders post images with correct attributes', () => {
    const { getAllByAltText } = render(RelatedPosts, {
      props: mockProps
    });

    const images = getAllByAltText('');
    images.forEach((image, index) => {
      expect(image).toHaveAttribute('src', mockPosts[index].feature_image);
    });
  });

  it('renders author images with correct attributes', () => {
    const { getByAltText } = render(RelatedPosts, {
      props: mockProps
    });

    mockPosts.forEach(post => {
      const authorImage = getByAltText(post.author.name);
      expect(authorImage).toHaveAttribute('src', post.author.profile_image);
    });
  });

  it('handles post link interactions correctly', () => {
    const { getAllByRole } = render(RelatedPosts, {
      props: mockProps
    });

    const links = getAllByRole('link');
    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', `/blog/${mockPosts[index].slug}`);
    });
  });

  it('renders tags correctly', () => {
    const { getByText } = render(RelatedPosts, {
      props: mockProps
    });

    mockPosts.forEach(post => {
      post.tags.forEach(tag => {
        expect(getByText(tag)).toBeInTheDocument();
      });
    });
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      relatedPosts: []
    };

    const { queryAllByRole } = render(RelatedPosts, {
      props: minimalProps
    });

    const articles = queryAllByRole('article');
    expect(articles).toHaveLength(0);
  });
}); 