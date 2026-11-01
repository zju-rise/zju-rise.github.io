/**
 * @file src/lib/filters.ts
 * @purpose Shared, browser-safe publication filtering and BibTeX formatting.
 * @maintain Keep filters composable; add tests when changing search semantics.
 */
export interface SearchablePaper {
  title: string;
  authors: string[];
  year: number;
  venue: string;
  venueShort: string;
}
export interface PaperFilters { query: string; year: string; conference: string }

const normalize = (text: string) => text.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export function matchesPaper(paper: SearchablePaper, filters: PaperFilters): boolean {
  const searchable = normalize([paper.title, ...paper.authors, paper.venue, paper.venueShort].join(' '));
  return (!filters.year || String(paper.year) === filters.year)
    && (!filters.conference || paper.venueShort === filters.conference)
    && normalize(filters.query).trim().split(/\s+/).every((word) => searchable.includes(word));
}

export function toBibtex(id: string, paper: SearchablePaper): string {
  // Escape BibTeX punctuation rather than allowing author-entered text to break it.
  const escape = (s: string) => s.replace(/[\\{}%&#_$]/g, (c) => c === '\\' ? '\\textbackslash{}' : `\\${c}`);
  return `@inproceedings{${id.replace(/[^a-zA-Z0-9_-]/g, '-')},\n  title = {${escape(paper.title)}},\n  author = {${paper.authors.map(escape).join(' and ')}},\n  booktitle = {${escape(paper.venue)}},\n  year = {${paper.year}}\n}`;
}
