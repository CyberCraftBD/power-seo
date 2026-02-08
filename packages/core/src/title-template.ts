// ============================================================================
// @ccbd-seo/core — Title Template Engine
// ============================================================================

export interface TitleTemplateVars {
  title?: string;
  siteName?: string;
  separator?: string;
  tagline?: string;
  page?: number;
  [key: string]: string | number | undefined;
}

const DEFAULT_SEPARATOR = '|';

/**
 * Apply a title template with variable substitution.
 *
 * Supports patterns like:
 * - `%title% | %siteName%`
 * - `%title% - %siteName%`
 * - `%title% | %siteName% - Page %page%`
 *
 * @example
 * ```ts
 * applyTitleTemplate('%title% | %siteName%', {
 *   title: 'My Page',
 *   siteName: 'My Site'
 * });
 * // => "My Page | My Site"
 * ```
 */
export function applyTitleTemplate(template: string, vars: TitleTemplateVars): string {
  if (!template) {
    return vars.title ?? '';
  }

  let result = template;

  // Replace all %variable% patterns
  result = result.replace(/%(\w+)%/g, (_match, key: string) => {
    const value = vars[key];
    if (value === undefined || value === null) {
      return '';
    }
    return String(value);
  });

  // If no template used, fall back to simple separator pattern
  if (result === template && vars.title) {
    const separator = vars.separator ?? DEFAULT_SEPARATOR;
    if (vars.siteName) {
      return `${vars.title} ${separator} ${vars.siteName}`;
    }
    return vars.title;
  }

  // Clean up multiple consecutive spaces
  result = result.replace(/\s{2,}/g, ' ').trim();

  // Clean up dangling separators at start/end
  result = result.replace(/^[\s|·—–-]+|[\s|·—–-]+$/g, '').trim();

  return result;
}

/**
 * Create a title template function with pre-configured defaults.
 *
 * @example
 * ```ts
 * const makeTitle = createTitleTemplate({
 *   siteName: 'My Site',
 *   separator: '—'
 * });
 *
 * makeTitle('About Us');
 * // => "About Us — My Site"
 * ```
 */
export function createTitleTemplate(
  defaults: Omit<TitleTemplateVars, 'title'> & { template?: string },
) {
  const { template = '%title% %separator% %siteName%', ...defaultVars } = defaults;

  return (title: string, overrides?: Partial<TitleTemplateVars>): string => {
    return applyTitleTemplate(template, {
      separator: DEFAULT_SEPARATOR,
      ...defaultVars,
      ...overrides,
      title,
    });
  };
}
