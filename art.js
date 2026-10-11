/* Bounce Back — illustrations, themes and little delights. All drawn inline; no image files. */

const THEMES = [
  ['heather', 'Highland Heather', ['#ECE7F3', '#6B3F8F', '#C97B36']],
  ['duckegg', 'Duck Egg Blue', ['#E3EEEC', '#2F6F73', '#D98C5F']],
  ['coffee', 'Coffee Shop', ['#F1E8DC', '#7A4526', '#B98A4E']],
  ['rose', 'Vintage Rose', ['#F6ECE6', '#B24A5E', '#6F8F6A']],
  ['mystery', 'Midnight Mystery', ['#161A28', '#E2B659', '#8C6FB8']]
];

/* The Highland cow. mood: 'hi' | 'happy' | 'sleepy'.  acc: 'mug' | 'crown' | 'glass' | 'zzz' | '' */
function cowInner(mood, acc) {
  const eye = (x) => mood === 'happy' ? `<path d="M${x - 4} 64q4-5 8 0" fill="none" stroke="#2B2233" stroke-width="2.4" stroke-linecap="round"/>`
    : mood === 'sleepy' ? `<path d="M${x - 4} 63q4 4 8 0" fill="none" stroke="#2B2233" stroke-width="2.4" stroke-linecap="round"/>`
    : `<circle cx="${x}" cy="63" r="3.6" fill="#2B2233"/><circle cx="${x + 1.2}" cy="61.8" r="1.1" fill="#fff"/>`;
  const horn = '<path d="M40 40C24 40 10 30 7 10c9 11 22 17 38 20z" fill="#F1E6CF" stroke="#8A6A45" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 10c1 6 3 10 6 14 0-4-2-9-6-14z" fill="#8A6A45"/>';
  const ear = '<ellipse cx="24" cy="56" rx="13" ry="7.5" fill="#B5702C" transform="rotate(-16 24 56)"/><ellipse cx="24" cy="56.5" rx="8" ry="4" fill="#E9B7A3" transform="rotate(-16 24 56)"/>';
  const flip = s => `<g transform="translate(120 0) scale(-1 1)">${s}</g>`;
  const A = {
    mug: '<g transform="translate(84 74)"><path d="M6 3q-3-5 0-9M14 3q-3-5 0-9" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/><path d="M0 6h22v14a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z" fill="#fff" stroke="#2B2233" stroke-width="1.8"/><path d="M22 10h4a5 5 0 0 1 0 10h-4" fill="none" stroke="#2B2233" stroke-width="1.8"/><path d="M11 12c-3-3-7 1-3 5l3 3 3-3c4-4 0-8-3-5z" fill="#C2456A"/></g>',
    crown: '<g>' + [[36, 31, '#C98BD6'], [46, 24, '#F2C14E'], [60, 21, '#E77C9A'], [74, 24, '#F2C14E'], [84, 31, '#C98BD6']].map(f => `<g transform="translate(${f[0]} ${f[1]})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-4" rx="2.6" ry="4" fill="${f[2]}" transform="rotate(${a})"/>`).join('')}<circle r="2.2" fill="#fff"/></g>`).join('') + '<path d="M34 34q26-16 52 0" fill="none" stroke="#4E8A58" stroke-width="2" stroke-linecap="round"/></g>',
    glass: '<g transform="translate(82 70)"><circle cx="11" cy="11" r="10" fill="#DFF1F6" fill-opacity=".8" stroke="#2B2233" stroke-width="2.4"/><path d="M19 19l11 11" stroke="#2B2233" stroke-width="4.5" stroke-linecap="round"/><path d="M6 9q3-5 8-4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g>',
    zzz: '<g fill="#fff" font-family="Georgia,serif" font-weight="700" opacity=".9"><text x="92" y="38" font-size="15">z</text><text x="102" y="26" font-size="11">z</text><text x="109" y="17" font-size="8">z</text></g>'
  };
  return `${horn}${flip(horn)}${ear}${flip(ear)}
    <path d="M30 60c0-24 13-36 30-36s30 12 30 36c0 26-12 44-30 44S30 86 30 60z" fill="#CF8840"/>
    <path d="M30 62c-4 6-4 14-1 20 1-6 3-9 6-12zM90 62c4 6 4 14 1 20-1-6-3-9-6-12z" fill="#B5702C"/>
    <ellipse cx="60" cy="85" rx="22" ry="15" fill="#F7DFD0"/>
    <ellipse cx="52" cy="83" rx="2.6" ry="3.6" fill="#9A5E4E"/><ellipse cx="68" cy="83" rx="2.6" ry="3.6" fill="#9A5E4E"/>
    <path d="M53 92q7 5 14 0" fill="none" stroke="#9A5E4E" stroke-width="2" stroke-linecap="round"/>
    ${eye(47)}${eye(73)}
    <path d="M33 54c1-20 13-31 27-31s26 11 27 31c-5-6-8 0-11 6-1-10-6-11-8-1-2-10-8-11-10 1-2-11-8-11-10 0-3-7-8-11-15-6z" fill="#B5702C"/>
    <path d="M44 30c3-10 10-14 16-14s13 4 16 14c-5-5-11-6-16-6s-11 1-16 6z" fill="#DDA05A"/>
    <path d="M52 26c2 8 1 16-2 24M68 26c-2 8-1 16 2 24M60 24v24" fill="none" stroke="#9C5E22" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
    ${A[acc] || ''}`;
}
function cow(size, mood, acc) { return `<svg class="cow" width="${size}" height="${Math.round(size * 110 / 120)}" viewBox="0 0 120 110" aria-hidden="true">${cowInner(mood || 'hi', acc || '')}</svg>`; }

/* Sky + hills behind the greeting. phase: morning | day | evening | night */
function phaseOf(h) { return h < 5 ? 'night' : h < 11 ? 'morning' : h < 17 ? 'day' : h < 21 ? 'evening' : 'night'; }
function hills(phase) {
  const night = phase === 'night';
  const orb = phase === 'morning' ? '<circle cx="64" cy="118" r="30" fill="#FFD98A"/>' : phase === 'day' ? '<circle cx="300" cy="34" r="20" fill="#FFE39A"/>' : phase === 'evening' ? '<circle cx="78" cy="108" r="26" fill="#FFB98A"/>'
    : '<circle cx="62" cy="36" r="15" fill="#F4EBD0"/><circle cx="68" cy="31" r="13" fill="#2A2850"/>' + [[130, 22], [182, 44], [228, 18], [270, 52], [318, 28], [104, 58], [344, 66]].map(s => `<circle cx="${s[0]}" cy="${s[1]}" r="1.5" fill="#fff" opacity=".8"/>`).join('');
  return `<svg class="hills" viewBox="0 0 360 170" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${orb}
    <path d="M0 122c50-30 96-34 150-16s120 10 210-22v86H0z" fill="${night ? '#3D3566' : '#9B7BB8'}"/>
    <path d="M0 140c70-26 130-20 190-6s110 6 170-14v50H0z" fill="${night ? '#2F4A45' : '#6FA06E'}"/>
    ${[[24, 150], [58, 142], [96, 152], [140, 146], [176, 156]].map(f => `<g transform="translate(${f[0]} ${f[1]})"><path d="M0 10V0" stroke="${night ? '#27403B' : '#4B7B50'}" stroke-width="1.6"/><ellipse cx="0" cy="-1" rx="2.2" ry="4.5" fill="${night ? '#8D7BC2' : '#C79BE0'}"/><ellipse cx="-3" cy="3" rx="1.8" ry="3.4" fill="${night ? '#7A69B0' : '#B584D4'}"/><ellipse cx="3" cy="3" rx="1.8" ry="3.4" fill="${night ? '#7A69B0' : '#B584D4'}"/></g>`).join('')}</svg>`;
}

/* Small line icons for card headings */
const GLYPH = {
  bolt: '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
  egg: '<path d="M12 3c-3.5 0-6.5 5-6.5 9.5a6.5 6.5 0 0 0 13 0C18.500 8 15.500 3 12 3z"/>',
  drop: '<path d="M12 3c-3 4.500-6 7.500-6 11a6 6 0 0 0 12 0c0-3.500-3-6.500-6-11z"/>',
  bounce: '<ellipse cx="12" cy="16" rx="8" ry="2.500"/><path d="M6 17.500V21M18 17.500V21M12 4v6M9.500 7.500L12 10l2.500-2.500"/>',
  pill: '<rect x="3.500" y="8.500" width="17" height="7" rx="3.500" transform="rotate(-40 12 12)"/><path d="M9.300 9.800l4.500 5.400"/>',
  star: '<path d="M12 3.500l2.600 5.400 5.900.8-4.300 4.100 1 5.900L12 16.900l-5.200 2.800 1-5.900L3.500 9.700l5.900-.8z"/>',
  flag: '<path d="M6 21V4M6 5h11l-2.500 3.500L17 12H6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.500M12 18.500V21M3 12h2.500M18.500 12H21M5.600 5.600l1.800 1.800M16.600 16.600l1.800 1.800M5.600 18.400l1.800-1.800M16.600 7.400l1.800-1.800"/>',
  mug: '<path d="M5 9h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 11h1.500a2.500 2.500 0 0 1 0 5H16M8 6q-1-1.500 0-3M12 6q-1-1.500 0-3"/>',
  glass: '<circle cx="10.500" cy="10.500" r="6"/><path d="M15 15l5.500 5.500"/>'
};
const glyph = (k, cls) => `<span class="glyph ${cls || ''}"><svg viewBox="0 0 24 24" aria-hidden="true">${GLYPH[k]}</svg></span>`;

/* Sticker book: one sticker for every case closed */
const scallop = (() => { let d = ''; const n = 14; for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI, b = (i + 1) / n * 2 * Math.PI, r = 27; d += (i ? '' : `M${(32 + r * Math.cos(a)).toFixed(1)} ${(32 + r * Math.sin(a)).toFixed(1)}`) + `A6.300 6.300 0 0 1 ${(32 + r * Math.cos(b)).toFixed(1)} ${(32 + r * Math.sin(b)).toFixed(1)}`; } return d + 'z'; })();
const SK = '#2B2233';
const STICKERS = [
  ['First Clue', '#E9DCF3', `<circle cx="29" cy="29" r="9" fill="#DFF1F6" stroke="${SK}" stroke-width="2.4"/><path d="M36 36l9 9" stroke="${SK}" stroke-width="4" stroke-linecap="round"/>`],
  ['Coffee First', '#F3E2CC', `<path d="M21 26h20v12a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" fill="#fff" stroke="${SK}" stroke-width="2.200"/><path d="M41 29h3a4.500 4.500 0 0 1 0 9h-3" fill="none" stroke="${SK}" stroke-width="2.200"/><path d="M27 22q-2-3 0-6M34 22q-2-3 0-6" fill="none" stroke="${SK}" stroke-width="2" stroke-linecap="round"/>`],
  ['Movie Night', '#FBE3DA', `<path d="M22 28h20l-3 19H25z" fill="#fff" stroke="${SK}" stroke-width="2.200" stroke-linejoin="round"/><path d="M27.500 28l1.500 19M36.500 28L35 47" stroke="#D2504A" stroke-width="3"/><circle cx="25" cy="24" r="4.500" fill="#FFE9A8" stroke="${SK}" stroke-width="2"/><circle cx="32" cy="21" r="5" fill="#FFE9A8" stroke="${SK}" stroke-width="2"/><circle cx="39" cy="24" r="4.500" fill="#FFE9A8" stroke="${SK}" stroke-width="2"/>`],
  ['Crafty', '#DDEEDD', `<circle cx="31" cy="33" r="12" fill="#E77C9A" stroke="${SK}" stroke-width="2.200"/><path d="M22 27q9 2 17 12M20 34q9-1 16 9M27 22q8 4 14 10" fill="none" stroke="${SK}" stroke-width="1.600" stroke-linecap="round"/><path d="M41 42q6 3 4 8" fill="none" stroke="${SK}" stroke-width="2" stroke-linecap="round"/>`],
  ['Fresh Coat', '#DCEBF1', `<path d="M40 16l8 8-14 14-8-8z" fill="#E2B659" stroke="${SK}" stroke-width="2.200" stroke-linejoin="round"/><path d="M26 30l8 8-5 5c-4 4-12 5-13 4s0-9 4-13z" fill="#3F9AA8" stroke="${SK}" stroke-width="2.200" stroke-linejoin="round"/>`],
  ['Vintage Find', '#F1E6CF', `<rect x="19" y="19" width="26" height="26" rx="2" fill="#C99A52" stroke="${SK}" stroke-width="2.200"/><rect x="24" y="24" width="16" height="16" fill="#DFF1F6" stroke="${SK}" stroke-width="1.800"/><path d="M24 38l5-6 4 4 3-3 4 5" fill="#6FA06E" stroke="${SK}" stroke-width="1.400" stroke-linejoin="round"/>`],
  ['Spa Day', '#FBE0EA', `<rect x="24" y="28" width="16" height="19" rx="4" fill="#E0457B" stroke="${SK}" stroke-width="2.200"/><rect x="28" y="15" width="8" height="13" rx="1.500" fill="${SK}"/><path d="M28 34h8" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`],
  ['Plot Twist', '#E4E0F0', `<rect x="18" y="29" width="28" height="17" rx="2" fill="#fff" stroke="${SK}" stroke-width="2.200"/><path d="M18 23l27-6 1.500 6-27 6z" fill="${SK}"/><path d="M24 21.500l3 5M32 19.800l3 5M40 18l3 5" stroke="#fff" stroke-width="2.200"/>`],
  ['Heather Bloom', '#E3F0DF', `<path d="M32 50V26" stroke="#4B7B50" stroke-width="2.400" stroke-linecap="round"/>${[[32, 18], [27, 24], [37, 24], [26, 32], [38, 32], [28, 40], [36, 40]].map(p => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="3.200" ry="4.600" fill="#B584D4" stroke="${SK}" stroke-width="1.400"/>`).join('')}`],
  ['Bounce Queen', '#FCEBC8', `<ellipse cx="32" cy="40" rx="15" ry="4.500" fill="#6B3F8F" stroke="${SK}" stroke-width="2.200"/><path d="M20 43v6M44 43v6" stroke="${SK}" stroke-width="2.400" stroke-linecap="round"/><path d="M32 14l2.800 5.800 6.200.8-4.500 4.300 1.100 6.100-5.600-3-5.600 3 1.100-6.100-4.500-4.300 6.200-.8z" fill="#F2C14E" stroke="${SK}" stroke-width="1.800" stroke-linejoin="round"/>`],
  ['Leader of the Fold', '#EBDDF2', `<svg x="12" y="13" width="40" height="37" viewBox="0 0 120 110">${cowInner('happy', 'crown')}</svg>`],
  ['Case Cracker', '#FFE2B0', `<path d="M32 13l5.200 10.600 11.700 1.700-8.500 8.200 2 11.600L32 39.600l-10.400 5.500 2-11.600-8.500-8.200 11.700-1.700z" fill="#E2B659" stroke="${SK}" stroke-width="2.200" stroke-linejoin="round"/><path d="M27 30l4 4 7-8" fill="none" stroke="${SK}" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/>`]
];
function sticker(i, earned, size) {
  const s = STICKERS[i];
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" class="sticker ${earned ? '' : 'locked'}" aria-hidden="true"><path d="${scallop}" fill="${earned ? s[1] : 'var(--line)'}" stroke="${earned ? SK : 'none'}" stroke-width="1.600"/>${earned ? s[2] : '<text x="32" y="40" text-anchor="middle" font-size="22" font-family="Georgia,serif" fill="var(--soft)">?</text>'}</svg>`;
}

/* Cozy-mystery case titles; one per day */
const CASES = ['The Case of the Vanishing Water Glass', 'Murder, She Stretched', 'The Mystery of the Missing Protein', 'Death by Sitting Still (Averted)', 'The Curious Incident of the Mid-Afternoon Slump',
  'The Secret of the Second Glass', 'The Rebounder Affair', 'Whodunit? You Did', 'The Clue in the Coffee Cup', 'The Phantom of the Pantry', 'A Study in Sage and Heather', 'The Hound of the Laundry Basket',
  'The Body in the Bedtime Stretch', 'The Riddle of the Ten-Minute Bounce', 'The Thirty-Nine Sips', 'The Adventure of the Speckled Egg', 'Gone Grocery Shopping', 'The Maltese Meal Prep', 'The Big Sip', 'Rear Window, Front Lunge'];
const COW_FACTS = ['A group of Highland cattle is called a fold, not a herd.', 'The shaggy fringe over a Highland cow\'s eyes is called a dossan.', 'Highland cows have a double coat: a soft undercoat and a long oily outer coat that sheds rain.',
  'Both the cows and the bulls grow horns.', 'The Highland herd book dates to 1885, one of the oldest of any cattle breed.', 'Highland calves are sometimes called fluffy cows, for obvious reasons.'];
const COW_QUIPS = ['I believe in you. Also in snacks.', 'One glass at a time, detective.', 'You showed up. That\'s the whole trick.', 'Boop received.', 'Stretch like nobody\'s watching. I\'m not. I can\'t see through this fringe.',
  'Coffee first. Then we solve things.', 'Small steps. I have four legs and still take them one at a time.'];

function confetti() {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
  const cols = ['#B584D4', '#E2B659', '#E77C9A', '#6FA06E', '#3F9AA8', '#CF8840'];
  for (let i = 0; i < 36; i++) { const b = document.createElement('i'); b.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % cols.length]};animation-delay:${(Math.random() * .5).toFixed(2)}s;animation-duration:${(1.6 + Math.random() * 1.2).toFixed(2)}s;width:${6 + Math.random() * 6}px;height:${8 + Math.random() * 8}px;border-radius:${i % 3 ? '2px' : '50%'}`; box.appendChild(b); }
  document.body.appendChild(box); setTimeout(() => box.remove(), 3400);
}
