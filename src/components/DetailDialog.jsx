import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

export default function DetailDialog({ item, onClose, lenis }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    lenis?.stop();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [lenis]);
  return <dialog ref={ref} className="detail-dialog" aria-labelledby="detail-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} data-lenis-prevent>
    <div className="dialog-inner">
      <div className="dialog-top"><span className="eyebrow">{item.category || item.type || 'Details'}{item.example ? ' / Starter entry' : ''}</span><button className="icon-button" aria-label="Close details" onClick={onClose}><Icon name="close" /></button></div>
      <h2 id="detail-title">{item.title}</h2>
      {item.authors && <p className="detail-meta">{item.authors} · {item.venue} · {item.year}</p>}
      {item.date && <p className="detail-meta">{new Date(`${item.date}T12:00:00`).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })} · {item.readTime}</p>}
      {item.summary && <p className="detail-summary">{item.summary}</p>}
      <div className="prose">{item.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      {item.url && <a className="button primary" href={item.url} target="_blank" rel="noreferrer">{item.type ? 'View publication' : 'Explore project'}<Icon name="external" size={17} /></a>}
    </div>
  </dialog>;
}
