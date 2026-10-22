export default function ProjectVisual({ type = 'signal', number = '01' }) {
  return <div className={`project-visual visual-${type}`} aria-hidden="true">
    <span className="visual-label">{type === 'signal' ? 'SIGNAL / EXPLORATION' : type === 'network' ? 'CONNECTION / EXPERIMENT' : 'SYSTEM / SOFTWARE'}</span>
    <svg viewBox="0 0 480 280" fill="none">
      <defs><pattern id={`grid-${type}`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" stroke="currentColor" opacity=".12" /></pattern></defs>
      <rect width="480" height="280" fill={`url(#grid-${type})`} />
      {type === 'signal' ? <>
        {[0, 1, 2, 3, 4].map(i => <path key={i} d={Array.from({length: 161}, (_, x) => `${x ? 'L' : 'M'}${x * 3},${85 + i * 28 + Math.sin(x * .12 + i) * (12 + Math.sin(x * .047) * 10) + Math.sin(x * .43 + i) * 3}`).join(' ')} stroke="currentColor" opacity={.8 - i * .12} />)}
        <path d="M240 40v205" stroke="currentColor" strokeDasharray="3 5" opacity=".35" />
      </> : type === 'network' ? <>
        {[[80,140],[155,70],[155,210],[240,105],[240,175],[325,70],[325,210],[400,140]].flatMap((p,i,points)=>points.slice(i+1).filter((_,j)=>j%3===0).map((q,j)=><path key={`${i}-${j}`} d={`M${p}L${q}`} stroke="currentColor" opacity=".22" />))}
        {[[80,140],[155,70],[155,210],[240,105],[240,175],[325,70],[325,210],[400,140]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="16" stroke="currentColor" opacity=".25"/><circle cx={x} cy={y} r="4" fill="currentColor" /></g>)}
      </> : <>
        {[0,1,2].map(i=><g key={i}><rect x={100+i*36} y={56+i*28} width="200" height="112" rx="5" fill="var(--figure)" stroke="currentColor" opacity={.3+i*.25}/><path d={`M${115+i*36} ${76+i*28}h50m-50 12h90`} stroke="currentColor" opacity=".45" /></g>)}
        <path d="m210 150-12 12 12 12m58-24 12 12-12 12m-21-30-14 36" stroke="currentColor" strokeWidth="2" />
      </>}
    </svg>
    <div className="visual-footer"><span>SELECTED WORK</span><span>{number} / 03</span></div>
  </div>;
}
