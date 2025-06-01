import { describe, it, expect } from 'vitest';
import {
  article,
  blogPosting,
  product,
  faqPage,
  breadcrumbList,
  localBusiness,
  organization,
  person,
  event,
  recipe,
  howTo,
  videoObject,
  course,
  jobPosting,
  softwareApp,
  webSite,
  schemaGraph,
  toJsonLdString,
} from '../builders.js';

describe('article', () => {
  it('should create Article schema with context', () => {
    const schema = article({
      headline: 'Test Article',
      author: { '@type': 'Person', name: 'John' },
      datePublished: '2025-01-01',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Test Article');
  });
});

describe('blogPosting', () => {
  it('should create BlogPosting schema', () => {
    const schema = blogPosting({
      headline: 'Blog Post',
      author: 'John',
      datePublished: '2025-01-01',
    });

    expect(schema['@type']).toBe('BlogPosting');
  });
});

describe('product', () => {
  it('should create Product schema', () => {
    const schema = product({
      name: 'Widget',
      description: 'A great widget',
      offers: {
        '@type': 'Offer',
        price: 29.99,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    });

    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBe('Widget');
  });
});

describe('faqPage', () => {
  it('should create FAQPage schema', () => {
    const schema = faqPage([
      { question: 'What is React?', answer: 'A JavaScript library.' },
      { question: 'What is SEO?', answer: 'Search engine optimization.' },
    ]);

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]?.['@type']).toBe('Question');
    expect(schema.mainEntity[0]?.name).toBe('What is React?');
    expect(schema.mainEntity[0]?.acceptedAnswer.text).toBe('A JavaScript library.');
  });
});

describe('breadcrumbList', () => {
  it('should create BreadcrumbList with positions', () => {
    const schema = breadcrumbList([
      { name: 'Home', url: 'https://example.com' },
      { name: 'Blog', url: 'https://example.com/blog' },
      { name: 'Post' },
    ]);

    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0]?.position).toBe(1);
    expect(schema.itemListElement[2]?.position).toBe(3);
    expect(schema.itemListElement[2]?.item).toBeUndefined();
  });
});

describe('localBusiness', () => {
  it('should create LocalBusiness schema', () => {
    const schema = localBusiness({
      name: 'My Restaurant',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Main St',
        addressLocality: 'Springfield',
        addressRegion: 'IL',
        postalCode: '62701',
        addressCountry: 'US',
      },
      telephone: '+1-555-0123',
    });

    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBe('My Restaurant');
  });
});

describe('organization', () => {
  it('should create Organization schema', () => {
    const schema = organization({
      name: 'Acme Corp',
      url: 'https://acme.com',
      logo: 'https://acme.com/logo.png',
    });

    expect(schema['@type']).toBe('Organization');
  });
});

describe('person', () => {
  it('should create Person schema', () => {
    const schema = person({
      name: 'Jane Doe',
      jobTitle: 'Software Engineer',
    });

    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('Jane Doe');
  });
});

describe('event', () => {
  it('should create Event schema', () => {
    const schema = event({
      name: 'Tech Conference',
      startDate: '2025-06-15T09:00:00',
      location: { '@type': 'PostalAddress', addressLocality: 'San Francisco' },
    });

    expect(schema['@type']).toBe('Event');
  });
});

describe('recipe', () => {
  it('should create Recipe schema', () => {
    const schema = recipe({
      name: 'Chocolate Cake',
      author: 'Chef John',
      recipeIngredient: ['flour', 'sugar', 'chocolate'],
      recipeInstructions: [
        { '@type': 'HowToStep', text: 'Mix ingredients' },
        { '@type': 'HowToStep', text: 'Bake at 350F' },
      ],
    });

    expect(schema['@type']).toBe('Recipe');
    expect(schema.recipeIngredient).toHaveLength(3);
  });
});

describe('howTo', () => {
  it('should create HowTo schema', () => {
    const schema = howTo({
      name: 'How to Fix a Bike',
      step: [
        { '@type': 'HowToStep', text: 'Flip the bike upside down' },
        { '@type': 'HowToStep', text: 'Remove the wheel' },
      ],
    });

    expect(schema['@type']).toBe('HowTo');
  });
});

describe('videoObject', () => {
  it('should create VideoObject schema', () => {
    const schema = videoObject({
      name: 'My Video',
      description: 'A test video',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      uploadDate: '2025-01-01',
    });

    expect(schema['@type']).toBe('VideoObject');
  });
});

describe('course', () => {
  it('should create Course schema', () => {
    const schema = course({
      name: 'React Mastery',
      description: 'Learn React from scratch',
      provider: { '@type': 'Organization', name: 'Code Academy' },
    });

    expect(schema['@type']).toBe('Course');
  });
});

describe('jobPosting', () => {
  it('should create JobPosting schema', () => {
    const schema = jobPosting({
      title: 'Software Engineer',
      datePosted: '2025-01-01',
      hiringOrganization: { '@type': 'Organization', name: 'Acme' },
      description: 'Great job opportunity',
    });

    expect(schema['@type']).toBe('JobPosting');
  });
});

describe('softwareApp', () => {
  it('should create SoftwareApplication schema', () => {
    const schema = softwareApp({
      name: 'My App',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'iOS',
    });

    expect(schema['@type']).toBe('SoftwareApplication');
  });
});

describe('webSite', () => {
  it('should create WebSite schema with search action', () => {
    const schema = webSite({
      name: 'My Site',
      url: 'https://example.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://example.com/search?q={search_term}',
        'query-input': 'required name=search_term',
      },
    });

    expect(schema['@type']).toBe('WebSite');
  });
});

describe('schemaGraph', () => {
  it('should create a connected graph', () => {
    const graph = schemaGraph([
      { '@type': 'WebSite', name: 'My Site', url: 'https://example.com' },
      { '@type': 'Organization', name: 'My Org' },
    ]);

    expect(graph['@context']).toBe('https://schema.org');
    expect(graph['@graph']).toHaveLength(2);
  });
});

describe('toJsonLdString', () => {
  it('should serialize to JSON string', () => {
    const schema = article({
      headline: 'Test',
      author: 'John',
      datePublished: '2025-01-01',
    });
    const str = toJsonLdString(schema);
    const parsed = JSON.parse(str);
    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('Article');
  });

  it('should support pretty printing', () => {
    const schema = person({ name: 'Jane' });
    const str = toJsonLdString(schema, true);
    expect(str).toContain('\n');
  });
});
