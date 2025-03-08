import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';
import CourseGrid from '../../CourseGrid.svelte';

describe('CourseGrid Integration', () => {
  const mockCourses = [
    {
      id: '1',
      name: 'Test Course',
      image_url: 'test.jpg',
      author: 'Test Author',
      author_image: 'author.jpg',
      skill_level: 'Beginner',
      duration: '2h'
    },
    {
      id: '2',
      name: 'Advanced Course',
      image_url: 'advanced.jpg',
      author: 'Another Author',
      author_image: 'author2.jpg',
      skill_level: 'Advanced',
      duration: '4h'
    }
  ] as const;

  const mockTagMap = {
    All: 'all',
    Beginner: 'beginner',
    Advanced: 'advanced'
  } as const;

  const originalLocation = window.location;
  let mockHistory: { replaceState: Mock };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Mock window.location
    delete (window as any).location;
    const href = 'http://localhost/';
    window.location = {
      ...originalLocation,
      search: '',
      pathname: '/',
      href,
      _href: href,
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn()
    } as unknown as Location;

    // Mock history - fixed typing
    mockHistory = { 
      replaceState: vi.fn().mockImplementation((state, title, url) => {
        window.location.href = url;
      })
    };
    window.history = mockHistory as unknown as History;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.location = originalLocation;
  });

  const renderCourseGrid = (props = {}) => {
    return render(CourseGrid, {
      tagMap: mockTagMap,
      displayCourses: mockCourses,
      selectedTab: 'All',
      ...props
    });
  };

  describe('filtering behavior', () => {
    it('filters courses based on skill level and returns to all courses', async () => {
      const { getByTestId, queryByText, queryAllByRole } = renderCourseGrid();

      // Verify initial state
      expect(queryAllByRole('article')).toHaveLength(2);
      expect(queryByText('Test Course')).toBeInTheDocument();
      expect(queryByText('Advanced Course')).toBeInTheDocument();

      // Filter to Beginner
      await fireEvent.click(getByTestId('tab-beginner'));
      
      // Verify filtered state
      expect(queryAllByRole('article')).toHaveLength(1);
      expect(queryByText('Test Course')).toBeInTheDocument();
      expect(queryByText('Advanced Course')).not.toBeInTheDocument();

      // Filter to Advanced
      await fireEvent.click(getByTestId('tab-advanced'));
      
      // Verify filtered state again
      expect(queryAllByRole('article')).toHaveLength(1);
      expect(queryByText('Test Course')).not.toBeInTheDocument();
      expect(queryByText('Advanced Course')).toBeInTheDocument();

      // Return to All courses
      await fireEvent.click(getByTestId('tab-all'));
      
      // Verify all courses are shown again
      expect(queryAllByRole('article')).toHaveLength(2);
      expect(queryByText('Test Course')).toBeInTheDocument();
      expect(queryByText('Advanced Course')).toBeInTheDocument();
    });

    it('handles empty displayCourses array', () => {
      const { queryAllByRole } = renderCourseGrid({ displayCourses: [] });
      expect(queryAllByRole('article')).toHaveLength(0);
    });
  });

  describe('URL handling', () => {
    it('updates URL when changing tabs', async () => {
      const { getByTestId } = renderCourseGrid();
      await fireEvent.click(getByTestId('tab-beginner'));

      vi.runAllTimers();
      await Promise.resolve();
      
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('?tab=beginner')
      );
    });

    it('preserves existing URL parameters when updating tab', async () => {
      window.location.search = '?search=test&page=2';
      
      const { getByTestId } = renderCourseGrid();

      await fireEvent.click(getByTestId('tab-beginner'));
      
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('search=test')
      );
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        '',
        expect.stringContaining('page=2')
      );
    });

    it('handles URL update errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockHistory.replaceState.mockImplementationOnce(() => {
        throw new Error('History API failed');
      });

      const { getByTestId } = renderCourseGrid();

      const beginnerTab = getByTestId('tab-beginner');
      await fireEvent.click(beginnerTab);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to update URL:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('course links', () => {
    it('handles undefined course links', () => {
      const coursesWithoutLinks = [{ ...mockCourses[0], link: undefined }];
      const { getByText, queryByRole } = renderCourseGrid({ 
        displayCourses: coursesWithoutLinks 
      });

      expect(getByText('Test Course')).toBeInTheDocument();
      expect(queryByRole('link', { name: 'Test Course' })).not.toBeInTheDocument();
    });

    it('renders course links when provided', () => {
      const coursesWithLinks = [
        { ...mockCourses[0], link: 'https://example.com/course' }
      ];
      const { getByRole } = renderCourseGrid({ displayCourses: coursesWithLinks });

      expect(getByRole('link', { name: 'Test Course' }))
        .toHaveAttribute('href', 'https://example.com/course');
    });
  });
}); 