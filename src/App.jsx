import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { profile, projects, publications, opinions } from './data/site.js';
import useReducedMotion from './hooks/useReducedMotion.js';
import usePageMotion from './hooks/usePageMotion.js';
import EEGWaveform from './components/EEGWaveform.jsx';
import Icon from './components/Icon.jsx';
import DetailDialog from './components/DetailDialog.jsx';
import StoryTimeline from './components/StoryTimeline.jsx';

const routes = [
  { id: 'home', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Publications' },
  { id: 'opinions', label: 'Opinions' },
];

function readHomeAnchor() {
  const id = window.location.hash.slice(1);
  return ['description', 'my-story'].includes(id) ? id : null;
}

function readRoute() {
  const hash = window.location.hash.slice(1);
  return routes.some(route => route.id === hash) ? hash : 'home';
}

function Title({ children, className = '' }) {
  return <h1 className={className} tabIndex={-1} aria-label={children}>{children.split(' ').map((word, i) => <span className="title-word" key={i} aria-hidden="true">{[...word].map((char, j) => <span className="title-unit" data-title-unit key={j}>{char}</span>)}{' '}</span>)}</h1>;
}

function Header({ route, theme, onThemeChange, menuOpen, setMenuOpen }) {
  const [compact, setCompact] = useState(window.scrollY > 24);
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useLayoutEffect(() => {
    const nav = navRef.current;
    const place = () => {
      const active = nav.querySelector('[aria-current="page"]');
      if (active) setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    const observer = new ResizeObserver(place);
    observer.observe(nav);
    place();
    let active = true;
    document.fonts?.ready.then(() => { if (active) place(); });
    return () => { active = false; observer.disconnect(); };
  }, [route]);
  useEffect(() => {
    const close = event => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); document.querySelector('.menu-toggle')?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menuOpen, setMenuOpen]);
  return <header className={`site-header ${compact ? 'is-compact' : ''}`}>
    <div className="header-inner">
      <a href="#home" className="brand" aria-label={`${profile.name}, home`}><span className="brand-monogram">{profile.initials}<span>.</span></span><span className="brand-caption">PERSONAL<br />WEBSITE</span></a>
      <nav id="main-navigation" ref={navRef} className={`navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {routes.map(item => <a key={item.id} href={`#${item.id}`} aria-current={route === item.id ? 'page' : undefined}>{item.label}</a>)}
        <span className="nav-indicator" aria-hidden="true" style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} />
      </nav>
      <div className="header-actions"><button className="icon-button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={onThemeChange}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} /></button><button className="icon-button menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button></div>
    </div>
  </header>;
}

function ProjectCard({ project, onOpen, featured = false }) {
  const Heading = featured ? 'h3' : 'h2';
  return <article className={`project-entry ${featured ? 'featured-entry' : ''} ${project.image ? '' : 'project-entry--text-only'}`} data-entry>
    {project.image && <div className={`feature-frame ${project.imageKind === 'logo' ? 'project-visual--logo' : ''}`} data-wipe><img className="project-image" src={`${import.meta.env.BASE_URL}${project.image}`} alt={project.imageAlt || ''} width={project.imageWidth} height={project.imageHeight} loading="lazy" /></div>}
    <div className="entry-content">
      {(project.category || project.year) && <div className="entry-meta"><span className="eyebrow">{[project.category, project.year].filter(Boolean).join(' / ')}</span></div>}
      <Heading>{project.title}</Heading>
      {project.summary && <p>{project.summary}</p>}
      {project.description && <p className="project-description">{project.description}</p>}
      {project.tags?.length > 0 && <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
      <div className="project-entry-links">
        {project.url && <a className="text-link" href={project.url} target="_blank" rel="noreferrer">{project.linkLabel || 'Explore project'}<Icon name="external" size={16} /></a>}
        {project.links?.map(link => <a className="text-link" key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<Icon name="external" size={16} /></a>)}
        {project.body?.length > 0 && <button className="text-link" onClick={() => onOpen(project)}>Details<Icon name="arrow" size={16} /></button>}
      </div>
    </div>
  </article>;
}

function Home({ theme, reduced, onOpen }) {
  const hasDescription = profile.description.length > 0 || profile.interests.length > 0;
  const featuredProject = projects.find(project => project.featured);
  return <>
    <section className="welcome-hero" aria-labelledby="name-heading">
      <EEGWaveform reduced={reduced} theme={theme} className="welcome-wave" />
      <div className="hero-inner">
        <div id="name-heading"><Title className="welcome-title">{profile.name}</Title></div>
        {profile.introduction && <p className="introduction" data-intro>{profile.introduction}</p>}
      </div>
      <div className="lab-project" data-intro>
        <a className="lab-link" href="https://eego-unc.github.io/Lab/#home" target="_blank" rel="noreferrer" aria-describedby="lab-project-caption"><img src={`${import.meta.env.BASE_URL}eego-lab-logo.webp`} alt="EEGo Lab" width="58" height="40" /><Icon name="external" size={14} /></a>
        <p id="lab-project-caption" className="lab-project-caption">My current project</p>
      </div>
      <a className="hero-scroll" href="#my-story" data-intro><span>MY STORY</span><Icon name="down" size={14} /></a>
    </section>
    {hasDescription && <section id="description" className="description-section page-width">
      <div className={`description-grid ${profile.descriptionTitle ? '' : 'description-grid--text-only'}`}>
        {profile.descriptionTitle && <h2 data-reveal>{profile.descriptionTitle.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h2>}
        <div className="description-copy" data-reveal>
          {profile.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          {profile.interests.length > 0 && <div className="interest-list">{profile.interests.map(interest => <span key={interest}>{interest}</span>)}</div>}
        </div>
      </div>
    </section>}
    <StoryTimeline reduced={reduced} />
    {featuredProject && <section className="home-work page-width">
      <ProjectCard project={featuredProject} onOpen={onOpen} featured />
    </section>}
  </>;
}

function FilterBar({ values, selected, onChange, count, noun, singular = noun.replace(/s$/, '') }) {
  return <div className="filter-bar"><div className="filter-options" role="group" aria-label={`Filter ${noun}`}>{values.map(value => <button key={value} className={`filter-button ${selected === value ? 'is-active' : ''}`} aria-pressed={selected === value} onClick={() => onChange(value)}>{value}</button>)}</div><span className="result-count" role="status">{String(count).padStart(2, '0')} {count === 1 ? singular : noun}</span></div>;
}

function Projects({ onOpen }) {
  const [filter, setFilter] = useState('All');
  const filtered = projects.filter(project => filter === 'All' || project.category === filter);
  return <section className="page-width interior-page" aria-label="Projects">
    {projects.length > 0 ? <>
      <FilterBar values={['All', ...new Set(projects.map(project => project.category).filter(Boolean))]} selected={filter} onChange={setFilter} count={filtered.length} noun="projects" />
      <div key={filter} className="filtered-content project-list">{filtered.map(project => <ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div>
    </> : <p className="empty-state">No projects added.</p>}
  </section>;
}

function Publications({ onOpen }) {
  const [filter, setFilter] = useState('All');
  const filtered = publications.filter(publication => filter === 'All' || publication.type === filter);
  return <section className="page-width interior-page" aria-label="Publications">
    {publications.length > 0 ? <>
      <FilterBar values={['All', ...new Set(publications.map(publication => publication.type).filter(Boolean))]} selected={filter} onChange={setFilter} count={filtered.length} noun="entries" singular="entry" />
      <div key={filter} className="filtered-content publication-list">{filtered.map(publication => <article className={`publication-entry ${publication.image ? '' : 'publication-entry--text-only'}`} key={publication.id} data-entry>
        {publication.image && <figure className={`publication-entry-visual ${publication.imageKind ? `publication-entry-visual--${publication.imageKind}` : ''}`} data-wipe>
          <img src={`${import.meta.env.BASE_URL}${publication.image}`} alt={publication.imageAlt || ''} width={publication.imageWidth} height={publication.imageHeight} loading="lazy" decoding="async" />
        </figure>}
        <div className="entry-content publication-entry-content">
          <p className="eyebrow publication-entry-label">{publication.label || [publication.type, publication.year].filter(Boolean).join(' · ')}</p>
          <h2>{publication.title}</h2>
          {publication.summary && <p className="publication-entry-summary">{publication.summary}</p>}
          {publication.authors && <p className="publication-entry-byline">{publication.authors}</p>}
          {publication.status && <p className="publication-status">{publication.status}</p>}
          {(publication.links?.length > 0 || publication.url || publication.body?.length > 0) && <div className="publication-entry-links">
            {publication.links?.map(link => <a className="text-link" key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<Icon name="external" size={14} /></a>)}
            {!publication.links?.length && publication.url && <a className="text-link" href={publication.url} target="_blank" rel="noreferrer">View publication<Icon name="external" size={14} /></a>}
            {publication.body?.length > 0 && <button className="text-link" onClick={() => onOpen(publication)}>Read more<Icon name="arrow" size={14} /></button>}
          </div>}
          {publication.venue && <p className="publication-entry-venue">{publication.venue}</p>}
        </div>
      </article>)}</div>
    </> : <p className="empty-state">No publications added.</p>}
  </section>;
}

function Opinions({ onOpen }) {
  return <section className="page-width interior-page" aria-label="Opinions">
    {opinions.length > 0 ? <div className="opinion-list">{opinions.map((opinion, index) => <article className="opinion-row" key={opinion.id} data-reveal>
      <span className="opinion-number">{String(index + 1).padStart(2, '0')}</span>
      <div>
        {opinion.category && <div className="entry-meta"><span className="eyebrow">{opinion.category}</span></div>}
        <h2><button onClick={() => onOpen(opinion)}>{opinion.title}</button></h2>
        {opinion.summary && <p>{opinion.summary}</p>}
        {(opinion.date || opinion.readTime) && <div className="opinion-meta">
          {opinion.date && <time dateTime={opinion.date}>{new Date(`${opinion.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>}
          {opinion.date && opinion.readTime && <span>·</span>}{opinion.readTime && <span>{opinion.readTime}</span>}
        </div>}
      </div><button className="opinion-open" aria-label={`Read ${opinion.title}`} onClick={() => onOpen(opinion)}><Icon name="external" size={23} /></button>
    </article>)}</div> : <p className="empty-state">No opinions added.</p>}
  </section>;
}

function Footer() {
  return <footer className="site-footer page-width"><div className="footer-top"><a className="footer-name" href="#home">{profile.name}<span className="footer-dot">.</span></a><div className="footer-links">{profile.links.map(link => <a href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label}<Icon name="external" size={13} /></a>)}{profile.email && <a href={`mailto:${profile.email}`}>Get in touch<Icon name="mail" size={15} /></a>}<a href="#home">Back to the beginning<Icon name="arrow" size={15} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span></div></footer>;
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [lenis, setLenis] = useState(null);
  const pageRef = useRef(null);
  const currentRoute = useRef(route);
  const navigationId = useRef(0);
  const reduced = useReducedMotion();
  usePageMotion(pageRef, route, reduced);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#121212' : '#ffffff';
    try { localStorage.setItem('personal-site-monochrome-theme', theme); } catch { /* Private browsing may disable storage. */ }
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduced);
    if (reduced || !window.matchMedia('(pointer: fine)').matches) { setLenis(null); return; }
    const smoothScroll = new Lenis({ lerp: 0.12, smoothWheel: true });
    smoothScroll.on('scroll', ScrollTrigger.update);
    const tick = time => smoothScroll.raf(time * 1000);
    gsap.ticker.add(tick);
    setLenis(smoothScroll);
    return () => { gsap.ticker.remove(tick); smoothScroll.destroy(); };
  }, [reduced]);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const scrollTo = (target, immediate = false) => {
      const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - 90;
      const instantly = immediate || reduced || document.hidden;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(top, { immediate: instantly, duration: 1.1, force: true });
      } else window.scrollTo({ top, behavior: instantly ? 'instant' : 'smooth' });
      if (target !== 0) target.focus({ preventScroll: true });
    };
    const navigate = async () => {
      const nextRoute = readRoute();
      const transaction = ++navigationId.current;
      setMenuOpen(false);
      setDetail(null);
      const anchor = readHomeAnchor();
      if (nextRoute === currentRoute.current) {
        gsap.killTweensOf(pageRef.current);
        gsap.set(pageRef.current, { opacity: 1 });
        scrollTo(anchor ? document.getElementById(anchor) || 0 : 0);
        return;
      }
      if (!reduced && !document.hidden) {
        const tween = gsap.to(pageRef.current, { opacity: 0, duration: 0.2, ease: 'power1.in', overwrite: true });
        await Promise.race([tween.then(), new Promise(resolve => setTimeout(resolve, 350))]);
      }
      if (transaction !== navigationId.current) return;
      currentRoute.current = nextRoute;
      scrollTo(0, true);
      setRoute(nextRoute);
    };
    const handleNavigation = event => {
      const anchor = event.target.closest('a[href^="#"]');
      if (event.defaultPrevented || !anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = anchor.hash.slice(1);
      if (!routes.some(item => item.id === id) && !['description', 'my-story'].includes(id)) return;
      // Keep native fragment scrolling from competing with Lenis.
      event.preventDefault();
      if (anchor.hash !== location.hash) history.pushState(null, '', anchor.hash);
      navigate();
    };
    window.addEventListener('hashchange', navigate);
    document.addEventListener('click', handleNavigation);
    return () => { ++navigationId.current; window.removeEventListener('hashchange', navigate); document.removeEventListener('click', handleNavigation); };
  }, [reduced, lenis]);

  useLayoutEffect(() => {
    document.title = `${route === 'home' ? profile.name : routes.find(r => r.id === route).label} — ${route === 'home' ? 'Personal website' : profile.name}`;
    const anchor = readHomeAnchor();
    const target = anchor && document.getElementById(anchor);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'instant' });
      target.focus({ preventScroll: true });
    }
    else if (location.hash) (pageRef.current.querySelector('h1') || pageRef.current).focus({ preventScroll: true });
  }, [route]);

  return <>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content').focus(); }}>Skip to content</a>
    <Header route={route} theme={theme} onThemeChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    <main id="main-content" tabIndex={-1} ref={pageRef}>
      {route === 'home' && <Home theme={theme} reduced={reduced} onOpen={setDetail} />}
      {route === 'projects' && <Projects onOpen={setDetail} />}
      {route === 'publications' && <Publications onOpen={setDetail} />}
      {route === 'opinions' && <Opinions onOpen={setDetail} />}
    </main>
    <p className="sr-only" aria-live="polite">{routes.find(r => r.id === route).label} page</p>
    <Footer />
    {detail && <DetailDialog item={detail} onClose={() => setDetail(null)} lenis={lenis} />}
  </>;
}
