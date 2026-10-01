/**
 * Architectural line-art placeholder scenes, rendered as SVG strings.
 *
 * Used for project covers and gallery images until real photography is
 * dropped in (see README → "Replacing placeholders with photos").
 * `hue` tints each project's scene so the grid reads varied but cohesive.
 */

export type Scene =
  | 'living'
  | 'bedroom'
  | 'kitchen'
  | 'dining'
  | 'office'
  | 'cafe'
  | 'lounge'
  | 'facade';

export const SCENES: Scene[] = [
  'living',
  'bedroom',
  'kitchen',
  'dining',
  'office',
  'cafe',
  'lounge',
  'facade',
];

export function placeholderSvg(scene: Scene, hue: number, uid: string): string {
  const bg1 = `hsl(${hue} 36% 91%)`;
  const bg2 = `hsl(${hue} 30% 78%)`;
  const stroke = `hsl(${hue} 30% 30%)`;
  const soft = `hsla(${hue}, 32%, 97%, 0.5)`;
  const softer = `hsla(${hue}, 28%, 88%, 0.55)`;

  const open = (body: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">` +
    `<defs><linearGradient id="g${uid}" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="800" height="600" fill="url(#g${uid})"/>` +
    `<g fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">` +
    `<line x1="0" y1="452" x2="800" y2="452" stroke-width="3" opacity="0.55"/>` +
    body +
    `</g></svg>`;

  const g = (inner: string, extra = '') =>
    `<g fill="${soft}" ${extra}>${inner}</g>`;

  switch (scene) {
    case 'living':
      return open(
        // window
        g('<rect x="84" y="96" width="170" height="210" rx="6"/><line x1="169" y1="96" x2="169" y2="306"/><line x1="84" y1="201" x2="254" y2="201"/><circle cx="214" cy="150" r="16" fill="none"/>') +
          // wall art
          g('<rect x="560" y="112" width="112" height="142" rx="4"/><circle cx="616" cy="172" r="26" fill="none"/><line x1="578" y1="226" x2="654" y2="226"/>') +
          // sofa
          g('<rect x="300" y="286" width="270" height="66" rx="20"/><rect x="288" y="336" width="294" height="84" rx="20"/><line x1="435" y1="296" x2="435" y2="326"/><line x1="316" y1="420" x2="316" y2="444"/><line x1="554" y1="420" x2="554" y2="444"/>') +
          // floor lamp
          g('<line x1="632" y1="320" x2="632" y2="444"/><path d="M604 320 h56 l-12 -44 h-32 z"/><circle cx="632" cy="290" r="7" fill="none"/>') +
          // plant
          g('<path d="M172 398 h44 l-7 46 h-30 z"/><path d="M194 398 c-26 -30 -20 -62 2 -78 c20 16 26 48 -2 78 z"/><path d="M194 398 c24 -22 46 -24 60 -10 c-8 18 -36 24 -60 10 z"/>') +
          // rug
          `<rect x="252" y="464" width="380" height="24" rx="12" fill="${softer}" stroke="none"/>`,
      );
    case 'bedroom':
      return open(
        // pendants
        g('<line x1="356" y1="0" x2="356" y2="128"/><path d="M332 128 h48 l-10 26 h-28 z"/><line x1="452" y1="0" x2="452" y2="150"/><path d="M428 150 h48 l-10 26 h-28 z"/>') +
          // headboard + bed
          g('<rect x="218" y="238" width="330" height="96" rx="14"/><rect x="202" y="326" width="362" height="84" rx="16"/><rect x="240" y="300" width="88" height="40" rx="14"/><rect x="344" y="300" width="88" height="40" rx="14"/><line x1="202" y1="368" x2="564" y2="368"/><line x1="230" y1="410" x2="230" y2="444"/><line x1="536" y1="410" x2="536" y2="444"/>') +
          // side table + lamp
          g('<rect x="106" y="366" width="72" height="60" rx="8"/><line x1="142" y1="366" x2="142" y2="336"/><path d="M126 336 h32 l-6 -22 h-20 z"/>') +
          // window
          g('<rect x="590" y="120" width="140" height="180" rx="6"/><line x1="660" y1="120" x2="660" y2="300"/><line x1="590" y1="210" x2="730" y2="210"/>') +
          // rug
          `<rect x="220" y="466" width="330" height="22" rx="11" fill="${softer}" stroke="none"/>`,
      );
    case 'kitchen':
      return open(
        // upper cabinets
        g('<rect x="84" y="92" width="270" height="92" rx="6"/><line x1="174" y1="92" x2="174" y2="184"/><line x1="264" y1="92" x2="264" y2="184"/><line x1="84" y1="138" x2="354" y2="138" opacity="0.4"/>') +
          // hood
          g('<rect x="410" y="92" width="60" height="60"/><path d="M382 196 l58 -44 l58 44 z"/>') +
          // back counter
          g('<rect x="84" y="330" width="632" height="96" rx="10"/><line x1="84" y1="356" x2="716" y2="356" opacity="0.4"/><line x1="252" y1="426" x2="252" y2="452"/><line x1="548" y1="426" x2="548" y2="452"/>') +
          // faucet
          g('<path d="M170 330 v-34 c0 -16 26 -16 26 0 v6" fill="none"/>') +
          // shelf with jars
          g('<line x1="580" y1="150" x2="730" y2="150"/><rect x="596" y="118" width="24" height="32" rx="4"/><rect x="636" y="110" width="24" height="40" rx="4"/><rect x="676" y="124" width="24" height="26" rx="4"/>') +
          // island + stools
          g('<rect x="286" y="396" width="240" height="52" rx="10"/>') +
          g('<circle cx="330" cy="470" r="14" fill="${softer}"/><line x1="330" y1="484" x2="330" y2="500"/><circle cx="480" cy="470" r="14" fill="${softer}"/><line x1="480" y1="484" x2="480" y2="500"/>'),
      );
    case 'dining':
      return open(
        // pendants
        g('<line x1="330" y1="0" x2="330" y2="140"/><path d="M306 140 h48 l-12 30 h-24 z"/><line x1="470" y1="0" x2="470" y2="170"/><path d="M446 170 h48 l-12 30 h-24 z"/>') +
          // table
          g('<rect x="238" y="346" width="324" height="24" rx="8"/><line x1="270" y1="370" x2="270" y2="446"/><line x1="530" y1="370" x2="530" y2="446"/>') +
          // vase + stems
          g('<path d="M382 346 c-4 -22 6 -30 18 -30 c12 0 22 8 18 30 z"/><path d="M400 316 c-6 -26 -20 -34 -30 -36 M400 316 c2 -28 14 -38 26 -42" fill="none"/>') +
          // chairs
          g('<rect x="150" y="306" width="18" height="70" rx="8"/><rect x="128" y="366" width="74" height="16" rx="8"/><line x1="140" y1="382" x2="140" y2="446"/><line x1="190" y1="382" x2="190" y2="446"/>') +
          g('<rect x="632" y="306" width="18" height="70" rx="8"/><rect x="598" y="366" width="74" height="16" rx="8"/><line x1="610" y1="382" x2="610" y2="446"/><line x1="660" y1="382" x2="660" y2="446"/>') +
          // sideboard
          g('<rect x="600" y="250" width="150" height="0"/><rect x="604" y="256" width="140" height="70" rx="8" opacity="0"/>') +
          // rug
          `<rect x="230" y="468" width="340" height="22" rx="11" fill="${softer}" stroke="none"/>`,
      );
    case 'office':
      return open(
        // shelf
        g('<rect x="92" y="96" width="150" height="170" rx="6"/><line x1="92" y1="152" x2="242" y2="152"/><line x1="92" y1="208" x2="242" y2="208"/><rect x="106" y="122" width="14" height="30" fill="${softer}"/><rect x="124" y="116" width="14" height="36" fill="${softer}"/><rect x="160" y="180" width="14" height="28" fill="${softer}"/><rect x="178" y="176" width="14" height="32" fill="${softer}"/>') +
          // window
          g('<rect x="560" y="90" width="160" height="200" rx="6"/><line x1="640" y1="90" x2="640" y2="290"/>') +
          // desk + monitor
          g('<rect x="270" y="330" width="300" height="18" rx="6"/><line x1="296" y1="348" x2="296" y2="446"/><line x1="544" y1="348" x2="544" y2="446"/><rect x="356" y="252" width="128" height="76" rx="8"/><line x1="420" y1="328" x2="420" y2="330"/><line x1="396" y1="330" x2="444" y2="330"/>') +
          // chair
          g('<rect x="470" y="296" width="20" height="64" rx="9"/><rect x="452" y="356" width="76" height="16" rx="8"/><line x1="490" y1="372" x2="490" y2="410"/><path d="M462 434 c0 -16 56 -16 56 0" fill="none"/>') +
          // plant
          g('<path d="M672 400 h40 l-6 44 h-28 z"/><path d="M692 400 c-22 -26 -16 -54 2 -68 c18 14 24 42 -2 68 z"/>'),
      );
    case 'cafe':
      return open(
        // pendants
        g('<line x1="200" y1="0" x2="200" y2="120"/><path d="M178 120 h44 l-10 26 h-24 z"/><line x1="330" y1="0" x2="330" y2="150"/><path d="M308 150 h44 l-10 26 h-24 z"/><line x1="460" y1="0" x2="460" y2="120"/><path d="M438 120 h44 l-10 26 h-24 z"/>') +
          // menu board
          g('<rect x="572" y="100" width="160" height="118" rx="8"/><line x1="596" y1="134" x2="708" y2="134" opacity="0.5"/><line x1="596" y1="162" x2="688" y2="162" opacity="0.5"/><line x1="596" y1="190" x2="700" y2="190" opacity="0.5"/>') +
          // counter
          g('<rect x="130" y="316" width="400" height="104" rx="12"/><line x1="130" y1="342" x2="530" y2="342" opacity="0.4"/><line x1="188" y1="342" x2="188" y2="420" opacity="0.4"/><line x1="246" y1="342" x2="246" y2="420" opacity="0.4"/><line x1="304" y1="342" x2="304" y2="420" opacity="0.4"/><line x1="362" y1="342" x2="362" y2="420" opacity="0.4"/><line x1="420" y1="342" x2="420" y2="420" opacity="0.4"/><line x1="478" y1="342" x2="478" y2="420" opacity="0.4"/>') +
          // espresso machine + cup
          g('<rect x="228" y="262" width="104" height="54" rx="8"/><line x1="256" y1="316" x2="256" y2="300"/><line x1="304" y1="316" x2="304" y2="300"/>') +
          g('<path d="M510 296 h34 v20 c0 10 -34 10 -34 0 z"/><path d="M544 300 c14 0 14 14 0 14" fill="none"/>') +
          // stools
          g('<circle cx="250" cy="462" r="15" fill="${softer}"/><line x1="250" y1="477" x2="250" y2="494"/><circle cx="420" cy="462" r="15" fill="${softer}"/><line x1="420" y1="477" x2="420" y2="494"/>') +
          // plant
          g('<path d="M640 402 h42 l-6 44 h-30 z"/><path d="M661 402 c-24 -28 -18 -58 2 -74 c20 16 26 46 -2 74 z"/>'),
      );
    case 'lounge':
      return open(
        // back bar shelves
        g('<line x1="530" y1="120" x2="740" y2="120"/><line x1="530" y1="200" x2="740" y2="200"/><rect x="548" y="88" width="16" height="32" rx="4"/><rect x="576" y="82" width="16" height="38" rx="4"/><rect x="604" y="92" width="16" height="28" rx="4"/><rect x="648" y="168" width="16" height="32" rx="4"/><rect x="676" y="162" width="16" height="38" rx="4"/><rect x="704" y="172" width="16" height="28" rx="4"/>') +
          // pendants
          g('<line x1="240" y1="0" x2="240" y2="130"/><path d="M220 130 h40 l-9 24 h-22 z"/><line x1="380" y1="0" x2="380" y2="160"/><path d="M360 160 h40 l-9 24 h-22 z"/>') +
          // bar counter
          g('<rect x="110" y="320" width="500" height="100" rx="14"/><line x1="110" y1="348" x2="610" y2="348" opacity="0.4"/><line x1="180" y1="348" x2="180" y2="420" opacity="0.4"/><line x1="250" y1="348" x2="250" y2="420" opacity="0.4"/><line x1="320" y1="348" x2="320" y2="420" opacity="0.4"/><line x1="390" y1="348" x2="390" y2="420" opacity="0.4"/><line x1="460" y1="348" x2="460" y2="420" opacity="0.4"/><line x1="530" y1="348" x2="530" y2="420" opacity="0.4"/>') +
          // glass on bar
          g('<path d="M300 268 l20 34 h-40 z" fill="none"/><line x1="320" y1="302" x2="320" y2="318"/>') +
          // stools
          g('<circle cx="220" cy="462" r="15" fill="${softer}"/><line x1="220" y1="477" x2="220" y2="494"/><circle cx="350" cy="462" r="15" fill="${softer}"/><line x1="350" y1="477" x2="350" y2="494"/><circle cx="480" cy="462" r="15" fill="${softer}"/><line x1="480" y1="477" x2="480" y2="494"/>'),
      );
    case 'facade':
      return open(
        // sign band
        g('<rect x="130" y="130" width="540" height="70" rx="6"/><circle cx="400" cy="165" r="20" fill="none"/><line x1="300" y1="165" x2="360" y2="165" opacity="0.5"/><line x1="440" y1="165" x2="500" y2="165" opacity="0.5"/>') +
          // awning scallops
          `<path d="M130 200 q34 30 67.5 0 q34 30 67.5 0 q34 30 67.5 0 q34 30 67.5 0 q34 30 67.5 0 q34 30 67.5 0 q34 30 67.5 0 q34 30 67.5 0" fill="none"/>` +
          // windows + door
          g('<rect x="164" y="252" width="150" height="200" rx="6"/><line x1="239" y1="252" x2="239" y2="452"/><line x1="486" y1="252" x2="486" y2="452" opacity="0"/><rect x="486" y="252" width="150" height="200" rx="6"/><line x1="561" y1="252" x2="561" y2="452"/><rect x="352" y="286" width="96" height="166" rx="4"/><circle cx="432" cy="372" r="4"/>') +
          // planters
          g('<rect x="120" y="410" width="70" height="42" rx="8"/><path d="M155 410 c-18 -22 -12 -44 0 -56 c12 12 18 34 0 56 z"/><rect x="610" y="410" width="70" height="42" rx="8"/><path d="M645 410 c-18 -22 -12 -44 0 -56 c12 12 18 34 0 56 z"/>') +
          // ground
          `<line x1="60" y1="452" x2="740" y2="452"/>`,
      );
  }
}

export function placeholderDataUri(scene: Scene, hue: number, uid: string): string {
  return (
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(placeholderSvg(scene, hue, uid))
  );
}
