import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import WithCards from '../WithCards.svelte';
import DOMPurify from 'isomorphic-dompurify';
import { vi } from 'vitest';

describe('WithCards', () => {
  const mockProps = {
    title: 'Test Title',
    description: 'Test Description',
    units: [
      {
        icon: '🎯',
        name: 'Unit 1',
        description: 'Description 1'
      },
      {
        icon: '⚡',
        name: 'Unit 2',
        description: 'Description 2'
      }
    ],
    isDarkMode: false,
    isLoading: false,
    error: undefined
  };

  // Helper functions moved here after mockProps is defined
  function renderWithProps(props = {}) {
    return render(WithCards, {
      ...mockProps,
      ...props
    });
  }

  function expectTextContent(text: string, shouldExist = true) {
    const element = screen.queryByText(text);
    if (shouldExist) {
      expect(element).toBeInTheDocument();
    } else {
      expect(element).not.toBeInTheDocument();
    }
  }

  afterEach(() => {
    cleanup();
  });

  // Basic Rendering
  it('renders component with all required elements', () => {
    renderWithProps();
    expectTextContent('Test Title');
    expectTextContent('Test Description');
    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  // Props Validation & Units Rendering
  it('renders all units correctly', () => {
    renderWithProps();
    
    mockProps.units.forEach(unit => {
      expect(screen.getByText(unit.name)).toBeInTheDocument();
      expect(screen.getByText(unit.description)).toBeInTheDocument();
      expect(screen.getByText(unit.icon)).toBeInTheDocument();
    });
  });

  // HTML Content in Description
  it('correctly renders HTML content in description', () => {
    const propsWithHtml = {
      ...mockProps,
      description: '<p>Test</p><strong>Bold</strong>'
    };
    
    render(WithCards, propsWithHtml);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Bold')).toBeInTheDocument();
  });

  // Empty States
  it('handles empty units array gracefully', () => {
    render(WithCards, { ...mockProps, units: [] });
    const gridContainer = document.querySelector('.grid');
    expect(gridContainer?.children.length).toBe(0);
  });

  // Accessibility
  it('meets accessibility standards', async () => {
    render(WithCards, mockProps);
    
    // Check heading hierarchy
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Title');

    // Check image alt text
    const backgroundImage = screen.getByAltText('');
    expect(backgroundImage).toHaveAttribute('alt', '');
    expect(backgroundImage).toHaveAttribute('role', 'presentation');

    // Check ARIA roles
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Features');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(mockProps.units.length);
  });

  // Style Classes
  it('applies correct CSS classes', () => {
    render(WithCards, mockProps);
    
    // Check main container classes
    const container = document.querySelector('.relative');
    expect(container).toHaveClass('isolate', 'overflow-hidden', 'bg-gray-900');

    // Check grid classes
    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass('max-w-2xl', 'grid-cols-1');
  });

  // Add test for dark mode classes
  it('applies dark mode classes when isDarkMode is true', () => {
    render(WithCards, { ...mockProps, isDarkMode: true });
    const container = document.querySelector('.relative');
    expect(container).toHaveClass('bg-black');
  });

  // Responsive Classes
  it('includes responsive design classes', () => {
    render(WithCards, mockProps);
    
    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass('lg:grid-cols-3', 'lg:gap-8');
  });

  // Font Classes
  it('applies correct font classes', () => {
    render(WithCards, mockProps);
    
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('font-montserrat');

    const description = screen.getByText('Test Description');
    expect(description).toHaveClass('font-sourceSans');
  });

  // Add background image test
  it('renders background image with correct URL', () => {
    render(WithCards, mockProps);
    const bgImage = screen.getByAltText('');
    expect(bgImage).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply'
    );
  });

  // Sanitization test
  it('sanitizes HTML in description', () => {
    const unsafeHtml = '<p>Safe</p><script>alert("xss")</script>';
    const safeHtml = DOMPurify.sanitize(unsafeHtml);
    
    render(WithCards, {
      ...mockProps,
      description: unsafeHtml
    });
    
    const container = screen.getByText('Safe').parentElement;
    // Use includes() instead of exact match to handle Svelte's comment nodes
    expect(container?.innerHTML.includes(safeHtml)).toBe(true);
  });

  // DOMPurify error handling test
  it('handles DOMPurify errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('DOMPurify error');
    
    // Mock DOMPurify.sanitize to throw error
    vi.spyOn(DOMPurify, 'sanitize').mockImplementation(() => {
      throw mockError;
    });

    // Render with HTML content that will trigger sanitization
    render(WithCards, {
      ...mockProps,
      description: '<p>Test content</p>'
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error sanitizing HTML:', mockError);

    // Cleanup
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
  });

  // Update snapshot test to handle new classes
  it('matches snapshot', () => {
    const { container } = render(WithCards, mockProps);
    expect(container).toMatchSnapshot();
  });

  // Add prop validation tests
  describe('prop validation', () => {
    it('throws error when required props are missing', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => render(WithCards, { 
        title: undefined, 
        description: 'test', 
        units: [],
        error: undefined,
        isLoading: false
      })).toThrow();
      
      expect(() => render(WithCards, { 
        title: 'test', 
        description: undefined, 
        units: [],
        error: undefined,
        isLoading: false
      })).toThrow();
      
      expect(() => render(WithCards, { 
        title: 'test', 
        description: 'test', 
        units: undefined,
        error: undefined,
        isLoading: false
      })).toThrow();

      consoleError.mockRestore();
    });

    it('validates units array content', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const invalidUnits = [
        { icon: '🎯' }, // missing name and description
        { name: 'Test' }, // missing icon and description
      ];

      expect(() => render(WithCards, {
        ...mockProps,
        units: invalidUnits
      })).toThrow();

      consoleError.mockRestore();
    });
  });

  describe('performance', () => {
    it('handles large unit lists efficiently', () => {
      const largeUnitList = Array.from({ length: 100 }, (_, i) => ({
        icon: '🎯',
        name: `Unit ${i}`,
        description: `Description ${i}`
      }));

      const { container } = render(WithCards, {
        ...mockProps,
        units: largeUnitList
      });

      const listItems = container.querySelectorAll('[role="listitem"]');
      expect(listItems.length).toBe(100);
    });

    it('handles duplicate unit names gracefully', () => {
      const duplicateUnits = [
        { icon: '🎯', name: 'Same Name', description: 'Description 1' },
        { icon: '⚡', name: 'Same Name', description: 'Description 2' }
      ];

      const { container } = render(WithCards, {
        ...mockProps,
        units: duplicateUnits
      });

      const listItems = container.querySelectorAll('[role="listitem"]');
      expect(listItems.length).toBe(2);
    });

    it('handles long content gracefully', () => {
      const longContent = {
        ...mockProps,
        title: 'A'.repeat(100),
        description: 'B'.repeat(500),
        units: [{
          icon: '🎯',
          name: 'C'.repeat(50),
          description: 'D'.repeat(200)
        }]
      };

      const { container } = render(WithCards, longContent);
      expect(container).toMatchSnapshot();
    });
  });

  describe('content overflow', () => {
    it('truncates long text appropriately', () => {
      const longTexts = {
        ...mockProps,
        units: [{
          icon: '🎯',
          name: 'A'.repeat(100),
          description: 'B'.repeat(300)
        }]
      };

      const { container } = render(WithCards, longTexts);
      
      // Instead of checking computed styles (which don't work in JSDOM),
      // check for the presence of truncation classes
      const unitName = container.querySelector('h3');
      const unitDesc = container.querySelector('.text-sm');
      
      expect(unitName).toHaveClass('overflow-hidden', 'text-ellipsis');
      expect(unitDesc).toHaveClass('overflow-hidden', 'text-ellipsis');
    });
  });

  describe('loading state', () => {
    it('shows loading skeleton when isLoading is true', () => {
      const { container } = render(WithCards, {
        ...mockProps,
        isLoading: true
      });

      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-busy', 'true');
      expect(container.querySelectorAll('.animate-pulse')).toHaveLength(5); // 2 text blocks + 3 cards
    });

    it('hides content while loading', () => {
      renderWithProps({ isLoading: true });
      expectTextContent(mockProps.title, false);
      expectTextContent(mockProps.description, false);
    });
  });

  describe('error state', () => {
    it('displays error message when error prop is provided', () => {
      const errorMessage = 'Failed to load content';
      render(WithCards, {
        ...mockProps,
        error: errorMessage
      });

      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('hides content when error is shown', () => {
      render(WithCards, {
        ...mockProps,
        error: 'Error message'
      });

      expect(screen.queryByText(mockProps.title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockProps.description)).not.toBeInTheDocument();
    });
  });

  describe('state precedence', () => {
    it('shows error state over loading state', () => {
      render(WithCards, {
        ...mockProps,
        error: 'Error message',
        isLoading: true
      });

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.queryByText('Error message')).toBeInTheDocument();
      expect(screen.queryByRole('region', { busy: true })).not.toBeInTheDocument();
    });

    it('shows loading state over normal content', () => {
      render(WithCards, {
        ...mockProps,
        isLoading: true
      });

      expect(screen.getByRole('region', { busy: true })).toBeInTheDocument();
      expect(screen.queryByText(mockProps.title)).not.toBeInTheDocument();
    });
  });

  describe('type validation', () => {
    it('validates prop types', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Test invalid isDarkMode type
      expect(() => render(WithCards, {
        ...mockProps,
        isDarkMode: 'true' as any,
        error: undefined,
        isLoading: false
      })).toThrow(/WithCards: isDarkMode must be a boolean/);

      // Test invalid units type
      expect(() => render(WithCards, {
        ...mockProps,
        units: 'not an array' as any,
        error: undefined,
        isLoading: false
      })).toThrow(/WithCards: units must be an array/);

      // Test invalid unit structure
      expect(() => render(WithCards, {
        ...mockProps,
        units: [{ invalid: 'unit' }] as any,
        error: undefined,
        isLoading: false
      })).toThrow(/WithCards: each unit must have icon, name, and description properties/);

      // Test invalid isLoading type
      expect(() => render(WithCards, {
        ...mockProps,
        isLoading: 'true' as any,
      })).toThrow(/WithCards: isLoading must be a boolean/);

      // Test invalid error type
      expect(() => render(WithCards, {
        ...mockProps,
        error: {} as any,
      })).toThrow(/WithCards: error must be a string or undefined/);

      consoleError.mockRestore();
    });
  });
}); 