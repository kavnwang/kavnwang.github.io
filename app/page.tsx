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
      <h1>Hey, I'm Kevin!</h1>
      <p>
        I study computer science at MIT and research applied interpretability at <a href="https://www.tilderesearch.com/">Tilde</a>. I'm also learning about astrophysics, ML performance engineering, molecular biology, topology, macroeconomic policy, Chinese literature, and educational technology. Above all, I aspire to be authentic, earnest, and compassionate, and to do my best to help everyone become the best version of themselves. I currently live in Cambridge, MA.
      </p>
      <p>I'd love to meet you, so please <a href="mailto:kevinhw@mit.edu">email</a> or <a href="https://calendly.com/kevinhw/intro-call">call</a> if you'd like to chat :) </p>

      <section>
        <ProjectsSection items={projects} />
      </section>
    </div>
  );
}
