import { expect, test, describe, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte/svelte5';
import FeaturedTeacher from '../FeaturedTeacher.svelte';
import type { FeaturedTeacherProps } from '../../types/FeaturedTeacherher';

describe('FeaturedTeacher', () => {
  const defaultProps: FeaturedTeacherProps = {
    title: 'Meet Our Team Member',
    description: 'Team description',
    dataTestid: 'featured-teacher',
    memberName: 'John Doe',
    memberRole: 'Senior Teacher',
    memberBio: 'Teacher bio',
    memberImage: '/path/to/image.jpg',
    memberXLink: 'https://x.com/johndoe',
    memberLinkedinLink: 'https://linkedin.com/in/johndoe'
  };

  // Basic Rendering
  test('renders with default props', () => {
    const { container } = render(FeaturedTeacher, { props: defaultProps });
    expect(container).toMatchSnapshot();
    expect(screen.getByTestId('featured-teacher')).toBeInTheDocument();
  });

  // Props Validation
  test('renders with minimal props', () => {
    const minimalProps = {
      memberName: 'John Doe',
      memberRole: 'Teacher',
      memberBio: 'Bio'
    };
    render(FeaturedTeacher, { props: minimalProps });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  // Social Links
  test('renders social links when provided', () => {
    render(FeaturedTeacher, { props: defaultProps });
    expect(screen.getByRole('link', { name: /x/i })).toHaveAttribute('href', defaultProps.memberXLink);
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', defaultProps.memberLinkedinLink);
  });

  test('does not render social links when not provided', () => {
    const propsWithoutSocial = { ...defaultProps, memberXLink: undefined, memberLinkedinLink: undefined };
    render(FeaturedTeacher, { props: propsWithoutSocial });
    expect(screen.queryByRole('link', { name: /x/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
  });

  // Modal Functionality
  describe('Modal', () => {
    beforeEach(() => {
      render(FeaturedTeacher, { props: defaultProps });
    });

    test('opens modal on view details click', async () => {
      const viewDetailsBtn = screen.getByTestId('view-details-button');
      await fireEvent.click(viewDetailsBtn);
      
      const dialog = screen.getByRole('dialog');
      const modalTitle = screen.getByTestId('modal-title');
      
      expect(dialog).toBeInTheDocument();
      expect(modalTitle).toHaveTextContent(defaultProps.memberName);
      expect(screen.getByText(defaultProps.memberRole)).toBeInTheDocument();
    });

    test('closes modal on close button click', async () => {
      // Open modal
      await fireEvent.click(screen.getByTestId('view-details-button'));
      // Close modal
      await fireEvent.click(screen.getByTestId('modal-close-button'));
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('closes modal on backdrop click', async () => {
      // Open modal
      await fireEvent.click(screen.getByTestId('view-details-button'));
      // Click backdrop
      const backdrop = screen.getByTestId('modal-backdrop');
      await fireEvent.click(backdrop);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // Accessibility
  test('meets accessibility requirements', async () => {
    render(FeaturedTeacher, { props: defaultProps });
    
    // Open modal first
    await fireEvent.click(screen.getByTestId('view-details-button'));
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  // Image Handling
  test('renders member image with correct attributes', () => {
    render(FeaturedTeacher, { props: defaultProps });
    const img = screen.getByAltText(defaultProps.memberName);
    
    expect(img).toHaveAttribute('src', defaultProps.memberImage);
    expect(img).toHaveClass('aspect-[3/2]', 'w-full', 'rounded-2xl', 'object-cover');
  });
}); 