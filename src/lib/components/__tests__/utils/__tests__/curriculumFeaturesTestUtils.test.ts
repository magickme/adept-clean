import { describe, test, expect } from 'vitest';
import { curriculumFeaturesTestUtils, Selectors, Classes } from '../curriculumFeaturesTestUtils';

describe('curriculumFeaturesTestUtils', () => {
  describe('test data', () => {
    test('provides test text constants', () => {
      const { TestText } = curriculumFeaturesTestUtils.testData;
      expect(TestText.default.prehead).toBe('Test Prehead');
      expect(TestText.minimal.title).toBe('Minimal Title');
      expect(TestText.full.features).toHaveLength(3);
    });

    test('creates curriculum data', () => {
      const { createCurriculumData } = curriculumFeaturesTestUtils.testData;
      const data = createCurriculumData(
        curriculumFeaturesTestUtils.testData.TestText.minimal,
        [{ name: 'Feature' }]
      );

      expect(data.data.curriculum_head.prehead).toBe('Minimal Prehead');
      expect(data.data.curriculum_features).toHaveLength(1);
    });
  });

  describe('verifications', () => {
    test('provides verification methods', () => {
      expect(curriculumFeaturesTestUtils.verify.headerContent).toBeInstanceOf(Function);
      expect(curriculumFeaturesTestUtils.verify.featureList).toBeInstanceOf(Function);
      expect(curriculumFeaturesTestUtils.verify.layout).toBeInstanceOf(Function);
    });
  });

  describe('selectors and classes', () => {
    test('provides layout selectors', () => {
      expect(Selectors.layout.container).toBe('.bg-ivory');
      expect(Selectors.layout.grid).toBe('.grid');
    });

    test('provides style classes', () => {
      expect(Classes.layout.container).toContain('bg-ivory');
      expect(Classes.text.prehead).toContain('text-cerulean');
    });
  });
}); 