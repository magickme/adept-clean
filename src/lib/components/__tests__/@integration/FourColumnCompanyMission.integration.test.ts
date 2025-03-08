import { render } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import FourColumnCompanyMission from '../../FourColumnCompanyMission.svelte';

describe('FourColumnCompanyMission Integration', () => {
  const mockFooterData = {
    socialLinks: [
      { name: 'Twitter', href: 'https://twitter.com', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', newTab: true },
      { name: 'Facebook', href: 'https://facebook.com', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', newTab: true }
    ],
    footerColumns: [
      {
        title: 'Company',
        items: [
          { name: 'About', href: '/about' },
          { name: 'Careers', href: '/careers' }
        ]
      },
      {
        title: 'Resources',
        items: [
          { name: 'Blog', href: '/blog' },
          { name: 'Help Center', href: '/help' }
        ]
      }
    ]
  };

  const mockProps = {
    dataTestid: 'company-mission',
    footerData: mockFooterData
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders social links correctly', () => {
    const { getByText } = render(FourColumnCompanyMission, {
      props: mockProps
    });

    mockFooterData.socialLinks.forEach(link => {
      const socialLink = getByText(link.name).closest('a');
      expect(socialLink).toHaveAttribute('href', link.href);
      expect(socialLink).toHaveAttribute('target', '_blank');
      expect(socialLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders footer columns with correct items', () => {
    const { getByText } = render(FourColumnCompanyMission, {
      props: mockProps
    });

    mockFooterData.footerColumns.forEach(column => {
      const columnTitle = getByText(column.title);
      expect(columnTitle).toBeInTheDocument();

      column.items.forEach(item => {
        const columnItem = getByText(item.name);
        expect(columnItem).toHaveAttribute('href', item.href);
      });
    });
  });

  it('maintains responsive layout classes', () => {
    const { container } = render(FourColumnCompanyMission, {
      props: mockProps
    });

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-kohl');

    const grid = container.querySelector('.xl\\:grid');
    expect(grid).toHaveClass('xl:grid-cols-3');
  });

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      dataTestid: 'company-mission'
    };

    const { getByTestId } = render(FourColumnCompanyMission, {
      props: minimalProps
    });

    const footer = getByTestId('company-mission');
    expect(footer).toBeInTheDocument();
  });

  it('applies correct text styles for different content types', () => {
    const { getByAltText, getByText } = render(FourColumnCompanyMission, {
      props: mockProps
    });

    const logo = getByAltText('Magick.Me Logo');
    expect(logo).toBeInTheDocument();

    const missionStatement = getByText('Making the world a better place by democratizing access to spirituality.');
    expect(missionStatement).toHaveClass('text-sm', 'leading-6', 'text-ivory');
  });

  it('renders current year in copyright notice', () => {
    const { getByText } = render(FourColumnCompanyMission, {
      props: mockProps
    });

    const currentYear = new Date().getFullYear();
    const copyrightNotice = getByText(`© ${currentYear} Ultraculture Inc. All rights reserved.`);
    expect(copyrightNotice).toBeInTheDocument();
  });
}); 