import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CenteredAccordionDark from '../../CenteredAccordionDark.svelte';
import type { FAQ } from '../../CenteredAccordionDark.svelte';

// Test data
const mockFaqs: FAQ[] = [
  {
    question: 'Test Question 1',
    answer: 'Test Answer 1',
    id: 'faq-1'
  },
  {
    question: 'Test Question 2',
    answer: '<p>Test Answer 2 with <strong>HTML</strong></p>',
    id: 'faq-2'
  }
];

// Test helpers
const setupHelpers = {
  async flushPromises() {
    for (let i = 0; i < 3; i++) {
      await Promise.resolve();
    }
  },

  async waitForAnimation() {
    vi.advanceTimersByTime(300);
    await this.flushPromises();
  },

  async toggleAccordion(question: string) {
    const button = screen.getByRole('button', { name: new RegExp(question, 'i') });
    await fireEvent.click(button);
    await this.waitForAnimation();
  },

  async completeAnimations() {
    await vi.runAllTimersAsync();
    await this.flushPromises();
  },

  async cleanupEventListener(listener: EventListener) {
    document.removeEventListener('toggle', listener);
  }
};

describe('CenteredAccordionDark Integration', () => {
  let cleanupFns: Array<() => void> = [];

  beforeEach(() => {
    vi.useFakeTimers();
    Element.prototype.animate = vi.fn().mockReturnValue({
      finished: Promise.resolve(),
      cancel: vi.fn(),
      currentTime: 0,
      playState: 'finished'
    });
  });

  afterEach(async () => {
    vi.useRealTimers();
    await Promise.all(cleanupFns.map(fn => fn()));
    cleanupFns = [];
  });

  describe('State Management', () => {
    it('handles accordion state transitions correctly', async () => {
      render(CenteredAccordionDark, { props: { faqs: mockFaqs } });

      await setupHelpers.toggleAccordion('Test Question 1');
      expect(screen.getByText('Test Answer 1')).toBeInTheDocument();
      
      await setupHelpers.toggleAccordion('Test Question 2');
      await setupHelpers.completeAnimations();

      expect(screen.queryByText('Test Answer 1')).not.toBeInTheDocument();
      expect(screen.getByText(/Test Answer 2 with/)).toBeInTheDocument();
    });

    it('preserves state during remounts', async () => {
      const { rerender } = render(CenteredAccordionDark, {
        props: { faqs: mockFaqs }
      });

      await setupHelpers.toggleAccordion('Test Question 1');
      rerender({ faqs: mockFaqs });

      expect(screen.getByText('Test Answer 1')).toBeInTheDocument();
    });

    it('allows multiple accordions to be open simultaneously', async () => {
      render(CenteredAccordionDark, {
        props: { faqs: mockFaqs, allowMultiple: true }
      });

      await setupHelpers.toggleAccordion('Test Question 1');
      await setupHelpers.toggleAccordion('Test Question 2');

      expect(screen.getByText('Test Answer 1')).toBeInTheDocument();
      expect(screen.getByText(/Test Answer 2 with/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('handles keyboard navigation correctly', async () => {
      render(CenteredAccordionDark, { props: { faqs: mockFaqs } });

      const firstQuestion = screen.getByText('Test Question 1').closest('button');
      expect(firstQuestion).not.toBeNull();
      firstQuestion?.focus();

      await fireEvent.keyDown(firstQuestion!, { key: 'Enter' });
      await setupHelpers.waitForAnimation();
      expect(screen.getByText('Test Answer 1')).toBeInTheDocument();

      await fireEvent.keyDown(firstQuestion!, { key: ' ' });
      await setupHelpers.completeAnimations();
      expect(screen.queryByText('Test Answer 1')).not.toBeInTheDocument();
    });

    it('maintains ARIA attributes for accessibility', async () => {
      render(CenteredAccordionDark, { props: { faqs: mockFaqs } });

      const firstQuestion = screen.getByText('Test Question 1').closest('button');
      expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');

      await setupHelpers.toggleAccordion('Test Question 1');

      expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-labelledby', `${mockFaqs[0].id}-question`);
    });
  });

  describe('Security & Edge Cases', () => {
    it('sanitizes HTML content in answers', async () => {
      const maliciousFaqs = [{
        question: 'XSS Test',
        answer: '<script>alert("xss")</script><p>Safe content</p>',
        id: 'faq-xss'
      }];

      render(CenteredAccordionDark, { props: { faqs: maliciousFaqs } });
      await setupHelpers.toggleAccordion('XSS Test');

      const answer = screen.getByRole('region');
      expect(answer.innerHTML).not.toContain('<script>');
      expect(answer.innerHTML).toContain('<p>Safe content</p>');
    });

    it('handles empty or invalid FAQ data gracefully', () => {
      render(CenteredAccordionDark, { props: { faqs: [] } });

      expect(screen.getByText('Frequently asked questions')).toBeInTheDocument();
      expect(screen.queryByTestId('faq-item-0')).not.toBeInTheDocument();
    });
  });

  describe('Event Handling', () => {
    it('dispatches detailed toggle events', async () => {
      const toggleSpy = vi.fn();
      const eventHandler = ((e: CustomEvent) => toggleSpy(e)) as EventListener;
      document.addEventListener('toggle', eventHandler);
      cleanupFns.push(() => setupHelpers.cleanupEventListener(eventHandler));

      render(CenteredAccordionDark, { props: { faqs: mockFaqs } });

      await setupHelpers.toggleAccordion('Test Question 1');
      expect(toggleSpy).toHaveBeenCalled();
      const receivedEvent = toggleSpy.mock.calls[0][0] as CustomEvent;
      expect(receivedEvent.detail).toEqual({
        index: 0,
        isOpen: true,
        id: mockFaqs[0].id
      });
    });

    it('handles multiple toggle events correctly', async () => {
      const toggleSpy = vi.fn();
      const eventHandler = ((e: CustomEvent) => toggleSpy(e)) as EventListener;
      document.addEventListener('toggle', eventHandler);
      cleanupFns.push(() => setupHelpers.cleanupEventListener(eventHandler));

      render(CenteredAccordionDark, { 
        props: { faqs: mockFaqs, allowMultiple: true } 
      });

      await setupHelpers.toggleAccordion('Test Question 1');
      await setupHelpers.toggleAccordion('Test Question 2');

      expect(toggleSpy).toHaveBeenCalledTimes(2);
      const secondEvent = toggleSpy.mock.calls[1][0] as CustomEvent;
      expect(secondEvent.detail).toEqual({
        index: 1,
        isOpen: true,
        id: mockFaqs[1].id
      });
    });
  });
}); 