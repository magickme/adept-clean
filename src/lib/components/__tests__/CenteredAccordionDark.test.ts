import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte/svelte5';
import { tick } from 'svelte';
import CenteredAccordionDark from '../CenteredAccordionDark.svelte';
import type { FAQ } from '../CenteredAccordionDark.svelte';

// Fix mocks
vi.mock('svelte/transition', () => ({
  slide: () => ({ duration: 0, css: () => '' })
}));

vi.mock('isomorphic-dompurify', () => ({
  default: {
    sanitize: vi.fn((html: string) => html)
  }
}));

vi.mock('$lib/collections/faqs/faq.json', () => ({
  default: [
    { question: 'Test Question 1', answer: 'Test Answer 1' },
    { question: 'Test Question 2', answer: 'Test Answer 2' }
  ]
}));

describe('CenteredAccordionDark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createFaqs = (count: number): FAQ[] => 
    Array.from({ length: count }, (_, i) => ({
      question: `Q${i + 1}`,
      answer: `A${i + 1}`
    }));

  const createProps = (overrides?: Partial<{
    dataTestid?: string;
    faqs?: FAQ[];
    initialOpenIndex?: number;
    allowMultiple?: boolean;
  }>) => ({
    faqs: createFaqs(2),
    ...overrides
  });

  const toggleFaq = async (question: string) => {
    const button = screen.getByRole('button', { name: new RegExp(question, 'i') });
    await fireEvent.click(button);
    await tick();
  };

  describe('rendering', () => {
    test('basic structure', async () => {
      render(CenteredAccordionDark, createProps());
      await tick();
      
      expect(screen.getByTestId('faq-outer-container')).toBeInTheDocument();
      expect(screen.getByTestId('faq-inner-container')).toBeInTheDocument();
      expect(screen.getByRole('heading', { 
        level: 2, 
        name: /frequently asked questions/i 
      })).toBeInTheDocument();
    });

    test('custom data-testid', async () => {
      render(CenteredAccordionDark, createProps({
        dataTestid: 'custom-id',
        faqs: createFaqs(1)
      }));
      await tick();
      expect(screen.getByTestId('custom-id')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    test('toggles FAQ visibility', async () => {
      const faqs = createFaqs(1);
      render(CenteredAccordionDark, createProps({ faqs }));
      await tick();
      
      const button = screen.getByRole('button', { name: faqs[0].question });
      expect(screen.queryByText(faqs[0].answer)).not.toBeInTheDocument();
      
      await toggleFaq(faqs[0].question);
      expect(screen.getByText(faqs[0].answer)).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'true');
      
      await toggleFaq(faqs[0].question);
      expect(screen.queryByText(faqs[0].answer)).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('edge cases', () => {
    test('empty FAQ list', async () => {
      render(CenteredAccordionDark, createProps({ faqs: [] }));
      await tick();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('HTML content in answers', async () => {
      render(CenteredAccordionDark, createProps({
        faqs: [{
          question: 'HTML',
          answer: '<strong>Bold</strong>'
        }]
      }));
      await tick();
      
      await toggleFaq('HTML');
      const element = screen.getByText('Bold', { selector: 'strong' });
      expect(element).toBeInTheDocument();
    });
  });

  describe('security', () => {
    test('sanitizes HTML content', async () => {
      const maliciousAnswer = '<script>alert("xss")</script><strong>Safe</strong>';
      render(CenteredAccordionDark, createProps({
        faqs: [{
          question: 'XSS',
          answer: maliciousAnswer
        }]
      }));
      await tick();
      
      await toggleFaq('XSS');
      expect(screen.getByText('Safe', { selector: 'strong' })).toBeInTheDocument();
      expect(screen.queryByText(/alert/)).not.toBeInTheDocument();
    });
  });

  describe('mounting behavior', () => {
    test('transitions opacity correctly', async () => {
      vi.useFakeTimers();
      
      const { container } = render(CenteredAccordionDark, createProps());
      const componentElement = container.firstChild as HTMLElement;
      const innerContainer = screen.getByTestId('faq-inner-container');
      
      // Initial state should be opacity-0
      expect(innerContainer.className).toContain('opacity-0');
      
      // Advance timers and wait for state updates
      await vi.runAllTimersAsync();
      await tick();
      
      // Should now be opacity-100
      expect(innerContainer.className).toContain('opacity-100');
      
      // Cleanup
      vi.useRealTimers();
    });
  });

  describe('accessibility', () => {
    test('keyboard navigation works', async () => {
      const faqs = createFaqs(1);
      render(CenteredAccordionDark, createProps({ faqs }));
      await tick();

      const button = screen.getByRole('button', { name: faqs[0].question });
      await fireEvent.keyDown(button, { key: 'Enter' });
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await fireEvent.keyDown(button, { key: ' ' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    test('proper ARIA relationships', async () => {
      render(CenteredAccordionDark, createProps({ faqs: createFaqs(1) }));
      await tick();

      const button = screen.getByRole('button');
      const buttonId = button.id;
      await toggleFaq('Q1');

      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-labelledby', buttonId);
    });
  });

  describe('event handling', () => {
    test('emits toggle events', async () => {
      const toggleHandler = vi.fn();
      render(CenteredAccordionDark, createProps());
      
      // Listen on document level
      document.addEventListener('toggle', ((e: CustomEvent) => {
        toggleHandler(e.detail);
      }) as EventListener);
      
      // Click the button
      const button = screen.getByRole('button', { name: 'Q1' });
      await fireEvent.click(button);
      await tick();
      
      expect(toggleHandler).toHaveBeenCalledWith(
        expect.objectContaining({ 
          index: 0, 
          isOpen: true 
        })
      );
    });
  });

  describe('props', () => {
    test('respects initialOpenIndex', async () => {
      render(CenteredAccordionDark, {
        ...createProps(),
        initialOpenIndex: 0
      });
      await tick();

      const button = screen.getByRole('button', { name: 'Q1' });
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });
}); 