import { describe, it, expect } from 'vitest';
import { curriculumFeaturesTestUtils } from './utils/curriculumFeaturesTestUtils';

describe('CurriculumFeatures', () => {
  const utils = curriculumFeaturesTestUtils;

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      const { container } = utils.setup();
      expect(container).toBeInTheDocument();
      utils.verify.layout(container);
    });

    it('renders with minimal data', () => {
      const { mockData } = utils.testData;
      utils.setup(mockData.minimal);
      utils.verify.headerContent(mockData.minimal.data.curriculum_head);
    });

    it('renders with full data', () => {
      const { mockData } = utils.testData;
      utils.setup(mockData.full);
      utils.verify.headerContent(mockData.full.data.curriculum_head);
      utils.verify.featureList(mockData.full.data.curriculum_features);
    });
  });

  describe('Features', () => {
    it('renders all features with descriptions when provided', () => {
      const { mockData } = utils.testData;
      utils.setup(mockData.full);
      
      mockData.full.data.curriculum_features.forEach(feature => {
        const featureElement = utils.dom.features.getFeatureByName(feature.name);
        expect(featureElement).toBeInTheDocument();
        
        if (feature.description) {
          const description = utils.dom.features.getFeatureDescription(feature.description);
          expect(description).toBeInTheDocument();
        }
      });
    });

    it('handles features without descriptions', () => {
      const { mockData } = utils.testData;
      utils.setup(mockData.minimal);
      const feature = mockData.minimal.data.curriculum_features[0];
      
      const featureElement = utils.dom.features.getFeatureByName(feature.name);
      expect(featureElement).toBeInTheDocument();
      expect(utils.dom.features.getFeatureDescription('any')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies semantic HTML structure', () => {
      utils.setup();
      expect(utils.dom.header.getPrehead().tagName.toLowerCase()).toBe('h2');
      const featureList = document.querySelector('dl');
      expect(featureList).toBeInTheDocument();
      expect(featureList?.tagName.toLowerCase()).toBe('dl');
    });

    it('applies correct text styles', () => {
      utils.setup();
      expect(utils.dom.header.getPrehead()).toHaveClass('text-cerulean');
      expect(utils.dom.header.getTitle()).toHaveClass('text-ivory');
    });
  });
}); 