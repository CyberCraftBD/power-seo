// @power-seo/core — JSON-LD serialization
// ----------------------------------------------------------------------------

/**
 * Serialize a value to a JSON string that is safe to embed inside a
 * `<script type="application/ld+json">` element rendered via
 * `dangerouslySetInnerHTML`.
 *
 * The HTML-significant characters `<`, `>` and `&` are escaped to their JSON
 * unicode escape sequences so that a string value such as `"</script>"` cannot
 * prematurely terminate the surrounding `<script>` tag — a stored-XSS vector.
 * The escaped output is still valid JSON and parses identically.
 *
 * @example
 * ```ts
 * serializeJsonLd({ name: '</script><img src=x onerror=alert(1)>' });
 * // '{"name":"\\u003c/script\\u003e\\u003cimg src=x onerror=alert(1)\\u003e"}'
 * ```
 */
export function serializeJsonLd(value: unknown, pretty = false): string {
  return JSON.stringify(value, null, pretty ? 2 : undefined)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
