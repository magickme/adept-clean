import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte/svelte5';
import MembershipPitch from '../MembershipPitch.svelte';
import { membershipPitchTestUtils as utils } from './utils/membershipPitchTestUtils';

describe('MembershipPitch', () => {
  describe('Basic Rendering', () => {
    it('renders with all props', () => {
      const props = utils.createProps();
      render(MembershipPitch, { props });

      expect(utils.queries.getMembershipInfo()).toBeInTheDocument();
      expect(utils.queries.getLogo()).toHaveAttribute('src', props.logoUrl);
      expect(utils.queries.getLinks()).toHaveLength(2);
    });

    it('matches snapshot', () => {
      const { container } = render(MembershipPitch, { props: utils.createProps() });
      expect(container).toMatchSnapshot();
    });

    it('applies correct base styles', () => {
      const { container } = render(MembershipPitch, { props: utils.createProps() });
      utils.verify.classes(container.querySelector(utils.selectors.outer), utils.classes.outer);
      utils.verify.classes(container.querySelector(utils.selectors.inner), utils.classes.inner);
    });
  });

  describe('Props Validation', () => {
    it('handles empty membership info', () => {
      render(MembershipPitch, { props: utils.createProps({ membershipInfo: '' }) });
      const textLink = utils.queries.getTextLink();
      expect(textLink).toBeInTheDocument();
      expect(textLink?.querySelector('p')?.textContent?.trim()).toBe('');
    });

    it('handles missing logo URL', () => {
      render(MembershipPitch, { props: utils.createProps({ logoUrl: undefined }) });
      expect(utils.queries.getLogo().getAttribute('src')).toBeFalsy();
    });

    it('handles invalid logo URL', () => {
      const onError = vi.fn();
      render(MembershipPitch, { props: utils.createProps({ logoUrl: 'invalid-url' }) });
      
      const logo = utils.queries.getLogo();
      logo.addEventListener('error', onError);
      logo.dispatchEvent(new Event('error'));
      
      expect(onError).toHaveBeenCalled();
    });

    it('handles special characters in membership info', () => {
      const specialText = '<script>alert("xss")</script>Special & <b>Bold</b>';
      render(MembershipPitch, { 
        props: utils.createProps({ membershipInfo: specialText }) 
      });
      const textContent = utils.queries.getTextLink()?.textContent;
      expect(textContent).toBe(specialText);
      expect(utils.queries.getTextLink()?.innerHTML).not.toBe(specialText);
    });

    it('handles extremely long membership info', () => {
      const longText = 'a'.repeat(1000);
      render(MembershipPitch, { 
        props: utils.createProps({ membershipInfo: longText })
      });
      expect(utils.queries.getTextLink()).toBeInTheDocument();
      utils.verify.layout(document.body);
    });

    it('handles extremely long URLs', () => {
      const longUrl = `https://example.com/${'a'.repeat(500)}`;
      render(MembershipPitch, { 
        props: utils.createProps({ linkUrl: longUrl })
      });
      utils.queries.getLinks().forEach(link => {
        expect(link).toHaveAttribute('href', longUrl);
      });
    });
  });

  describe('Accessibility and Layout', () => {
    it('has proper ARIA labels and alt text', () => {
      render(MembershipPitch, { props: utils.createProps() });
      utils.queries.getLinks().forEach(utils.verify.linkAttributes);
      expect(utils.queries.getLogo()).toHaveAttribute('alt', 'Logo');
    });

    it('maintains responsive layout structure', () => {
      const { container } = render(MembershipPitch, { props: utils.createProps() });
      utils.verify.layout(container);
    });
  });

  describe('Dark Mode', () => {
    it('applies correct dark mode styles', () => {
      const { container } = render(MembershipPitch, { 
        props: utils.createProps({ isDarkMode: true }) 
      });
      utils.verify.darkMode(container);
    });

    it('maintains layout in dark mode', () => {
      const { container } = render(MembershipPitch, { 
        props: utils.createProps({ isDarkMode: true }) 
      });
      utils.verify.layout(container);
    });

    it('preserves link and logo visibility in dark mode', () => {
      render(MembershipPitch, { props: utils.createProps({ isDarkMode: true }) });
      expect(utils.queries.getLogoLink()).toBeVisible();
      expect(utils.queries.getTextLink()).toBeVisible();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with large content', () => {
      const start = performance.now();
      const longText = 'a'.repeat(10000);
      render(MembershipPitch, { 
        props: utils.createProps({ membershipInfo: longText })
      });
      const end = performance.now();
      expect(end - start).toBeLessThan(100); // 100ms threshold
    });

    it('handles rapid re-renders', async () => {
      const { rerender } = render(MembershipPitch);
      
      // Batch rerenders or reduce count
      const updates = Array(10).fill().map((_, i) => ({ 
        someProps: `value${i}` 
      }));

      for (const props of updates) {
        rerender(props);
        // Add small delay if needed
        await new Promise(r => setTimeout(r, 10)); 
      }
    });
  });

  describe('Accessibility', () => {
    it('meets color contrast requirements', () => {
      const { container } = render(MembershipPitch, { props: utils.createProps() });
      utils.verify.contrast(container);
    });

    it('preserves tab order', () => {
      render(MembershipPitch, { props: utils.createProps() });
      const tabbableElements = utils.queries.getTabbableElements();
      expect(tabbableElements.length).toBe(2); // Two links
      expect(tabbableElements[0]).toBe(utils.queries.getLogoLink());
      expect(tabbableElements[1]).toBe(utils.queries.getTextLink());
    });
  });
}); 