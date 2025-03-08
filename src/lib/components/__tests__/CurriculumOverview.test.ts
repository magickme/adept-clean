import { expect, test, describe } from 'vitest';
import { screen } from '@testing-library/svelte';
import CurriculumOverview from '../CurriculumOverview.svelte';
import { createComponentTestUtils } from './utils/componentTestUtils';
import type { CurriculumHead, Feature } from '$lib/types';

// Types
interface TestCase {
  readonly curriculumHead: CurriculumHead;
  readonly features: Feature[];
}

type TestCases = Record<'MINIMAL' | 'FULL', TestCase>;

// Test Configuration
namespace TestConfig {
  export const CASES: TestCases = {
    MINIMAL: {
      curriculumHead: {
        prehead: 'Test Prehead',
        title: 'Test Title'
      },
      features: [{ name: 'Feature 1' }]
    },
    FULL: {
      curriculumHead: {
        prehead: 'Full Prehead',
        title: 'Full Title', 
        description: 'Full Description'
      },
      features: [
        { name: 'Feature 1', description: 'Description 1' },
        { name: 'Feature 2', description: 'Description 2' }
      ]
    }
  } as const;

  export const COMPONENT = {
    selectors: {
      container: '.bg-kohl',
      grid: '.grid',
      featureList: 'dl.col-span-2',
      featureItem: '.relative.pl-9',
      header: {
        prehead: 'h2',
        title: '.text-3xl',
        description: '.mt-6'
      }
    },
    classes: {
      text: {
        prehead: 'text-cerulean',
        title: 'text-ivory',
        description: 'text-ivory'
      },
      layout: {
        container: ['bg-kohl', 'py-24'],
        grid: ['grid-cols-1', 'lg:grid-cols-3'],
        featureList: ['col-span-2', 'grid']
      }
    }
  } as const;
}

// Test Helpers
namespace TestHelpers {
  export const queries = {
    header: {
      getPrehead: () => screen.getByRole('heading', { level: 2 }),
      getTitle: () => screen.getByText((content, element) => 
        element?.classList.contains('text-3xl') && Boolean(content)),
      getDescription: () => screen.queryByText((content, element) => 
        element?.classList.contains('mt-6') && Boolean(content))
    },
    features: {
      getList: () => screen.getByRole('list', { hidden: true }),
      getItems: () => screen.getAllByRole('term'),
      getByName: (name: string) => screen.getByRole('term', { name }),
      getDescription: (description: string) => 
        screen.queryByRole('definition', { name: description })
    }
  } as const;

  export const verify = {
    header: {
      content: (head: CurriculumHead, classes = TestConfig.COMPONENT.classes) => {
        const prehead = screen.getByRole('heading', { level: 2 });
        const title = screen.getByText(head.title);
        
        expect(prehead).toHaveClass(classes.text.prehead);
        expect(title).toHaveClass(classes.text.title);
        
        if (head.description) {
          const description = screen.getByText(head.description);
          expect(description).toHaveClass(classes.text.description);
        }
      }
    },
    features: {
      structure: (container: HTMLElement, classes = TestConfig.COMPONENT.classes) => {
        const featureList = container.querySelector('dl');
        expect(featureList).toBeInTheDocument();
        expect(featureList).toHaveClass(...classes.layout.featureList);
      },
      content: (features: Feature[]) => {
        const terms = screen.getAllByRole('term');
        expect(terms).toHaveLength(features.length);
        
        features.forEach((feature, index) => {
          expect(terms[index]).toHaveTextContent(feature.name);
          if (feature.description) {
            expect(screen.getByText(feature.description)).toBeInTheDocument();
          }
        });
      }
    },
    accessibility: {
      structure: () => {
        const terms = screen.getAllByRole('term');
        const definitions = screen.getAllByRole('definition');
        expect(terms.length).toBeGreaterThan(0);
        expect(definitions.length).toBe(terms.length);
      },
      decorativeElements: () => {
        document.querySelectorAll('svg').forEach(icon => {
          expect(icon).toHaveAttribute('aria-hidden', 'true');
        });
      }
    }
  } as const;
}

// Test Utils Setup
const utils = createComponentTestUtils({
  component: CurriculumOverview,
  config: TestConfig.COMPONENT,
  defaultProps: TestConfig.CASES.MINIMAL,
  createDomQueries: () => TestHelpers.queries,
  createActions: () => ({}),
  createVerifications: () => ({
    headerContent: TestHelpers.verify.header.content,
    featureStructure: TestHelpers.verify.features.structure,
    featureContent: TestHelpers.verify.features.content,
    accessibility: () => {
      TestHelpers.verify.accessibility.structure();
      TestHelpers.verify.accessibility.decorativeElements();
    }
  }),
  createTestData: () => ({
    minimal: TestConfig.CASES.MINIMAL,
    full: TestConfig.CASES.FULL
  })
});

// Tests
describe('CurriculumOverview', () => {
  const { MINIMAL, FULL } = TestConfig.CASES;

  test('renders minimal content correctly', () => {
    const { container } = utils.setup(MINIMAL);
    utils.verify.headerContent(MINIMAL.curriculumHead);
    utils.verify.featureStructure(container);
    utils.verify.featureContent(MINIMAL.features);
  });

  test('renders full content with descriptions', () => {
    const { container } = utils.setup(FULL);
    utils.verify.headerContent(FULL.curriculumHead);
    utils.verify.featureStructure(container);
    utils.verify.featureContent(FULL.features);
  });

  test('handles empty features array', () => {
    const { container } = utils.setup({
      curriculumHead: MINIMAL.curriculumHead,
      features: []
    });

    const featureList = container.querySelector('dl');
    expect(featureList).toBeInTheDocument();
    expect(featureList?.children).toHaveLength(0);
  });

  test('maintains accessibility structure', () => {
    utils.setup(FULL);
    utils.verify.accessibility();
  });
}); 