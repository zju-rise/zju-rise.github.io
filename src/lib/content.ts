/**
 * @file src/lib/content.ts
 * @purpose Load, sort and cross-check content for all pages from one source.
 * @maintain All pages must use these loaders so draft and demo rules stay consistent.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../config/site';

function visible<T extends { data: { draft: boolean; sample: boolean } }>(entries: T[]): T[] {
  const published = entries.filter((entry) => !entry.data.draft);
  if (!site.sampleContent && published.some((entry) => entry.data.sample)) {
    throw new Error('Sample content remains. Replace it or set draft: true before disabling sampleContent.');
  }
  return published;
}
// Once genuine content exists, its temporary placeholders disappear automatically.
function preferReal<T extends { data: { placeholder: boolean } }>(entries: T[]): T[] {
  return entries.some((entry) => !entry.data.placeholder) ? entries.filter((entry) => !entry.data.placeholder) : entries;
}
export const getNews = async () => preferReal(visible(await getCollection('news'))).sort((a, b) => b.data.date.localeCompare(a.data.date));
export const getPeople = async () => {
  const people = visible(await getCollection('people'));
  return people.filter((person) => !person.data.placeholder || !people.some((other) => other.data.group === person.data.group && !other.data.placeholder))
    .sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
};
export const getResearch = async () => visible(await getCollection('research')).sort((a, b) => a.data.order - b.data.order);
export async function getPapers(): Promise<CollectionEntry<'publications'>[]> {
  const papers = preferReal(visible(await getCollection('publications')));
  const people = new Set((await getPeople()).map((p) => p.id));
  const directions = new Set((await getResearch()).map((r) => r.id));
  for (const paper of papers) {
    if (paper.data.placeholder) continue;
    for (const member of paper.data.members) {
      if (!people.has(member)) throw new Error(`Publication ${paper.id}: missing member ${member}`);
    }
    for (const direction of paper.data.directions) {
      if (!directions.has(direction)) throw new Error(`Publication ${paper.id}: missing direction ${direction}`);
    }
  }
  return papers.sort((a, b) => Number(b.data.year === 'TBD' ? 0 : b.data.year) - Number(a.data.year === 'TBD' ? 0 : a.data.year) || a.data.order - b.data.order || a.id.localeCompare(b.id));
}
export const groupLabels = {
  faculty: 'Faculty', phd: 'PhD Students', masters: 'Master’s Students',
  undergraduate: 'Undergraduate Students', alumni: 'Alumni',
} as const;
