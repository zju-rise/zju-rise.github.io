/**
 * @file src/pages/bibtex/[id].bib.ts
 * @purpose Build downloadable BibTeX files from the same publication records.
 * @maintain No manual .bib copies are needed when a paper changes.
 */
import type { APIRoute } from 'astro';
import { getPapers } from '../../lib/content';
import { toBibtex, type SearchablePaper } from '../../lib/filters';
export async function getStaticPaths() {
  return (await getPapers()).filter((paper) => !paper.data.placeholder).map((paper) => ({ params: { id: paper.id }, props: { paper: paper.data } }));
}
export const GET: APIRoute = ({ params, props }) => new Response(toBibtex(params.id!, props.paper as SearchablePaper), {
  headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' },
});
