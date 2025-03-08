import { screen } from '@testing-library/svelte';
import { expect } from 'vitest';
import CurriculumFeatures from '../../CurriculumFeatures.svelte';
import { createComponentTestUtils } from './componentTestUtils';
import type { ComponentTestConfig } from './componentTestUtils';

// Types
interface CurriculumFeature {
  name: string;
  description?: string;
}

interface CurriculumHead {
  prehead: string;
  title: string;
  description?: string;
}

interface CurriculumFeaturesProps {
  data: {
    curriculum_head: CurriculumHead;
    curriculum_features: CurriculumFeature[];
  };
}

// Constants
const TestText = {
  default: {
    prehead: 'Test Prehead',
    title: 'Test Title',
    description: 'Test Description'
  },
  minimal: {
    prehead: 'Minimal Prehead',
    title: 'Minimal Title'
  },
  full: {
    prehead: 'Full Prehead',
    title: 'Full Title',
    description: 'Full Description',
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  }
} as const;

export const Selectors = {
  layout: {
    container: '.bg-ivory',
    grid: '.grid',
    featureContainer: '.relative.pl-9',
    wrapper: '.mx-auto.max-w-7xl'
  },
  text: {
    title: 'p.text-3xl',
    description: 'p.text-gray-300',
    featureTitle: 'dt.font-semibold'
  },
  features: {
    list: 'dl.col-span-2',
    item: 'dt.font-semibold',
    description: 'dd.mt-2'
  }
} as const;

export const Classes = {
  layout: {
    container: ['bg-ivory', 'dark:bg-kohl'],
    grid: ['grid-cols-1', 'lg:grid-cols-3'],
    wrapper: ['mx-auto', 'max-w-7xl']
  },
  text: {
    prehead: ['text-cerulean'],
    title: ['text-ivory'],
    description: ['text-gray-300'],
    featureTitle: ['text-ivory', 'font-semibold']
  },
  features: {
    list: ['col-span-2', 'grid', 'grid-cols-1', 'sm:grid-cols-2'],
    title: ['font-semibold', 'text-ivory'],
    description: ['mt-2']
  }
} as const;

// Add mock data
const mockData = {
  minimal: {
    data: {
      curriculum_head: TestText.minimal,
      curriculum_features: [{ name: 'Feature 1' }]
    }
  },
  full: {
    data: {
      curriculum_head: TestText.full,
      curriculum_features: [
        { name: 'Feature 1', description: 'Description 1' },
        { name: 'Feature 2', description: 'Description 2' },
        { name: 'Feature 3', description: 'Description 3' }
      ]
    }
  }
};

// Update DOM queries
const createDomQueries = (config: ComponentTestConfig<typeof Selectors, typeof Classes>) => ({
  header: {
    getPrehead: () => screen.getByRole('heading', { name: /prehead/i }),
    getTitle: () => screen.getByText((content, element) => 
      element?.tagName.toLowerCase() === 'p' && content.includes('Title')),
    getDescription: () => screen.queryByText((content, element) => 
      element?.tagName.toLowerCase() === 'p' && content.includes('Description'))
  },
  features: {
    getList: () => screen.getByRole('list', { hidden: true }),
    getFeatureList: () => screen.getByRole('definition', { hidden: true }),
    getFeature: (name: string) => screen.getByRole('term', { name }),
    getFeatureByName: (name: string) => {
      return screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'span' && content === name;
      }).closest('dt');
    },
    getFeatureDescription: (text: string) => screen.queryByText(text, { selector: 'dd' })
  }
});

// Update verifications
const createVerifications = (config: ComponentTestConfig<typeof Selectors, typeof Classes>) => ({
  headerContent: (head: CurriculumHead) => {
    const prehead = screen.getByRole('heading', { name: head.prehead });
    const title = screen.getByText(head.title);
    
    expect(prehead).toHaveClass(...config.classes.text.prehead);
    expect(title).toHaveClass(...config.classes.text.title);
    
    if (head.description) {
      const description = screen.getByText(head.description);
      expect(description).toHaveClass(...config.classes.text.description);
    }
  },
  featureList: (features: CurriculumFeature[]) => {
    const list = document.querySelector('dl');
    if (!list) {
      throw new Error('Could not find feature list element (dl)');
    }
    expect(list).toHaveClass(...config.classes.features.list);
    
    features.forEach(feature => {
      const featureElement = screen.getByText((content, element) => {
        return element?.tagName.toLowerCase() === 'span' && 
               element?.classList.contains('feature-name') && 
               content === feature.name;
      });
      
      const dt = featureElement.closest('dt');
      expect(dt).toHaveClass(...config.classes.text.featureTitle);
      
      if (feature.description) {
        const description = screen.getByText(feature.description, { selector: 'dd' });
        expect(description).toBeInTheDocument();
      }
    });
  },
  layout: (container: HTMLElement) => {
    const outerContainer = container.firstElementChild;
    const wrapper = container.querySelector('.mx-auto.max-w-7xl');
    const grid = container.querySelector('.grid');

    expect(outerContainer).toHaveClass('bg-ivory', 'dark:bg-kohl');
    expect(wrapper).toHaveClass('mx-auto', 'max-w-7xl');
    expect(grid).toHaveClass('grid');
  }
});

export const curriculumFeaturesTestUtils = createComponentTestUtils({
  component: CurriculumFeatures,
  config: {
    selectors: Selectors,
    classes: Classes
  },
  defaultProps: {
    data: {
      curriculum_head: TestText.default,
      curriculum_features: []
    }
  },
  createDomQueries,
  createVerifications,
  createTestData: () => ({
    TestText,
    mockData,
    createCurriculumData: (head: typeof TestText[keyof typeof TestText], features: Array<{ name: string }>) => ({
      data: {
        curriculum_head: head,
        curriculum_features: features
      }
    })
  })
}); 