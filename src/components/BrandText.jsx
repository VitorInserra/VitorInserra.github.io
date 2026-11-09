import { brandTokens, findBrand } from '../data/brands.js';

function colorNames(text) {
  return text.split(brandTokens).map((part, index) => {
    const brand = findBrand(part);
    if (brand?.id === 'brazil-confederation') return <span className="brand-name brand-name--brazil-confederation" key={index}>
      {part.split(' ').map((word, wordIndex) => <span key={wordIndex} className={`confederation-word confederation-word--${wordIndex}`}>{wordIndex > 0 && ' '}{word}</span>)}
    </span>;
    return brand ? <span className={`brand-name brand-name--${brand.id}`} key={index}>{part}</span> : part;
  });
}

// Render only supported bold markers and known brand names; never parse HTML.
export default function BrandText({ children = '' }) {
  return String(children).split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith('**')
    ? <strong key={index}>{colorNames(part.slice(2, -2))}</strong>
    : <span key={index}>{colorNames(part)}</span>);
}
