import { useEffect, useState } from 'react';

export default function useReducedMotion() {
  const forced = new URLSearchParams(window.location.search).get('motion') === 'reduced';
  const [reduced, setReduced] = useState(() => forced || window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(forced || query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, [forced]);
  return reduced;
}
