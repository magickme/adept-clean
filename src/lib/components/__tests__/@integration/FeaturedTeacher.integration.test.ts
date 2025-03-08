import { render, fireEvent, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import FeaturedTeacher from '../../FeaturedTeacher.svelte';

describe('FeaturedTeacher Integration', () => {
  const mockProps = {
    title: 'Meet Our Team Member',
    description: 'Team description',
    dataTestid: 'featured-teacher',
    memberName: 'John Doe',
    memberRole: 'Senior Instructor',
    memberBio: 'Experienced teacher with 10+ years',
    memberImage: '/path/to/image.jpg',
    memberXLink: 'https://x.com/johndoe',
    memberLinkedinLink: 'https://linkedin.com/in/johndoe'
  };

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders teacher information and social links correctly', () => {
    const { getByTestId, getByAltText, getAllByRole } = render(FeaturedTeacher, {
      props: mockProps
    });

    const teacherName = getByTestId('featured-teacher').querySelector('h3');
    expect(teacherName?.textContent).toBe(mockProps.memberName);
    expect(getByAltText(mockProps.memberName)).toHaveAttribute('src', mockProps.memberImage);

    const socialLinks = getAllByRole('link');
    expect(socialLinks[0]).toHaveAttribute('href', mockProps.memberXLink);
    expect(socialLinks[1]).toHaveAttribute('href', mockProps.memberLinkedinLink);
  });

  it('opens modal with correct member details when View Details is clicked', async () => {
    const { getByTestId, getByRole } = render(FeaturedTeacher, {
      props: mockProps
    });

    await fireEvent.click(getByTestId('view-details-button'));
    vi.runAllTimers();

    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(getByTestId('modal-title')).toHaveTextContent(mockProps.memberName);
  });

  it('closes modal when close button is clicked', async () => {
    const { getByTestId, queryByRole } = render(FeaturedTeacher, {
      props: mockProps
    });

    await fireEvent.click(getByTestId('view-details-button'));
    vi.runAllTimers();

    await fireEvent.click(getByTestId('modal-close-button'));
    vi.runAllTimers();

    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles missing social links gracefully', () => {
    const propsWithoutSocial = {
      ...mockProps,
      memberXLink: undefined,
      memberLinkedinLink: undefined
    };

    const { container } = render(FeaturedTeacher, {
      props: propsWithoutSocial
    });

    const socialLinks = container.querySelectorAll('.mt-6.flex.gap-x-6 a');
    expect(socialLinks.length).toBe(0);
  });

  it('maintains accessibility attributes in modal', async () => {
    const { getByTestId, getByRole } = render(FeaturedTeacher, {
      props: mockProps
    });

    await fireEvent.click(getByTestId('view-details-button'));
    vi.runAllTimers();

    const dialog = getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('handles keyboard interactions for modal', async () => {
    const { getByTestId, queryByRole } = render(FeaturedTeacher, {
      props: mockProps
    });

    // Open modal
    await fireEvent.click(getByTestId('view-details-button'));
    vi.runAllTimers();

    // Get the modal backdrop which likely has the event listener
    const modalBackdrop = getByTestId('modal-backdrop');
    expect(modalBackdrop).toBeInTheDocument();

    // Send Escape key to the backdrop
    await fireEvent.keyDown(modalBackdrop, { key: 'Escape', code: 'Escape' });
    vi.runAllTimers();

    // Verify modal is closed
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('focuses on close button when modal opens', async () => {
    const { getByTestId } = render(FeaturedTeacher, {
      props: mockProps
    });

    await fireEvent.click(getByTestId('view-details-button'));
    vi.runAllTimers();

    const closeButton = getByTestId('modal-close-button');
    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);
  });
}); 