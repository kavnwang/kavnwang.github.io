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
      <p>
        <em>
          I'm looking for partners! Click <Link href='/hire-me'>here</Link> to learn more.
        </em>
      </p>
      <h1>Hey, I'm Kevin!</h1>
      <p>
        I'm a rising junior at MIT, based in Cambridge, MA. I value unconditional kindness, authenticity, and wonder. Visit my <a href="https://linkedin.com/in/kevinhaoyuwang">LinkedIn</a> for professional purposes, or <a href="https://wangk.substack.com/p/lets-be-friends">this post</a> if you want to be friends!
      </p>
      <p>I'd love to meet you, so please <a href="mailto:kevinhw@mit.edu">email</a> if you'd like to chat :) </p>

      <section>
        <ProjectsSection items={projects} />
      </section>
    </div>
  );
}
