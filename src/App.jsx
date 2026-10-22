import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { profile, projects, publications, opinions } from './data/site.js';
import useReducedMotion from './hooks/useReducedMotion.js';
import usePageMotion from './hooks/usePageMotion.js';
import EEGWaveform from './components/EEGWaveform.jsx';
import Icon from './components/Icon.jsx';
import ProjectVisual from './components/ProjectVisual.jsx';
import DetailDialog from './components/DetailDialog.jsx';

const routes = [
  { id: 'home', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Publications' },
  { id: 'opinions', label: 'Opinions' },
];

function readRoute() {
  const hash = window.location.hash.slice(1);
  return routes.some(route => route.id === hash) ? hash : 'home';
}

function Title({ children, className = '' }) {
  return <h1 className={className} tabIndex={-1} aria-label={children}>{children.split(' ').map((word, i) => <span className="title-word" key={i} aria-hidden="true">{[...word].map((char, j) => <span className="title-unit" data-title-unit key={j}>{char}</span>)}{' '}</span>)}</h1>;
}

function ExampleBadge({ example }) {
  return example ? <span className="example-badge">Starter entry</span> : null;
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

function Home({ theme, reduced, onOpen }) {
  const quote = 'A place to connect the things I make with the things I’m thinking about.';
  return <>
    <section className="welcome-hero" aria-labelledby="name-heading">
      <EEGWaveform reduced={reduced} theme={theme} className="welcome-wave" />
      <div className="hero-inner">
        <p className="eyebrow hero-eyebrow" data-intro><span className="status-dot" /> {profile.role}</p>
        <div id="name-heading"><Title className="welcome-title">{profile.name}</Title></div>
        <p className="introduction" data-intro>{profile.introduction}</p>
        <div className="hero-actions" data-intro><a className="button primary" href="#projects">Explore my work<Icon name="arrow" size={17} /></a><a className="quiet-link" href="#opinions">Read my opinions<Icon name="external" size={16} /></a></div>
        <a className="quiet-link lab-link" href="https://eego-unc.github.io/Lab/#home" target="_blank" rel="noreferrer" data-intro>EEGo UNC<Icon name="external" size={14} /></a>
      </div>
      <a className="hero-scroll" href="#description" data-intro><span>A LITTLE FURTHER DOWN</span><Icon name="down" size={14} /></a>
    </section>
    <section id="description" className="description-section page-width">
      <div className="section-kicker" data-reveal><span className="eyebrow">01 / DESCRIPTION</span><span className="rule" /><span className="small-note">A little about me</span></div>
      <div className="description-grid">
        <h2 data-reveal>{profile.descriptionTitle.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
        <div className="description-copy" data-reveal>{profile.description.map((text, i) => <p key={i}>{text}</p>)}<div className="interest-list">{profile.interests.map(interest => <span key={interest}>{interest}</span>)}</div></div>
      </div>
    </section>
    <section className="home-work page-width">
      <div className="section-kicker" data-reveal><span className="eyebrow">02 / SELECTED WORK</span><span className="rule" /><a className="small-link" href="#projects">All projects<Icon name="arrow" size={15} /></a></div>
      <article className="project-entry featured-entry" data-entry>
        <div className="feature-frame" data-wipe><div className="home-feature-visual"><ProjectVisual type="signal" /></div></div>
        <div className="entry-content"><div className="entry-meta"><span className="eyebrow">{projects[0].category} / {projects[0].year}</span><ExampleBadge example={projects[0].example} /></div><h3>{projects[0].title}</h3><p>{projects[0].summary}</p><div className="tags">{projects[0].tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="text-link" onClick={() => onOpen(projects[0])}>Explore project<Icon name="external" size={16} /></button></div>
      </article>
    </section>
    <section className="home-quote page-width"><p data-quote aria-label={quote}>{quote.split(' ').map((word, i) => <span key={i} aria-hidden="true"><span className="word">{word}</span>{' '}</span>)}</p><span className="eyebrow quote-caption">WORK, WORDS, AND EVERYTHING IN BETWEEN</span></section>
    <section className="explore-section page-width">
      <div className="explore-heading" data-reveal><h2>Two more ways<br />to get to know me.</h2><p>The work is only part of the story.</p></div>
      <div className="explore-grid">
        <a className="explore-card" href="#publications" data-reveal><div className="explore-card-top"><span className="eyebrow">03 / PUBLICATIONS</span><Icon name="external" size={21} /></div><h3>Ideas, shared.</h3><p>Papers, presentations, and contributions to a bigger conversation.</p><span className="text-link">Browse publications<Icon name="arrow" size={16} /></span></a>
        <a className="explore-card" href="#opinions" data-reveal><div className="explore-card-top"><span className="eyebrow">04 / OPINIONS</span><Icon name="external" size={21} /></div><h3>Thinking aloud.</h3><p>Perspectives, field notes, and thoughts that are still taking shape.</p><span className="text-link">Read the opinions<Icon name="arrow" size={16} /></span></a>
      </div>
    </section>
  </>;
}

function PageIntro({ number, label, title, description }) {
  return <div className="page-intro"><p className="eyebrow" data-intro>{number} / {label}</p><Title>{title}</Title><p className="page-description" data-intro>{description}</p></div>;
}

function FilterBar({ values, selected, onChange, count, noun }) {
  return <div className="filter-bar"><div className="filter-options" role="group" aria-label={`Filter ${noun}`}>{values.map(value => <button key={value} className={`filter-button ${selected === value ? 'is-active' : ''}`} aria-pressed={selected === value} onClick={() => onChange(value)}>{value}</button>)}</div><span className="result-count" role="status">{String(count).padStart(2, '0')} {count === 1 ? noun.replace(/s$/, '') : noun}</span></div>;
}

function Projects({ onOpen }) {
  const [filter, setFilter] = useState('All');
  const filtered = projects.filter(project => filter === 'All' || project.category === filter);
  return <div className="page-width interior-page"><PageIntro number="02" label="PROJECTS" title="Things I’m building." description="A collection of projects, experiments, and ideas put into practice." /><FilterBar values={['All', ...new Set(projects.map(p => p.category))]} selected={filter} onChange={setFilter} count={filtered.length} noun="projects" /><div key={filter} className="filtered-content project-list">{filtered.map((project) => <article className="project-entry" key={project.id}><div className="feature-frame"><ProjectVisual type={project.visual} number={String(projects.indexOf(project) + 1).padStart(2,'0')} /></div><div className="entry-content"><div className="entry-meta"><span className="eyebrow">{project.category} / {project.year}</span><ExampleBadge example={project.example} /></div><h2>{project.title}</h2><p>{project.summary}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="text-link" onClick={() => onOpen(project)}>Explore project<Icon name="external" size={16} /></button></div></article>)}</div><p className="starter-note">These starter entries are ready to be replaced with your own work.</p></div>;
}

function Publications({ onOpen }) {
  const [filter, setFilter] = useState('All');
  const filtered = publications.filter(publication => filter === 'All' || publication.type === filter);
  return <div className="page-width interior-page"><PageIntro number="03" label="PUBLICATIONS" title="Ideas, shared." description="Papers, presentations, and contributions to a bigger conversation." /><FilterBar values={['All', ...new Set(publications.map(p => p.type))]} selected={filter} onChange={setFilter} count={filtered.length} noun="publications" /><div key={filter} className="filtered-content publication-list">{filtered.map(publication => <article className="publication-row" key={publication.id}><div className="publication-year">{publication.year}<span>{publication.type}</span></div><div className="publication-content"><div className="entry-meta"><span className="eyebrow">{publication.venue}</span><ExampleBadge example={publication.example} /></div><h2><button onClick={() => onOpen(publication)}>{publication.title}</button></h2><p className="authors">{publication.authors}</p><p>{publication.summary}</p><button className="text-link" onClick={() => onOpen(publication)}>Read abstract<Icon name="arrow" size={16} /></button></div><Icon name="file" size={27} /></article>)}</div><p className="starter-note">Example publications are placeholders. Add your real titles, authors, and links.</p></div>;
}

function Opinions({ onOpen }) {
  return <div className="page-width interior-page"><PageIntro number="04" label="OPINIONS" title="Thinking aloud." description="Perspectives, field notes, and thoughts that are still taking shape. Always open to a different point of view." /><div className="opinions-topline"><span className="eyebrow">THE NOTEBOOK</span><span className="result-count">{String(opinions.length).padStart(2, '0')} entries</span></div><div className="opinion-list">{opinions.map((opinion, index) => <article className="opinion-row" key={opinion.id} data-reveal><span className="opinion-number">{String(index + 1).padStart(2, '0')}</span><div><div className="entry-meta"><span className="eyebrow">{opinion.category}</span><ExampleBadge example={opinion.example} /></div><h2><button onClick={() => onOpen(opinion)}>{opinion.title}</button></h2><p>{opinion.summary}</p><div className="opinion-meta"><time dateTime={opinion.date}>{new Date(`${opinion.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day:'numeric', year:'numeric' })}</time><span>·</span><span>{opinion.readTime}</span></div></div><button className="opinion-open" aria-label={`Read ${opinion.title}`} onClick={() => onOpen(opinion)}><Icon name="external" size={23} /></button></article>)}</div><p className="starter-note">These are starter prompts for your writing, not attributed personal opinions.</p></div>;
}

function Footer() {
  return <footer className="site-footer page-width"><div className="footer-top"><a className="footer-name" href="#home">{profile.name}<span className="footer-dot">.</span></a><div className="footer-links">{profile.links.map(link => <a href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label}<Icon name="external" size={13} /></a>)}{profile.email && <a href={`mailto:${profile.email}`}>Get in touch<Icon name="mail" size={15} /></a>}<a href="#home">Back to the beginning<Icon name="arrow" size={15} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span><span>Made with curiosity.<span className="footer-pulse" aria-hidden="true"> ∿</span></span></div></footer>;
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
      if (lenis) lenis.scrollTo(target, { immediate, offset: target === 0 ? 0 : -90, duration: 1.1, force: true });
      else if (target === 0) window.scrollTo({ top: 0, behavior: immediate || reduced ? 'instant' : 'smooth' });
      else target.scrollIntoView({ behavior: immediate || reduced ? 'instant' : 'smooth' });
    };
    const navigate = async () => {
      const nextRoute = readRoute();
      const transaction = ++navigationId.current;
      setMenuOpen(false);
      setDetail(null);
      const anchor = location.hash === '#description';
      if (nextRoute === currentRoute.current) {
        gsap.killTweensOf(pageRef.current);
        gsap.set(pageRef.current, { opacity: 1 });
        scrollTo(anchor ? document.getElementById('description') : 0);
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
    const repeatNavigation = event => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (anchor.hash === location.hash) { event.preventDefault(); navigate(); }
    };
    window.addEventListener('hashchange', navigate);
    document.addEventListener('click', repeatNavigation);
    return () => { ++navigationId.current; window.removeEventListener('hashchange', navigate); document.removeEventListener('click', repeatNavigation); };
  }, [reduced, lenis]);

  useEffect(() => {
    document.title = `${route === 'home' ? profile.name : routes.find(r => r.id === route).label} — ${route === 'home' ? 'Personal website' : profile.name}`;
    if (location.hash === '#description') document.getElementById('description')?.scrollIntoView();
    else if (location.hash) pageRef.current.querySelector('h1')?.focus({ preventScroll: true });
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
