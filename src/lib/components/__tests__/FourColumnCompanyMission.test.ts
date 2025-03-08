import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte/svelte5';
import FourColumnCompanyMission from '../FourColumnCompanyMission.svelte';
import type { FooterData } from '$lib/types';

// Setup mocks before any data usage
vi.mock('$lib/assets/logos/magickme_title_cerulean.svg', () => ({
  default: '/mock/logo.svg'
}));

vi.mock('$lib/collections/footer/links.json', () => ({
  default: {
    socialLinks: [
      { name: 'Twitter', href: 'https://twitter.com', icon: 'path', newTab: true },
      { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'path', newTab: true }
    ],
    footerColumns: [
      {
        title: 'Solutions',
        items: [
          { name: 'Link 1', href: '/link1', newTab: false },
          { name: 'Link 2', href: '/link2', newTab: true }
        ]
      },
      {
        title: 'Support',
        items: [
          { name: 'Help', href: '/help', newTab: false },
          { name: 'Contact', href: '/contact', newTab: false }
        ]
      }
    ]
  }
}));

// Mock data defined after mocks
const mockData: FooterData = {
  socialLinks: [
    { name: 'Twitter', href: 'https://twitter.com', icon: 'path', newTab: true },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'path', newTab: true }
  ],
  footerColumns: [
    {
      title: 'Solutions',
      items: [
        { name: 'Link 1', href: '/link1', newTab: false },
        { name: 'Link 2', href: '/link2', newTab: true }
      ]
    },
    {
      title: 'Support',
      items: [
        { name: 'Help', href: '/help', newTab: false },
        { name: 'Contact', href: '/contact', newTab: false }
      ]
    }
  ]
};

describe('FourColumnCompanyMission', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('Basic Rendering', () => {
    it('renders the component', () => {
      render(FourColumnCompanyMission, {
        props: {
          dataTestid: 'footer',
          footerData: mockData
        }
      });
      
      expect(screen.getByTestId('footer')).toBeTruthy();
    });

    it('renders the logo', () => {
      render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });
      
      const logo = screen.getByRole('img', { name: /Magick\.Me Logo/i });
      expect(logo).toBeTruthy();
      expect(logo.getAttribute('src')).toBe('/mock/logo.svg');
    });

    it('renders the mission statement', () => {
      render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });
      
      expect(screen.getByText(/Making the world a better place/)).toBeTruthy();
    });

    it('handles empty footer data', () => {
      render(FourColumnCompanyMission, {
        props: { 
          footerData: {
            socialLinks: [],
            footerColumns: []
          }
        }
      });
      
      expect(screen.getByRole('img', { name: /Magick\.Me Logo/i })).toBeTruthy();
      expect(screen.getByText(/Making the world a better place/)).toBeTruthy();
    });

    it('handles missing newTab property', () => {
      const incompleteData = {
        ...mockData,
        socialLinks: [{ name: 'Twitter', href: 'https://twitter.com', icon: 'path' }]
      };
      
      render(FourColumnCompanyMission, {
        props: { footerData: incompleteData }
      });
      
      const link = screen.getByRole('link', { name: 'Twitter' });
      expect(link.getAttribute('target')).toBe('_self');
    });

    it('matches snapshot', () => {
      const { container } = render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });
      
      expect(container).toMatchSnapshot();
    });
  });

  describe('Social Links', () => {
    it('renders all social links', () => {
      render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });

      mockData.socialLinks.forEach(link => {
        const socialLink = screen.getByRole('link', { name: link.name });
        expect(socialLink).toBeTruthy();
        expect(socialLink.getAttribute('href')).toBe(link.href);
        expect(socialLink.getAttribute('target')).toBe(link.newTab ? '_blank' : '_self');
      });
    });

    it('renders social icons', () => {
      render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });

      mockData.socialLinks.forEach(link => {
        const icon = screen.getByRole('link', { name: link.name }).querySelector('svg');
        expect(icon).toBeTruthy();
      });
    });
  });

  describe('Footer Columns', () => {
    it('renders all footer columns', () => {
      render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });

      mockData.footerColumns.forEach(column => {
        expect(screen.getByRole('heading', { name: column.title })).toBeTruthy();
        column.items.forEach(item => {
          const link = screen.getByRole('link', { name: item.name });
          expect(link).toBeTruthy();
          expect(link.getAttribute('href')).toBe(item.href);
        });
      });
    });
  });

  describe('Copyright', () => {
    it('renders current year', () => {
      render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });

      const year = new Date().getFullYear();
      expect(screen.getByText(new RegExp(year.toString()))).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });
      
      expect(screen.getByRole('contentinfo')).toBeTruthy(); // footer element
      expect(screen.getByLabelText('Footer')).toBeTruthy();
    });

    it('has correct link attributes for external links', () => {
      render(FourColumnCompanyMission, {
        props: { footerData: mockData }
      });

      const externalLinks = screen.getAllByRole('link')
        .filter(link => link.getAttribute('target') === '_blank');
        
      externalLinks.forEach(link => {
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      });
    });
  });
}); 