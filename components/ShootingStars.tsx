"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ShootingStars() {
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() || "/";

  useEffect(() => {
    const root = ref.current!;
    let timer: number | undefined;

    const spawn = () => {
      // Only in dark mode and on main pages
      const onMain = pathname === "/" || pathname.startsWith("/posts") || pathname.startsWith("/likes");
      if (!onMain || !document.body.classList.contains("dark")) {
        timer = window.setTimeout(spawn, 3500);
        return;
      }
      // One star per tick
        const star = document.createElement("div");
        star.className = "shooting-star";
        // Prefer upper-region origins; avoid steep upward motion
        const edge = ["left","right","top"][Math.floor(Math.random()*3)];
        const W = window.innerWidth, H = window.innerHeight;
        let sx=0, sy=0, x1=0, y1=0, x2=0, y2=0;
        const in1 = 140 + Math.random()*200;
        const in2 = in1 + 220 + Math.random()*260;
        if (edge==='left'){
          sx=-60; sy=Math.random()*H*0.45 + 10; // bias upper region
          x1=in1; y1=sy + (40 + Math.random()*100); // bias downward
          x2=in2; y2=y1 + (60 + Math.random()*120);
        } else if (edge==='right'){
          sx=W+60; sy=Math.random()*H*0.45 + 10;
          x1=-in1; y1=sy + (40 + Math.random()*100);
          x2=-in2; y2=y1 + (60 + Math.random()*120);
        } else { // top
          sx=Math.random()*W*0.9; sy=-60;
          x1=(Math.random()*160-80); y1=in1; // mostly downwards
          x2=x1 + (Math.random()*160-80); y2=in2;
        }
        const duration = 1800 + Math.random()*2400; // wider range
        const base = edge==='left'?0:edge==='right'?180:90;
        const curved = Math.random()<0.6;
        const r0 = base + (curved?(Math.random()*6-3):0);
        const r1 = curved? base+8 : base;
        const r2 = curved? base+16 : base;
        star.style.left=`${sx}px`; star.style.top=`${sy}px`;
        const path = `M 0 0 C ${x1/2} ${y1/2}, ${x1} ${y1}, ${x2} ${y2}`;
        star.style.setProperty('--path', `'${path}'`);
        star.style.setProperty('--trail',`${220 + Math.random()*160}px`);
        star.style.setProperty('--th',`${2 + Math.random()*3}px`);
        const trail=document.createElement('div'); trail.className='trail';
        trail.style.animation=`trailAnim ${duration}ms linear forwards`;
        const head=document.createElement('div'); head.className='head';
        star.appendChild(trail); star.appendChild(head);
        star.style.animation=`starMotion ${duration}ms linear forwards`;
        root.appendChild(star);
        window.setTimeout(()=>star.remove(), duration+120);
      // next spawn (vary more, fewer overall)
      timer = window.setTimeout(spawn, 2200 + Math.random()*3600);

      // Occasionally spawn a long comet-like star
      if (Math.random() < 0.12) {
        const comet = document.createElement('div');
        comet.className = 'shooting-star';
        // launch from an edge near the top region
        const e2 = ["left","right","top"][Math.floor(Math.random()*3)];
        const W2 = window.innerWidth, H2 = window.innerHeight;
        let sx2=0, sy2=0, cx1=0, cy1=0, cx2=0, cy2=0;
        if (e2==='left'){ sx2=-100; sy2=Math.random()*H2*0.45; cx1=260+Math.random()*260; cy1=sy2+(60+Math.random()*140); cx2=cx1+360+Math.random()*300; cy2=cy1+(120+Math.random()*200); }
        else if (e2==='right'){ sx2=W2+100; sy2=Math.random()*H2*0.45; cx1=-(260+Math.random()*260); cy1=sy2+(60+Math.random()*140); cx2=cx1-(360+Math.random()*300); cy2=cy1+(120+Math.random()*200); }
        else { sx2=Math.random()*W2*0.9; sy2=-100; cx1=(Math.random()*200-100); cy1=280+Math.random()*260; cx2=cx1+(Math.random()*240-120); cy2=cy1+240+Math.random()*260; }
        const cd = 6000 + Math.random()*5000; // longer, varied
        comet.style.left = `${sx2}px`;
        comet.style.top = `${sy2}px`;
        const path2 = `M 0 0 C ${cx1/2} ${cy1/2}, ${cx1} ${cy1}, ${cx2} ${cy2}`;
        comet.style.setProperty('--path', `'${path2}'`);
        comet.style.setProperty('--trail', `${420 + Math.random() * 180}px`);
        comet.style.setProperty('--th', `${3 + Math.random() * 4}px`);

        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.animation = `trailAnim ${cd}ms linear forwards`;
        const head2=document.createElement('div'); head2.className='head';
        comet.appendChild(trail); comet.appendChild(head2);
        comet.style.animation = `starMotion ${cd}ms linear forwards`;
        root.appendChild(comet);
        window.setTimeout(() => comet.remove(), cd + 120);
      }
    };

    // start after a brief delay
    timer = window.setTimeout(spawn, 2500);
    return () => { if (timer) window.clearTimeout(timer); };
  }, [pathname]);

  return <div ref={ref} aria-hidden className="stars-layer" />;
}


