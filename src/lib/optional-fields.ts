/**
 * @file src/lib/optional-fields.ts
 * @purpose Optional contact fields accept omitted, blank and empty YAML values.
 * @maintain Validate actual values strictly; keep blank-field behavior consistent.
 */
import { z } from 'astro/zod';

const blankToUndefined = (value: unknown) => typeof value === 'string'
  ? value.trim() || undefined
  : value == null ? undefined : value;

export const optionalEmail = z.preprocess(
  blankToUndefined,
  z.email({ error: 'email 请填写有效邮箱，例如 name@zju.edu.cn；没有邮箱可以留空或删除这一行。' }).optional(),
);

export const optionalWebsite = z.preprocess(
  blankToUndefined,
  z.url({ protocol: /^https?$/, error: 'website must be a full http:// or https:// URL.' }).optional(),
);
