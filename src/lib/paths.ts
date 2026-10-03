/**
 * Shared getStaticPaths payloads for the [slug] routes. Both locale wrappers
 * (src/pages/… and src/pages/vi/…) re-export these — every EN slug gets a VI
 * page too; content falls back per-field when VI is missing.
 */
import { getCollection } from 'astro:content';

export async function projectStaticPaths() {
  const projects = (await getCollection('projects')).sort(
    (a, b) => a.data.order - b.data.order,
  );
  return projects.map((project, i) => ({
    params: { slug: project.id },
    props: {
      project,
      prev: projects[i - 1] ?? null,
      next: projects[i + 1] ?? null,
      related: projects
        .filter((p) => p.id !== project.id && p.data.category === project.data.category)
        .slice(0, 3),
    },
  }));
}

export async function postStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}
