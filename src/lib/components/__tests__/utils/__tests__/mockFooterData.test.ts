import { describe, test, expect } from 'vitest';
import { mockFooterData, getMockFooterData } from '../mockFooterData';

describe('mockFooterData', () => {
  test('provides valid social links', () => {
    const { socialLinks } = mockFooterData;
    expect(socialLinks).toHaveLength(2);
    
    socialLinks.forEach(link => {
      expect(link).toHaveProperty('name');
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('icon');
      expect(link).toHaveProperty('newTab', true);
    });
  });

  test('provides footer columns', () => {
    const { footerColumns } = mockFooterData;
    expect(footerColumns).toHaveLength(4);
    
    footerColumns.forEach(column => {
      expect(column).toHaveProperty('title');
      expect(column.items).toBeInstanceOf(Array);
      expect(column.items.length).toBeGreaterThan(0);
      
      column.items.forEach(item => {
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('href');
        expect(item).toHaveProperty('newTab');
      });
    });
  });

  test('getMockFooterData returns deep clone', () => {
    const data1 = getMockFooterData();
    const data2 = getMockFooterData();
    
    expect(data1).toEqual(data2);
    expect(data1).not.toBe(data2);
    expect(data1.footerColumns[0]).not.toBe(data2.footerColumns[0]);
  });
}); 