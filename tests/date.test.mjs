import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatPostDate } from '../lib/date.ts';

test('post dates retain the calendar day in server and browser time zones', () => {
  const previous = process.env.TZ;
  try {
    for (const zone of ['UTC', 'America/Toronto', 'Asia/Shanghai']) {
      process.env.TZ = zone;
      assert.equal(formatPostDate('2026-09-27'), 'September 27, 2026');
      assert.equal(formatPostDate('2026-09-27T00:00:00.000Z'), 'September 27, 2026');
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});
