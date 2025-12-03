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
        I'm an undergraduate student at MIT interested in machine learning research, specifically architectures and learning algorithms that improve language models' test-time learning and generalization abilities. I value unconditional kindness, authenticity, and wonder. I currently live in Cambridge, MA.
      </p>
      <p>I'd love to meet you, so please <a href="mailto:kevinhw@mit.edu">email</a> if you'd like to chat :) </p>

      <section>
        <ProjectsSection items={projects} />
      </section>
    </div>
  );
}
