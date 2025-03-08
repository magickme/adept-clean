import { render } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MembershipPitch from '../../MembershipPitch.svelte';

describe('MembershipPitch Integration', () => {
  const mockProps = {
    membershipInfo: 'Join our community and access exclusive content!',
    logoUrl: '/path/to/logo.png',
    linkUrl: '/membership',
    isDarkMode: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders membership information correctly', () => {
    const { getByText } = render(MembershipPitch, {
      props: mockProps
    });

    const membershipInfo = getByText(mockProps.membershipInfo);
    expect(membershipInfo).toBeInTheDocument();
  });

  it('renders logo with correct attributes', () => {
    const { getByAltText } = render(MembershipPitch, {
      props: mockProps
    });

    const logo = getByAltText('Logo');
    expect(logo).toHaveAttribute('src', mockProps.logoUrl);
  });

  it('handles link interactions correctly', () => {
    const { getAllByRole } = render(MembershipPitch, {
      props: mockProps
    });

    const links = getAllByRole('link', { name: /membership link/i });
    expect(links).toHaveLength(2);

    links.forEach(link => {
      expect(link).toHaveAttribute('href', mockProps.linkUrl);
    });
  });

  it('applies correct theme classes based on isDarkMode', () => {
    const { container, rerender } = render(MembershipPitch, {
      props: { ...mockProps, isDarkMode: false }
    });

    const bgElement = container.querySelector('.bg-kohl');
    expect(bgElement).toBeInTheDocument();

    rerender({ ...mockProps, isDarkMode: true });

    const darkBgElement = container.querySelector('.bg-gray-800');
    expect(darkBgElement).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      membershipInfo: 'Join us today!',
      linkUrl: '/membership'
    };

    const { getByText } = render(MembershipPitch, {
      props: minimalProps
    });

    const membershipInfo = getByText(minimalProps.membershipInfo);
    expect(membershipInfo).toBeInTheDocument();
  });
}); 