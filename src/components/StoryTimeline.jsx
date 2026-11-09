import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { storyTimeline } from '../data/story.js';
import Icon from './Icon.jsx';
import BrandText from './BrandText.jsx';

gsap.registerPlugin(ScrollTrigger);

const framedMilestones = new Set(['robotics', 'national-fencing-team', 'intro-programming-ta', 'bachelors-degree', 'masters-degree']);
const hasFrame = entry => ['Research', 'Work'].includes(entry.category) || framedMilestones.has(entry.id);

export default function StoryTimeline({ reduced }) {
  const rootRef = useRef(null);
  const [newestFirst, setNewestFirst] = useState(true);
  const groups = useMemo(() => {
    const years = new Map();
    const entries = newestFirst ? [...storyTimeline].reverse() : storyTimeline;
    entries.forEach(entry => {
      const year = entry.year;
      if (!years.has(year)) years.set(year, []);
      years.get(year).push(entry);
    });
    return [...years].map(([year, entries]) => ({ year, entries }));
  }, [newestFirst]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = root.querySelector('.story-collection');
    const rail = root.querySelector('.story-rail');
    const fill = root.querySelector('.story-rail-fill');
    const events = [...root.querySelectorAll('[data-story-event]')];
    const nodes = [...root.querySelectorAll('.story-node')];
    const years = [...root.querySelectorAll('.story-year-group')];
    let disposed = false;

    function showAll() {
      events.forEach(event => event.classList.add('is-filled'));
      years.forEach(year => year.classList.add('is-reached'));
    }

    function measureRail() {
      const trackTop = track.getBoundingClientRect().top;
      const first = nodes[0].getBoundingClientRect();
      const last = nodes.at(-1).getBoundingClientRect();
      rail.style.top = `${first.top + first.height / 2 - trackTop}px`;
      rail.style.height = `${last.top + last.height / 2 - first.top - first.height / 2}px`;
    }

    measureRail();
    const context = gsap.context(() => {
      if (reduced) {
        showAll();
        gsap.set(fill, { scaleY: 1 });
        return;
      }
      gsap.set(fill, { scaleY: 0 });
      gsap.to(fill, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: rail, start: 'top 62%', end: 'bottom 62%', scrub: 0.25 },
      });

      function updateEvents() {
        const readingLine = window.innerHeight * 0.62;
        let current = null;
        events.forEach((event, index) => {
          const node = nodes[index].getBoundingClientRect();
          const reached = node.top + node.height / 2 <= readingLine;
          event.classList.toggle('is-filled', reached);
          event.classList.remove('is-current');
          if (reached) current = event;
        });
        current?.classList.add('is-current');
        years.forEach(year => year.classList.toggle('is-reached', Boolean(year.querySelector('.is-filled'))));
      }

      ScrollTrigger.create({
        trigger: track, start: 'top bottom', end: 'bottom top',
        onUpdate: updateEvents, onRefresh: updateEvents,
      });

      events.forEach(event => {
        gsap.fromTo(event.querySelector('.story-entry'), { y: 16 }, {
          y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform',
          scrollTrigger: { trigger: event, start: 'top 90%', once: true },
        });
      });
      updateEvents();
    }, root);

    const refresh = () => {
      if (disposed) return;
      measureRail();
      ScrollTrigger.refresh();
    };
    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(track);
    refresh();
    document.fonts?.ready.then(refresh);
    return () => {
      disposed = true;
      resizeObserver.disconnect();
      context.revert();
      rail.style.removeProperty('top');
      rail.style.removeProperty('height');
      events.forEach(event => event.classList.remove('is-filled', 'is-current'));
      years.forEach(year => year.classList.remove('is-reached'));
    };
  }, [reduced, groups]);

  return <section ref={rootRef} className="story-section page-width" id="my-story" aria-labelledby="story-title" tabIndex={-1}>
    <header className="story-header">
      <h2 id="story-title">My story</h2>
      <div className="story-header-controls">
        <span className="story-range">{storyTimeline[0].year} – {storyTimeline.at(-1).year}</span>
        <button className="story-order-toggle" onClick={() => setNewestFirst(current => !current)} aria-label={newestFirst ? 'Show oldest first' : 'Show newest first'} title={newestFirst ? 'Switch to oldest first' : 'Switch to newest first'}>
          <Icon name="sort" size={16} /><span>{newestFirst ? 'Newest first' : 'Oldest first'}</span>
        </button>
      </div>
    </header>
    <div className="story-collection">
      <div className="story-rail" aria-hidden="true"><span className="story-rail-fill" /></div>
      <ol className="story-years">
        {groups.map(group => <li className="story-year-group" key={group.year}>
          <h3 className="story-year-heading">{group.year}</h3>
          <ol className="story-events">
            {group.entries.map(entry => <li className={`story-event${hasFrame(entry) ? ' story-event--framed' : ''}`} key={entry.id} data-story-event data-story-id={entry.id}>
              <span className="story-node" aria-hidden="true" />
              <article className="story-entry">
                <div className="story-entry-meta"><span className="story-category">{entry.category}</span><span className="story-date">{entry.date}</span></div>
                <h4><BrandText>{entry.title}</BrandText></h4>
                {entry.organization && <p className="story-organization"><BrandText>{entry.organization}</BrandText>{entry.location && <span className="story-location"> · {entry.location}</span>}</p>}
                {entry.organizationNote && <p className="story-organization story-company-note">{entry.organizationNote}</p>}
                {entry.paragraphs.length > 0 && <div className="story-summary">{entry.paragraphs.map((paragraph, index) => <p key={index}><BrandText>{paragraph}</BrandText></p>)}</div>}
                {entry.links?.length > 0 && <div className="story-links">{entry.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer"><BrandText>{link.label}</BrandText><Icon name="external" size={13} /></a>)}</div>}
              </article>
            </li>)}
          </ol>
        </li>)}
      </ol>
    </div>
  </section>;
}
