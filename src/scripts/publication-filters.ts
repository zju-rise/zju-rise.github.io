/**
 * @file src/scripts/publication-filters.ts
 * @purpose Accessible, URL-synchronized paper filtering with no server requests.
 * @maintain Filtering rules live in lib/filters.ts and are covered by unit tests.
 */
import { matchesPaper, type SearchablePaper } from '../lib/filters';

export function initializePublicationFilters() {
  const form = document.querySelector<HTMLFormElement>('#paper-filters');
  const index = document.querySelector('#paper-index');
  if (!form || !index) return;
  const papers: (SearchablePaper & { id: string })[] = JSON.parse(index.textContent || '[]');
  // TBD rows are layout placeholders, not searchable publications or citations.
  if (!papers.length) return;
  const query = form.querySelector<HTMLInputElement>('[name="q"]')!;
  const year = form.querySelector<HTMLSelectElement>('[name="year"]')!;
  const conference = form.querySelector<HTMLSelectElement>('[name="conference"]')!;
  const status = document.querySelector<HTMLElement>('#filter-status')!;
  const empty = document.querySelector<HTMLElement>('#no-results')!;
  const rows = [...document.querySelectorAll<HTMLElement>('[data-paper-id]')];

  function update(writeUrl = true) {
    const filters = { query: query.value, year: year.value, conference: conference.value };
    const visible = new Set(papers.filter((paper) => matchesPaper(paper, filters)).map((paper) => paper.id));
    for (const row of rows) row.hidden = !visible.has(row.dataset.paperId!);
    for (const section of document.querySelectorAll<HTMLElement>('.publication-year')) {
      section.hidden = ![...section.querySelectorAll<HTMLElement>('[data-paper-id]')].some((row) => !row.hidden);
    }
    const active = Boolean(filters.query || filters.year || filters.conference);
    status.hidden = !active;
    status.textContent = `${visible.size} ${visible.size === 1 ? 'publication' : 'publications'} found`;
    empty.hidden = visible.size > 0;
    if (writeUrl) {
      const url = new URL(window.location.href);
      for (const [key, value] of [['q', query.value], ['year', year.value], ['conference', conference.value]]) {
        if (value) url.searchParams.set(key!, value!); else url.searchParams.delete(key!);
      }
      window.history.replaceState(null, '', url);
    }
  }
  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    query.value = params.get('q') || '';
    year.value = params.get('year') || '';
    conference.value = params.get('conference') || '';
    update(false);
  }
  form.addEventListener('submit', (event) => { event.preventDefault(); update(); });
  form.addEventListener('input', () => update());
  form.addEventListener('change', () => update());
  document.querySelector('#reset-filters')?.addEventListener('click', () => { form.reset(); update(); query.focus(); });
  window.addEventListener('popstate', readUrl);
  readUrl();
}
