import { describe, it, expect } from 'vitest';
import { validateSchema } from '../validation.js';

describe('validateSchema', () => {
  describe('Article validation', () => {
    it('should pass for valid article', () => {
      const result = validateSchema({
        '@type': 'Article',
        headline: 'Test Article',
        author: { '@type': 'Person', name: 'John' },
        datePublished: '2025-01-01',
        image: 'https://example.com/image.jpg',
        publisher: { '@type': 'Organization', name: 'Publisher' },
      });
      expect(result.valid).toBe(true);
    });

    it('should fail for article without headline', () => {
      const result = validateSchema({
        '@type': 'Article',
        author: { '@type': 'Person', name: 'John' },
        datePublished: '2025-01-01',
      } as any);
      expect(result.valid).toBe(false);
      expect(result.issues.some((i) => i.field === 'headline')).toBe(true);
    });

    it('should warn for long headline', () => {
      const result = validateSchema({
        '@type': 'Article',
        headline: 'A'.repeat(120),
        author: 'John',
        datePublished: '2025-01-01',
      });
      expect(result.issues.some((i) => i.field === 'headline' && i.severity === 'warning')).toBe(
        true,
      );
    });
  });

  describe('FAQPage validation', () => {
    it('should pass for valid FAQ', () => {
      const result = validateSchema({
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is React?',
            acceptedAnswer: { '@type': 'Answer', text: 'A library.' },
          },
        ],
      });
      expect(result.valid).toBe(true);
    });

    it('should fail for empty FAQ', () => {
      const result = validateSchema({
        '@type': 'FAQPage',
        mainEntity: [],
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('Product validation', () => {
    it('should pass for valid product', () => {
      const result = validateSchema({
        '@type': 'Product',
        name: 'Widget',
        image: 'https://example.com/widget.jpg',
        description: 'A great widget',
        offers: { '@type': 'Offer', price: 29.99, priceCurrency: 'USD' },
      });
      expect(result.valid).toBe(true);
    });

    it('should fail for product without name', () => {
      const result = validateSchema({
        '@type': 'Product',
      } as any);
      expect(result.valid).toBe(false);
    });
  });

  describe('JobPosting validation', () => {
    it('should pass for valid job posting', () => {
      const result = validateSchema({
        '@type': 'JobPosting',
        title: 'Software Engineer',
        description: 'Great job',
        datePosted: '2025-01-01',
        hiringOrganization: { '@type': 'Organization', name: 'Acme' },
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('LocalBusiness validation', () => {
    it('should pass for valid local business', () => {
      const result = validateSchema({
        '@type': 'LocalBusiness',
        name: 'My Shop',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Main St',
          addressLocality: 'Springfield',
        },
      });
      expect(result.valid).toBe(true);
    });
  });
});
