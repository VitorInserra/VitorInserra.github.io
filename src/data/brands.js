// Name matching stays separate from content so brand styling is consistent
// across the timeline, project cards, publications, and reading dialogs.
export const brandNames = [
  { id: 'brazil-confederation', pattern: /Brazilian Fencing Confederation/i },
  {
    id: 'unc',
    pattern: /University of North Carolina at Chapel Hill|UNC(?: Chapel Hill| Department of Psychology and Neuroscience| Department of Computer Science| Student-Run Hedge Fund| Graduate Travel Grant| Global Affairs| App Lab)?|Richard Marks[’'] XRAI Group|Computational Neuroscience Journal Club|Velocity Capital|COIL Database|Neuroadaptive Tetris|COMP ?110(?: Course Website)?|EEGo Lab|EEGProc/i,
  },
  { id: 'itau', pattern: /Ita[uú](?: Unibanco| Asset)?|Quantitative User Experience Team|User Experimentation Team|QuantAI Challenge/i },
  { id: 'btg', pattern: /BTG(?: Pactual)?|Digital Assets Proprietary Trading Desk/i },
  { id: 'bullbull', pattern: /BullBull/i },
  { id: 'pinheiros', pattern: /(?:Esporte Clube )?Pinheiros/i },
  { id: 'ilrn', pattern: /Immersive Learning Research Network|iLRN/i },
  { id: 'emotiv', pattern: /EMOTIV(?: Inc\.?)?/i },
  { id: 'laura-bassi', pattern: /Laura Bassi(?: Scholarship)?/i },
];

const namePatterns = brandNames.map(brand => `(?:${brand.pattern.source})`).join('|');
export const brandTokens = new RegExp(`(?<![\\p{L}\\p{N}])(${namePatterns})(?![\\p{L}\\p{N}])`, 'giu');

export function findBrand(name) {
  return brandNames.find(brand => new RegExp(`^(?:${brand.pattern.source})$`, 'i').test(name));
}
