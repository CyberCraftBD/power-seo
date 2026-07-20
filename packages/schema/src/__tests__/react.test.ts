import { describe, it, expect } from 'vitest';
import { JsonLd } from '../react.js';
import { article } from '../builders.js';

// Render-free: inspect the element the component returns. The JSON-LD injected
// via dangerouslySetInnerHTML must have <, >, & escaped so a schema field
// containing "</script>" cannot break out of the script tag (XSS).
describe('JsonLd component (schema)', () => {
  it('escapes </script> in schema fields', () => {
    const el = JsonLd({
      schema: article({
        headline: '</script><img src=x onerror=alert(1)>',
        datePublished: '2026-01-01',
        author: { name: 'A' },
      }),
    });

    const html = (el.props as { dangerouslySetInnerHTML: { __html: string } })
      .dangerouslySetInnerHTML.__html;

    expect(html).not.toContain('</script>');
    expect(html).not.toContain('<');
    expect(html).toContain('\\u003c');
    // JSON still parses and preserves the original value
    expect(JSON.parse(html).headline).toBe('</script><img src=x onerror=alert(1)>');
  });
});
