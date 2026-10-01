// Generates public/og-default.png (1200×630) — the default social share card.
// Run once after brand changes:  npm run og
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fdfbf7"/>
      <stop offset="1" stop-color="#efe3d3"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#b45f3f" stroke-width="3"/>

  <!-- sofa + plant line art, right side -->
  <g fill="none" stroke="#57534e" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <rect x="770" y="340" width="350" height="90" rx="30"/>
    <rect x="746" y="406" width="398" height="110" rx="30"/>
    <line x1="945" y1="352" x2="945" y2="414"/>
    <line x1="786" y1="516" x2="786" y2="560"/>
    <line x1="1104" y1="516" x2="1104" y2="560"/>
    <path d="M604 530 h84 l-12 58 h-60 z"/>
    <path d="M646 530 c-46 -52 -36 -108 4 -134 c40 26 50 82 -4 134 z"/>
    <line x1="240" y1="588" x2="1120" y2="588" stroke-width="6" opacity="0.5"/>
  </g>

  <!-- brand block, left -->
  <g font-family="Lato, sans-serif">
    <text x="110" y="240" font-size="108" font-weight="700" fill="#1c1917">FORMA<tspan fill="#b45f3f">.</tspan></text>
    <text x="112" y="308" font-size="40" letter-spacing="6" fill="#57534e">INTERIOR &amp; FURNITURE DESIGN</text>
    <rect x="112" y="352" width="120" height="8" fill="#b45f3f"/>
    <text x="112" y="430" font-size="30" fill="#78716c">Homes · Cafés · Workspaces · Retail</text>
    <text x="112" y="478" font-size="30" fill="#78716c">Concept — Joinery — Turnkey fit-out</text>
  </g>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL('../public/og-default.png', import.meta.url)));
console.log('✓ public/og-default.png written (1200×630)');
