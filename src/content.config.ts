/**
 * @file src/content.config.ts
 * @purpose Validate every editable Markdown record before HTML is generated.
 * @maintain Add new content fields here first; errors name the offending file.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { optionalEmail, optionalWebsite } from './lib/optional-fields';

const metadata = {
  purpose: z.string().min(1),
  maintain: z.string().min(1),
  sample: z.boolean().default(false),
  draft: z.boolean().default(false),
  placeholder: z.boolean().default(false),
};
// Local asset paths and HTTPS links are accepted; javascript: URLs are rejected.
const link = z.string().refine((value) => /^https:\/\//.test(value) || /^\/(?!\/)/.test(value), 'Use an HTTPS URL or a root-relative path.');

const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news' }),
  schema: z.object({ ...metadata, date: z.union([z.iso.date(), z.literal('TBD')]), title: z.string().min(1) })
    .refine((entry) => entry.placeholder || entry.date !== 'TBD', 'Replace the TBD date before clearing placeholder.'),
});
const publications = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/publications' }),
  schema: z.object({
    ...metadata,
    title: z.string().min(1), authors: z.array(z.string().min(1)).min(1),
    year: z.union([z.number().int().min(1900).max(2100), z.literal('TBD')]),
    venue: z.string().min(1), venueShort: z.string().min(1),
    order: z.number().default(0), featured: z.boolean().default(false),
    summary: z.string().min(1),
    directions: z.array(z.enum(['agent-security', 'embodied-ai-security'])).min(1),
    members: z.array(z.string()).default([]),
    pdf: link.optional(), code: link.optional(), project: link.optional(),
  }).refine((entry) => entry.placeholder || entry.year !== 'TBD', 'Replace the TBD year before clearing placeholder.'),
});
const people = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/people' }),
  schema: z.object({
    ...metadata, name: z.string().min(1),
    group: z.enum(['faculty', 'phd', 'masters', 'undergraduate', 'alumni']),
    order: z.number().default(0), role: z.string().min(1),
    interests: z.string().min(1), affiliation: z.string().min(1),
    photo: z.string().regex(/^\/(?!\/)/).optional(),
    email: optionalEmail, website: optionalWebsite, scholar: link.optional(), cv: link.optional(),
    joined: z.number().int().optional(),
    // Faculty-only prose remains editable in the person's record, not the template.
    facultySummary: z.array(z.string().min(1)).default([]),
    researchNotes: z.array(z.object({ title: z.string(), text: z.string(), direction: z.enum(['agent-security', 'embodied-ai-security']) })).default([]),
    activities: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
  }),
});
const research = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/research' }),
  schema: z.object({
    ...metadata, title: z.string().min(1), order: z.number(),
    overview: z.string().min(1), topics: z.array(z.string()).min(1),
    pipeline: z.string(), perspective: z.string(),
  }),
});
export const collections = { news, publications, people, research };
