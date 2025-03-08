import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte/svelte5';
import type { ComponentProps } from 'svelte';
import SimpleCenteredBackground from '../SimpleCenteredBackground.svelte';

describe('SimpleCenteredBackground', () => {
  // Types
  type Props = ComponentProps<SimpleCenteredBackground>;
  
  // Constants
  const TEST_DATA = {
    LONG_TEXT: 'a'.repeat(1000),
    SPECIAL_CHARS: '!@#$%^&*()_+<>?:"{}|',
    HTML_CONTENT: '<strong>Bold</strong> <em>italic</em>',
    DEFAULT_PROPS: {
      title: 'Test Title',
      description: 'Test Description',
      announcement: 'Test Announcement',
      backgroundImage: '/test-image.jpg',
      linkOneUrl: '/test-link-1',
      linkOneText: 'Link One',
      linkTwoUrl: '/test-link-2',
      linkTwoText: 'Link Two'
    },
    GRADIENT: {
      COLORS: ['from-[#ff4694]', 'to-[#776fff]'],
      OPACITY: 'opacity-20'
    }
  } as const;

  const SELECTORS = {
    CONTAINER: '.relative.isolate.overflow-hidden',
    LINKS_WRAPPER: '.grid.grid-cols-1',
    ANNOUNCEMENT: '.rounded-full',
    GRADIENT: '.bg-gradient-to-tr'
  } as const;

  const CLASSES = {
    IMAGE: {
      BASE: [
        'absolute',
        'inset-0',
        '-z-10',
        'h-full',
        'w-full',
        'object-cover',
        'opacity-25'
      ]
    },
    TEXT: {
      HEADING: ['text-4xl', 'font-bold', 'tracking-tight', 'text-white'],
      CONTRAST: 'text-gray-300'
    },
    LAYOUT: {
      CONTAINER: ['py-24', 'sm:py-32'],
      GRID: ['grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:flex']
    }
  } as const;

  // Test data factory
  const createProps = (overrides: Partial<Props> = {}): Props => ({
    ...TEST_DATA.DEFAULT_PROPS,
    ...overrides
  });

  // Helper functions
  const getElements = {
    image: () => screen.getByRole('img'),
    heading: () => screen.getByRole('heading'),
    linkContainer: () => screen.getByRole('link', { name: /Link One/i }).closest('div'),
    announcement: () => screen.getByText(/test announcement/i),
    description: () => screen.getByText(/test description/i),
    container: () => screen.getByTestId('background-container'),
    links: () => screen.getAllByRole('link'),
    announcementBadge: () => screen.getByText(/test announcement/i).closest(SELECTORS.ANNOUNCEMENT),
    gradients: (container: HTMLElement) => container.querySelectorAll(SELECTORS.GRADIENT)
  };

  const verifyClasses = (element: HTMLElement | null, classes: string[]) => {
    expect(element).toBeInTheDocument();
    classes.forEach(className => {
      expect(element).toHaveClass(className);
    });
  };

  const verifyLink = (link: HTMLElement, { text, url }: { text: string; url: string }) => {
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveTextContent(text);
    const arrow = link.querySelector('[aria-hidden="true"]');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveTextContent('→');
  };

  const verifyGradient = (gradient: Element) => {
    verifyClasses(gradient as HTMLElement, [
      ...TEST_DATA.GRADIENT.COLORS,
      TEST_DATA.GRADIENT.OPACITY
    ]);
  };

  // Setup helper
  const setup = (props?: Partial<Props>) => {
    const utils = render(SimpleCenteredBackground, {
      props: createProps(props)
    });
    return {
      ...utils,
      elements: getElements,
      verify: {
        classes: verifyClasses,
        link: verifyLink,
        gradient: verifyGradient
      }
    };
  };

  describe('Basic Rendering', () => {
    it('renders with all props', () => {
      const { elements } = setup(TEST_DATA.DEFAULT_PROPS);
      
      const img = screen.getByRole('img', { name: TEST_DATA.DEFAULT_PROPS.title });
      expect(img).toBeInTheDocument();
      expect(elements.heading()).toHaveTextContent(TEST_DATA.DEFAULT_PROPS.title);
      expect(elements.description()).toHaveTextContent(TEST_DATA.DEFAULT_PROPS.description);
      expect(elements.announcement()).toHaveTextContent(TEST_DATA.DEFAULT_PROPS.announcement);
      expect(elements.image()).toHaveAttribute('src', TEST_DATA.DEFAULT_PROPS.backgroundImage);
    });

    it('renders without announcement when not provided', () => {
      setup({ announcement: undefined });
      expect(screen.queryByText(/announcement/i)).not.toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('renders both links with correct attributes', () => {
      const props = createProps();
      const { elements, verify } = setup();

      const links = elements.links();
      expect(links).toHaveLength(2);
      
      verify.link(links[0], {
        text: props.linkOneText,
        url: props.linkOneUrl
      });
      verify.link(links[1], {
        text: props.linkTwoText,
        url: props.linkTwoUrl
      });
    });
  });

  describe('Component Structure', () => {
    it('maintains correct DOM hierarchy', () => {
      const { container } = setup();
      
      expect(container.querySelector(SELECTORS.CONTAINER)).toBeInTheDocument();
      expect(container.querySelector(SELECTORS.LINKS_WRAPPER)).toBeInTheDocument();
    });

    it('preserves gradient overlays', () => {
      const { container, verify } = setup();
      const gradients = getElements.gradients(container);
      
      expect(gradients).toHaveLength(2);
      gradients.forEach(verify.gradient);
    });
  });
}); 