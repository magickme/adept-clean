import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte/svelte5';
import { tick } from 'svelte';
import Modal from '../Modal.svelte';
import type { ModalProps } from '../../types/FeaturedTeacher';

describe('Modal', () => {
  // Test data factory
  const createModalProps = (overrides?: Partial<ModalProps>): ModalProps => ({
    title: 'Test Modal',
    message: 'Test message',
    buttonText: 'Close',
    open: true,
    onClose: vi.fn(),
    ...overrides
  });

  describe('Rendering', () => {
    it('renders when open is true', () => {
      const props = createModalProps();
      render(Modal, { props });
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent(props.title);
      expect(screen.getByText(props.message)).toBeInTheDocument();
      expect(screen.getByTestId('modal-close-button')).toHaveTextContent(props.buttonText);
    });

    it('does not render when open is false', () => {
      const props = createModalProps({ open: false });
      render(Modal, { props });
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('handles HTML content in message prop', () => {
      const props = createModalProps({
        message: '<strong>Bold</strong> <em>italic</em>'
      });
      render(Modal, { props });
      
      const strongElement = screen.getByText('Bold');
      const emElement = screen.getByText('italic');
      expect(strongElement.tagName).toBe('STRONG');
      expect(emElement.tagName).toBe('EM');
    });
  });

  describe('Interactions', () => {
    let props: ModalProps;
    
    beforeEach(() => {
      props = createModalProps();
      render(Modal, { props });
    });

    it('calls onClose when clicking close button', async () => {
      await fireEvent.click(screen.getByTestId('modal-close-button'));
      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when clicking backdrop', async () => {
      await fireEvent.click(screen.getByTestId('modal-backdrop'));
      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('prevents event bubbling when clicking modal content', async () => {
      const modalContent = screen.getByRole('document');
      await fireEvent.click(modalContent);
      expect(props.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(Modal, { props: createModalProps() });
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('has focusable elements', () => {
      render(Modal, { props: createModalProps() });
      
      const focusableElements = screen.getByRole('dialog').querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Style and Layout', () => {
    it('applies correct backdrop styles', () => {
      render(Modal, { props: createModalProps() });
      
      const backdrop = screen.getByTestId('modal-backdrop');
      expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-kohl/75');
    });

    it('centers modal content', () => {
      render(Modal, { props: createModalProps() });
      
      const centeringContainer = screen.getByTestId('modal-backdrop')
        .nextElementSibling as HTMLElement;
      expect(centeringContainer).toHaveClass(
        'flex',
        'min-h-full',
        'items-end',
        'justify-center',
        'sm:items-center'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty strings for all text props', () => {
      render(Modal, {
        props: createModalProps({
          title: '',
          message: '',
          buttonText: ''
        })
      });
      
      expect(screen.getByTestId('modal-title')).toHaveTextContent('');
      expect(screen.getByTestId('modal-close-button')).toHaveTextContent('');
    });

    it('handles very long content without breaking layout', () => {
      const longText = 'a'.repeat(1000);
      render(Modal, {
        props: createModalProps({
          title: longText,
          message: longText
        })
      });
      
      const modalContent = screen.getByRole('document');
      expect(modalContent).toHaveClass('overflow-hidden');
    });

    it('handles rapid open/close transitions', async () => {
      const onClose = vi.fn();
      const { rerender } = render(Modal, {
        props: createModalProps({ open: false, onClose })
      });

      // Initial state
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Sequential state changes with minimal delay
      await rerender(createModalProps({ open: true, onClose }));
      await tick();
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await rerender(createModalProps({ open: false, onClose }));
      await tick();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await rerender(createModalProps({ open: true, onClose }));
      await tick();
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for final state

      // Final state verification
      const finalDialog = screen.getByRole('dialog');
      expect(finalDialog).toBeInTheDocument();
      expect(finalDialog).toHaveAttribute('aria-modal', 'true');
    });
  });
}); 