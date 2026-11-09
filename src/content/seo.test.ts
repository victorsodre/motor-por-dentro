import test from 'node:test';
import assert from 'node:assert/strict';
import { isoDuration, staticContent, videoJsonLd } from './seo.ts';
import { catalog } from './catalog.ts';
import { stages } from './cycle.ts';
import { video } from './video.ts';

test('video duration becomes ISO 8601', () => {
  assert.equal(isoDuration('0:56'), 'PT56S');
  assert.equal(isoDuration('12:05'), 'PT12M5S');
  assert.equal(isoDuration('1:02:03'), 'PT1H2M3S');
  assert.throws(() => isoDuration('x:10'));
});

test('structured data describes the lab video and cannot close its script', () => {
  const tag = videoJsonLd();
  assert.match(tag, /^<script type="application\/ld\+json">.*<\/script>$/);
  const data = JSON.parse(tag.slice(tag.indexOf('>') + 1, tag.lastIndexOf('</script>')));
  assert.equal(data['@type'], 'VideoObject');
  assert.equal(data.embedUrl, `https://www.youtube.com/embed/${video.id}`);
  assert.equal(data.duration, 'PT56S');
  assert.ok(!Number.isNaN(Date.parse(data.uploadDate)));
  assert.ok(!tag.slice(1, -9).includes('<'));
});

test('static HTML carries every stroke and part, escaped', () => {
  const html = staticContent();
  for (const item of [...stages, ...catalog]) assert.ok(html.includes(item.label), item.label);
  assert.ok(html.includes(`watch?v=${video.id}`));
  assert.ok(!/<script/i.test(html));
});
