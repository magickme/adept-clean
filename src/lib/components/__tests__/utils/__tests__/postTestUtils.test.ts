import { describe, test, expect, vi } from 'vitest';
import { createPostTestUtils, PostTestUtilsFactory } from '../postTestUtils';

describe('postTestUtils', () => {
  describe('PostTestUtilsFactory', () => {
    test('creates factory with default config', () => {
      const factory = new PostTestUtilsFactory();
      const utils = factory.create();
      
      expect(utils.config).toBeDefined();
      expect(utils.queries).toBeDefined();
      expect(utils.verify).toBeDefined();
      expect(utils.testData).toBeDefined();
    });
  });

  describe('createPostTestUtils', () => {
    const utils = createPostTestUtils();

    test('provides post queries', () => {
      expect(utils.queries.posts.getTimeElement).toBeInstanceOf(Function);
      expect(utils.queries.posts.getTagsContainer).toBeInstanceOf(Function);
      expect(utils.queries.posts.getPostImage).toBeInstanceOf(Function);
      expect(utils.queries.posts.getAuthorImage).toBeInstanceOf(Function);
    });

    test('provides verifications', () => {
      expect(utils.verify.postContent).toBeInstanceOf(Function);
      expect(utils.verify.images).toBeInstanceOf(Function);
      expect(utils.verify.accessibility).toBeInstanceOf(Function);
    });

    test('provides test data', () => {
      const post = utils.testData.createPost();
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('slug');
      expect(post).toHaveProperty('feature_image');
      expect(post).toHaveProperty('primary_author');
    });
  });
}); 