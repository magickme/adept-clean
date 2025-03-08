import { describe, test, expect } from 'vitest';
import { courseGridTestUtils } from '../courseGridTestUtils';

describe('courseGridTestUtils', () => {
  describe('test data', () => {
    test('provides valid tags', () => {
      const { tags } = courseGridTestUtils.testData;
      expect(tags.all).toBe('All');
      expect(tags.frontend).toBe('Frontend');
      expect(tags.backend).toBe('Backend');
    });

    test('creates valid course data', () => {
      const course = courseGridTestUtils.testData.createCourse(1);
      expect(course).toMatchObject({
        id: 1,
        name: 'Course 1',
        author: 'Author 1',
        author_image: expect.stringContaining('author1'),
        image_url: expect.stringContaining('course1'),
        link: expect.stringContaining('course-1'),
        skill_level: expect.any(String),
        duration: expect.stringContaining('hours')
      });
    });

    test('creates multiple courses', () => {
      const courses = courseGridTestUtils.testData.createCourses(3);
      expect(courses).toHaveLength(3);
      courses.forEach((course, i) => {
        expect(course.id).toBe(i + 1);
      });
    });
  });

  describe('dom queries', () => {
    test('provides navigation queries', () => {
      expect(courseGridTestUtils.dom.navigation.getNav).toBeInstanceOf(Function);
      expect(courseGridTestUtils.dom.navigation.getTabs).toBeInstanceOf(Function);
      expect(courseGridTestUtils.dom.navigation.getSelectedTab).toBeInstanceOf(Function);
    });

    test('provides course queries', () => {
      expect(courseGridTestUtils.dom.courses.getCards).toBeInstanceOf(Function);
      expect(courseGridTestUtils.dom.courses.getContainer).toBeInstanceOf(Function);
      expect(courseGridTestUtils.dom.courses.getGrid).toBeInstanceOf(Function);
    });
  });
}); 