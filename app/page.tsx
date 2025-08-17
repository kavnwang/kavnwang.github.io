import Link from 'next/link';
import { getBySection, getIndex } from '@/lib/content';
import ProjectCard from '@/components/ProjectCard';
import { pathForItem } from '@/lib/paths';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { withBasePath } from '@/lib/paths';
import ProjectsSection from '@/components/ProjectsSection';

export default function HomePage() {
  const idx = getIndex();
  const projects = (idx.items || [])
    .filter(i => i.public && (i.tags || []).some(t => {
      const k = t.toLowerCase();
      return k === 'project' || k === 'projects';
    }));

  return (
    <div>
      <h1>Home</h1>
      <p>This is a starter scaffold. It reads your local Obsidian vault, indexes public notes, and renders them.</p>

      <section>
        <h2>Projects</h2>
        <ProjectsSection items={projects} />
      </section>
    </div>
  );
}
