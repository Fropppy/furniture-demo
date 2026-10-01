import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE, withBase } from '../lib/site';

export async function GET(context) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `${SITE.name} — Journal`,
    description:
      'Notes from the studio: materials, process and lessons from delivered projects.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: withBase(`/journal/${post.id}/`),
    })),
    customData: '<language>en-us</language>',
  });
}
