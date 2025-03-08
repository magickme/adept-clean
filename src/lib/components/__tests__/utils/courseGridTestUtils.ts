import { screen, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import { expect } from 'vitest';
import CourseGrid from '../../CourseGrid.svelte';
import { createComponentTestUtils } from './componentTestUtils';
import type { ComponentTestConfig } from './componentTestUtils';

// Types
export interface Course {
  readonly id: number;
  readonly name: string;
  readonly author: string;
  readonly author_image: string;
  readonly image_url: string;
  readonly link: string;
  readonly skill_level: string;
  readonly duration: string;
}

interface CourseGridProps {
  readonly tagMap: Readonly<Record<string, string>>;
  readonly selectedTab: string;
  readonly displayCourses: ReadonlyArray<Course>;
}

// Constants
const Selectors = {
  container: 'three-column-background-images',
  tabList: 'Tabs'
} as const;

const Classes = {
  selected: {
    border: 'border-cerulean',
    text: 'text-cerulean'
  }
} as const;

// Test Data Factory
const createTestData = () => {
  const tags = {
    all: 'All',
    frontend: 'Frontend',
    backend: 'Backend'
  } as const;

  const skillLevels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate'
  } as const;

  const createCourse = (id: number): Course => ({
    id,
    name: `Course ${id}`,
    author: `Author ${id}`,
    author_image: `/images/author${id}.jpg`,
    image_url: `/images/course${id}.jpg`,
    link: `/courses/course-${id}`,
    skill_level: id % 2 ? skillLevels.beginner : skillLevels.intermediate,
    duration: `${id * 2} hours`
  });

  return {
    tags,
    skillLevels,
    createTagMap: () => ({
      [tags.all]: 'all',
      [tags.frontend]: 'frontend',
      [tags.backend]: 'backend'
    }),
    createCourse,
    createCourses: (count: number): Course[] => 
      Array.from({ length: count }, (_, i) => createCourse(i + 1))
  };
};

// Test Utils Factory
export const courseGridTestUtils = createComponentTestUtils<
  typeof CourseGrid,
  CourseGridProps,
  ComponentTestConfig<typeof Selectors, typeof Classes>
>({
  component: CourseGrid,
  config: {
    selectors: Selectors,
    classes: Classes
  },
  defaultProps: {
    tagMap: createTestData().createTagMap(),
    selectedTab: createTestData().tags.all,
    displayCourses: createTestData().createCourses(2)
  },
  createDomQueries: (config) => ({
    navigation: {
      getNav: () => screen.getByRole('navigation', { name: config.selectors.tabList }),
      getTabs: () => screen.getAllByRole('tab'),
      getTab: (name: string) => screen.getByRole('tab', { name }),
      getSelectedTab: () => screen.getByRole('tab', { selected: true })
    },
    courses: {
      getCards: () => screen.queryAllByRole('article'),
      getContainer: () => screen.getByTestId(config.selectors.container),
      getGrid: () => {
        const container = screen.getByTestId(config.selectors.container);
        const grid = container.querySelector('.grid');
        if (!grid) throw new Error('Grid element not found');
        return grid as HTMLElement;
      },
      getLink: (name: string) => {
        const link = screen.getByText(name).closest('a');
        if (!link) throw new Error(`Link for "${name}" not found`);
        return link;
      },
      getImage: (alt: string) => screen.getByAltText(alt) as HTMLImageElement
    }
  }),
  createActions: () => ({
    async selectTab(tabName: string) {
      await fireEvent.click(screen.getByRole('tab', { name: tabName }));
      await tick();
    }
  }),
  createVerifications: (config) => ({
    tabSelection: (tabName: string) => {
      const tab = screen.getByRole('tab', { name: tabName });
      expect(tab).toHaveAttribute('aria-selected', 'true');
      expect(tab).toHaveAttribute('aria-current', 'page');
      expect(tab).toHaveClass(
        config.classes.selected.border,
        config.classes.selected.text
      );
    },
    courseCard: (course: Course) => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
      expect(screen.getByText(course.author)).toBeInTheDocument();
      expect(screen.getByText(course.skill_level)).toBeInTheDocument();
      expect(screen.getByText(course.duration)).toBeInTheDocument();
      
      const courseImage = screen.getByAltText(course.name);
      expect(courseImage).toHaveAttribute('src', course.image_url);
      
      const authorImage = screen.getByAltText(course.author);
      expect(authorImage).toHaveAttribute('src', course.author_image);
      
      const link = screen.getByText(course.name).closest('a');
      expect(link).toHaveAttribute('href', course.link);
    },
    emptyState: () => {
      const container = screen.getByTestId(config.selectors.container);
      const grid = container.querySelector('.grid');
      
      expect(container).toBeInTheDocument();
      expect(grid).toBeInTheDocument();
      expect(screen.queryAllByRole('article')).toHaveLength(0);
      expect(grid?.children).toHaveLength(0);
    }
  }),
  createTestData
}); 