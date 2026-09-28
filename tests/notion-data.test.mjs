import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPublishedNotionPages, pageToPost } from '../lib/notion-data.ts';

const page = {
  id: 'page-id',
  created_time: '2026-09-28T00:00:00.000Z',
  properties: {},
};

test('missing optional properties and slug remain accessible with page ID', () => {
  assert.deepEqual(pageToPost(page), {
    id: 'page-id', title: 'Untitled', date: page.created_time, description: '', tags: [],
  });
});

test('metadata includes all rich-text fragments', () => {
  assert.equal(pageToPost({ ...page, properties: {
    Name: { title: [{ plain_text: 'Hello ' }, { plain_text: 'world' }] },
    Slug: { rich_text: [{ plain_text: ' hello-world ' }] },
  } }).title, 'Hello world');
  assert.equal(pageToPost({ ...page, properties: {
    Slug: { rich_text: [{ plain_text: ' hello-world ' }] },
  } }).id, 'hello-world');
});

test('publishing and unpublishing are visible on the next request without cached data', async (t) => {
  const previousSecret = process.env.NOTION_SECRET;
  const previousDatabase = process.env.NOTION_DATABASE;
  process.env.NOTION_SECRET = 'test-secret';
  process.env.NOTION_DATABASE = 'test-database';
  t.after(() => {
    if (previousSecret === undefined) delete process.env.NOTION_SECRET;
    else process.env.NOTION_SECRET = previousSecret;
    if (previousDatabase === undefined) delete process.env.NOTION_DATABASE;
    else process.env.NOTION_DATABASE = previousDatabase;
  });

  let results = [page];
  const fetchMock = t.mock.method(globalThis, 'fetch', async (_url, init) => {
    assert.equal(init.cache, 'no-store');
    const body = JSON.parse(init.body);
    assert.deepEqual(body.filter, { property: 'Status', select: { equals: 'Published' } });
    return Response.json({ results, has_more: false, next_cursor: null });
  });
  assert.equal((await getPublishedNotionPages()).length, 1);
  results = [];
  assert.equal((await getPublishedNotionPages()).length, 0);
  results = [{ ...page, id: 'newly-published' }];
  assert.equal((await getPublishedNotionPages())[0].id, 'newly-published');

  fetchMock.mock.mockImplementation(async (_url, init) => {
    const body = JSON.parse(init.body);
    return Response.json(body.start_cursor
      ? { results: [{ ...page, id: 'second-page' }], has_more: false, next_cursor: null }
      : { results: [page], has_more: true, next_cursor: 'cursor-2' });
  });
  assert.deepEqual((await getPublishedNotionPages()).map((item) => item.id), ['page-id', 'second-page']);

  fetchMock.mock.mockImplementation(async () => new Response('', { status: 503 }));
  await assert.rejects(getPublishedNotionPages(), /Notion API error: 503/);
});
