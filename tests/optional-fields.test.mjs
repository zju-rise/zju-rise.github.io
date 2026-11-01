/**
 * @file tests/optional-fields.test.mjs
 * @purpose Prevent blank optional member fields from breaking routine updates.
 * @maintain Test empty YAML values separately from genuinely invalid addresses.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { optionalEmail, optionalWebsite } from '../src/lib/optional-fields.ts';

test('missing, empty and whitespace-only contact fields mean not supplied', () => {
  for (const schema of [optionalEmail, optionalWebsite]) {
    for (const input of [undefined, null, '', '   ']) assert.equal(schema.parse(input), undefined);
  }
});
test('valid contact fields are trimmed and retained', () => {
  assert.equal(optionalEmail.parse(' member@zju.edu.cn '), 'member@zju.edu.cn');
  assert.equal(optionalWebsite.parse(' https://example.com/member/ '), 'https://example.com/member/');
});
test('nonempty invalid fields still fail rather than becoming clickable links', () => {
  assert.equal(optionalEmail.safeParse('TBD').success, false);
  assert.equal(optionalEmail.safeParse('member@').success, false);
  assert.equal(optionalWebsite.safeParse('TBD').success, false);
  assert.equal(optionalWebsite.safeParse('javascript:alert(1)').success, false);
});
