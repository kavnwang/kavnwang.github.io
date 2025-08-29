"use client";

import { useEffect } from 'react';

function fitAll() {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('.katex-display'));
  for (const block of blocks) {
    const content = (block.querySelector('.katex') as HTMLElement) || block;
    // Reset before measuring
    content.style.transform = '';
    content.style.transformOrigin = 'left top';
    content.style.display = 'inline-block';
    block.style.overflow = 'hidden';
    block.style.width = '100%';

    const containerWidth = block.clientWidth;
    const contentWidth = content.scrollWidth;
    if (containerWidth > 0 && contentWidth > containerWidth) {
      const scale = Math.max(0.6, Math.min(1, containerWidth / contentWidth));
      content.style.transform = `scale(${scale})`;
      // Adjust the container height to the scaled content to avoid inner scrollbars
      const rect = content.getBoundingClientRect();
      const scaledHeight = rect.height * scale;
      block.style.height = `${scaledHeight}px`;
    }
  }
}

export default function AutoScaleMath() {
  useEffect(() => {
    fitAll();
    const ro = new ResizeObserver(() => fitAll());
    ro.observe(document.body);
    const onResize = () => fitAll();
    window.addEventListener('resize', onResize);
    return () => {
      try { ro.disconnect(); } catch {}
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return null;
}


