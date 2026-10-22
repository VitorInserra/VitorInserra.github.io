import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Timings/eases mirror EEGo Lab's js/lib/motion.js, expressed around React DOM.
export default function usePageMotion(pageRef, route, reduced) {
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    if (reduced) {
      gsap.set(page, { opacity: 1 });
      return;
    }
    const context = gsap.context(() => {
      gsap.fromTo(page, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' });
      const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });
      timeline.fromTo('[data-title-unit]', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.045 }, 0);
      timeline.fromTo('[data-intro]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, clearProps: 'transform' }, 0.15);
      page.querySelectorAll('[data-reveal]').forEach(node => {
        gsap.fromTo(node, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } });
      });
      page.querySelectorAll('[data-entry]').forEach(entry => {
        const visual = entry.querySelector('[data-wipe]');
        const content = entry.querySelector('.entry-content');
        const tl = gsap.timeline({ scrollTrigger: { trigger: entry, start: 'top 82%', once: true } });
        tl.fromTo(entry, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', clearProps: 'transform' }, 0);
        if (visual) tl.fromTo(visual, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.1);
        if (content) tl.fromTo(content.children, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' }, 0.3);
      });
      const quote = page.querySelector('[data-quote]');
      if (quote) {
        const words = quote.querySelectorAll('.word');
        quote.classList.add('is-scrubbed');
        ScrollTrigger.create({ trigger: quote, start: 'top 85%', end: 'bottom 50%', onUpdate: self => {
          words.forEach((word, i) => word.classList.toggle('is-lit', i < Math.round(self.progress * words.length)));
        }, onLeave: () => words.forEach(word => word.classList.add('is-lit')) });
      }
      const visual = page.querySelector('.home-feature-visual');
      if (visual) gsap.fromTo(visual, { yPercent: -7, scale: 1.14 }, { yPercent: 7, scale: 1.14, ease: 'none', scrollTrigger: { trigger: visual.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    }, page);
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      context.revert();
      page.querySelector('[data-quote]')?.classList.remove('is-scrubbed');
    };
  }, [pageRef, route, reduced]);
}
