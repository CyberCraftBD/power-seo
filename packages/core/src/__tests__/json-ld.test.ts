import { describe, it, expect } from 'vitest';
import { serializeJsonLd } from '../json-ld.js';

describe('serializeJsonLd', () => {
  it('escapes <, > and & to unicode sequences', () => {
    const out = serializeJsonLd({ name: '</script><img src=x onerror=alert(1)>' });
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
    expect(out).toContain('\\u003c');
    expect(out).toContain('\\u003e');
    // The raw </script> sequence must not survive
    expect(out).not.toContain('</script>');
  });

  it('escapes ampersands', () => {
    expect(serializeJsonLd({ q: 'a & b' })).toContain('\\u0026');
  });

  it('produces output that parses back to the original value', () => {
    const value = { name: 'Tom & Jerry', note: '1 < 2 > 0' };
    expect(JSON.parse(serializeJsonLd(value))).toEqual(value);
  });

  it('supports pretty printing', () => {
    expect(serializeJsonLd({ a: 1 }, true)).toContain('\n');
  });
});
