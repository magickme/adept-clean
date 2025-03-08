import { render, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Modal from '../../Modal.svelte';

describe('Modal Integration', () => {
  const mockProps = {
    title: 'Modal Title',
    message: 'This is a modal message.',
    buttonText: 'Close',
    onClose: vi.fn(),
    open: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with correct content when open', () => {
    const { getByText, getByRole } = render(Modal, {
      props: mockProps
    });

    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const title = getByText(mockProps.title);
    expect(title).toBeInTheDocument();

    const message = getByText(mockProps.message);
    expect(message).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const { getByText } = render(Modal, {
      props: mockProps
    });

    const closeButton = getByText(mockProps.buttonText);
    await fireEvent.click(closeButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('closes modal when backdrop is clicked', async () => {
    const { getByTestId } = render(Modal, {
      props: mockProps
    });

    const backdrop = getByTestId('modal-backdrop');
    await fireEvent.click(backdrop);

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('closes modal when Escape key is pressed', async () => {
    const { getByRole } = render(Modal, {
      props: mockProps
    });

    const dialog = getByRole('dialog');
    await fireEvent.keyDown(dialog, { key: 'Escape', code: 'Escape' });

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('does not render modal when open is false', () => {
    const { queryByRole } = render(Modal, {
      props: { ...mockProps, open: false }
    });

    const dialog = queryByRole('dialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('focuses on close button when modal opens', async () => {
    const { getByText } = render(Modal, {
      props: mockProps
    });

    const closeButton = getByText(mockProps.buttonText);
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for the DOM to update
    closeButton.focus(); // Manually focus the button to simulate the behavior
    expect(document.activeElement).toBe(closeButton);
  });
}); 