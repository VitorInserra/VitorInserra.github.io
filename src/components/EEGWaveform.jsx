import { useEffect, useRef } from 'react';

// React adaptation of the seeded EEG backdrop in EEGo-UNC/Lab.
// See REFERENCE.md for the upstream commit and matching hero parameters.
function randomSource(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export default function EEGWaveform({ reduced, theme, className = '', seed = 11 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const random = randomSource(seed);
    const palette = ['--accent', '--ink', '--theta', '--accent', '--ink', '--alpha', '--accent', '--beta'];
    const channels = Array.from({ length: 14 }, (_, index) => ({
      f: [0.006 + random() * 0.006, 0.02 + random() * 0.014, 0.055 + random() * 0.04],
      s: [0.5 + random() * 0.5, 1.1 + random() * 0.8, 2.2 + random() * 1.6],
      a: [0.5 + random() * 0.3, 0.25 + random() * 0.18, 0.1 + random() * 0.1],
      phase: random() * Math.PI * 2,
      burst: random() * Math.PI * 2,
      color: palette[index % palette.length],
    }));
    const styles = getComputedStyle(document.documentElement);
    const colors = Object.fromEntries(palette.map(token => {
      const hex = styles.getPropertyValue(token).trim().replace('#', '');
      return [token, [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16)).join(',')];
    }));
    let width = 0;
    let height = 0;
    let frameId = 0;
    let visible = false;
    let disposed = false;
    let lastTime = 0;

    function draw(time) {
      context.clearRect(0, 0, width, height);
      if (!width || !height) return;
      const count = Math.max(4, Math.min(14, Math.round(height / 26)));
      const gap = height / count;
      const t = time / 1000;
      context.lineWidth = 1.1;
      context.lineJoin = 'round';
      channels.slice(0, count).forEach((channel, index) => {
        const alpha = channel.color === '--ink' ? 0.32 : 0.55;
        context.strokeStyle = `rgba(${colors[channel.color]},${alpha})`;
        context.beginPath();
        for (let x = 0; x <= width + 3; x += 3) {
          const envelope = 0.7 + 0.3 * Math.sin(x * 0.0035 + t * 0.35 + channel.burst);
          const signal = channel.a[0] * Math.sin(x * channel.f[0] - t * channel.s[0] + channel.phase)
            + channel.a[1] * Math.sin(x * channel.f[1] - t * channel.s[1] + channel.phase * 2)
            + channel.a[2] * Math.sin(x * channel.f[2] - t * channel.s[2]);
          const y = gap * (index + 0.5) + gap * 0.95 * envelope * signal;
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      });
    }
    function frame(time) {
      lastTime = time;
      draw(time);
      frameId = requestAnimationFrame(frame);
    }
    function stop() { cancelAnimationFrame(frameId); frameId = 0; }
    function start() {
      if (!disposed && !reduced && visible && !document.hidden && !frameId) frameId = requestAnimationFrame(frame);
    }
    function resize() {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      draw(lastTime);
    }
    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    function onVisibilityChange() { if (document.hidden) stop(); else start(); }
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    document.addEventListener('visibilitychange', onVisibilityChange);
    resize();
    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [reduced, theme, seed]);
  return <canvas ref={canvasRef} className={`eeg-wave ${className}`} aria-hidden="true" />;
}
