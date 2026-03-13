/**
 * Factory for creating static route meta functions.
 * Eliminates the repeated `() => [{title: ...}, {name: 'description', ...}]` pattern.
 */
export function createMeta(meta: {title: string; description?: string}) {
  return () => {
    const tags: Array<Record<string, string>> = [{title: meta.title}];
    if (meta.description) {
      tags.push({name: 'description', content: meta.description});
    }
    return tags;
  };
}
