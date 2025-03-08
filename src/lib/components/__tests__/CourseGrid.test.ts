import { expect, test, describe } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte/svelte5';
import { courseGridTestUtils as utils } from './utils/courseGridTestUtils';

describe('CourseGrid', () => {
  describe('rendering', () => {
    test('basic structure', () => {
      utils.setup();
      expect(utils.dom.navigation.getNav()).toBeInTheDocument();
      expect(utils.dom.courses.getContainer()).toBeInTheDocument();
      expect(utils.dom.courses.getCards()).toHaveLength(2);
    });

    test('renders all tabs', () => {
      utils.setup();
      Object.values(utils.testData.tags).forEach(tabName => {
        expect(utils.dom.navigation.getTab(tabName)).toBeInTheDocument();
      });
    });
  });

  describe('tab functionality', () => {
    test('applies correct styles to selected tab', () => {
      utils.setup({ selectedTab: utils.testData.tags.frontend });
      utils.verify.tabSelection(utils.testData.tags.frontend);
    });

    test('updates selected tab on click', async () => {
      utils.setup();
      await utils.actions.selectTab(utils.testData.tags.frontend);
      utils.verify.tabSelection(utils.testData.tags.frontend);
    });
  });

  describe('accessibility', () => {
    test('meets ARIA requirements', () => {
      utils.setup({ selectedTab: utils.testData.tags.frontend });
      
      expect(utils.dom.navigation.getNav())
        .toHaveAttribute('aria-label', 'Tabs');
      
      utils.dom.navigation.getTabs().forEach(tab => {
        const isSelected = tab.textContent === utils.testData.tags.frontend;
        expect(tab).toHaveAttribute('aria-selected', isSelected.toString());
        if (isSelected) {
          expect(tab).toHaveAttribute('aria-current', 'page');
        } else {
          expect(tab).not.toHaveAttribute('aria-current');
        }
      });
    });
  });

  describe('course display', () => {
    test('renders course cards correctly', () => {
      const courses = utils.testData.createCourses(2);
      utils.setup({ displayCourses: courses });
      courses.forEach(utils.verify.courseCard);
    });

    test('handles empty course list', () => {
      utils.setup({ displayCourses: [] });
      utils.verify.emptyState();
    });
  });

  describe('reactivity', () => {
    test('updates when courses change', async () => {
      const { rerender } = utils.setup();
      await rerender({ displayCourses: utils.testData.createCourses(1) });
      expect(utils.dom.courses.getCards()).toHaveLength(1);
    });
  });
}); 