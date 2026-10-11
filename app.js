/* Bounce Back — everything is stored on this device only (localStorage). No accounts, no server. */
(function () {
'use strict';
const KEY = 'bounceback.v1';
const DEF = () => ({
  v: 1,
  profile: { name: '', goals: [], why: '', skip: [], weight: '', protein: 100, water: 64, move: 90, flags: {}, done: false },
  days: {}, supps: [], pantry: {}, plan: [], extra: [], got: {}, weights: [], showWeight: false, myGoals: [], reflect: {},
  rem: { items: [
    { id: 'w1', label: 'Glass of water to start the day', time: '07:30', on: true },
    { id: 'w2', label: 'Water break', time: '10:30', on: true },
    { id: 'w3', label: 'Water with lunch', time: '13:00', on: true },
    { id: 'w4', label: 'Afternoon water', time: '15:30', on: true },
    { id: 's1', label: 'Morning supplements', time: '08:00', on: false },
    { id: 's2', label: 'Evening supplements', time: '20:00', on: false },
    { id: 'm1', label: 'Time to bounce', time: '17:30', on: true },
    { id: 'u1', label: 'Wind down: stretch and breathe', time: '20:45', on: false }
  ] },
  ui: { tab: 'today', ktab: 'ideas', meal: 'all', voice: true }
});
let S = load();
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw), d = DEF(); return Object.assign(d, s, { profile: Object.assign(d.profile, s.profile), ui: Object.assign(d.ui, s.ui), rem: s.rem || d.rem }); } } catch (e) {}
  return DEF();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
const $ = (s, r) => (r || document).querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dkey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const tkey = () => dkey(new Date());
const uid = () => Math.random().toString(36).slice(2, 9);
function day(k) { k = k || tkey(); return S.days[k] || (S.days[k] = { p: [], w: [], m: [], s: {}, energy: 0, win: '', fired: {} }); }
const peek = k => S.days[k] || { p: [], w: [], m: [], s: {}, energy: 0, win: '' };
const sum = (a, f) => a.reduce((t, x) => t + (f ? f(x) : x), 0);
const sumP = d => sum(d.p, x => x.g), sumW = d => sum(d.w), sumM = d => sum(d.m, x => x.min);
function lastDays(n) { const out = []; for (let i = n - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); out.push(d); } return out; }
const weekMove = () => sum(lastDays(7), d => sumM(peek(dkey(d))));
const pct = (a, b) => Math.max(0, Math.min(100, b ? Math.round(a / b * 100) : 0));
const cheer = () => CHEERS[Math.floor(Math.random() * CHEERS.length)];
const P = () => S.profile;

/* ---------- small UI helpers ---------- */
let toastT;
function toast(msg) { let t = $('.toast'); if (t) t.remove(); t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2600); }
function sheet(html) { $('#overlay').innerHTML = '<div class="sheetbg" data-a="closeBg"><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>' + html + '</div></div>'; }
function closeSheet() { $('#overlay').innerHTML = ''; }
const COW = size => `<svg class="cow" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 20c-4-2-6-7-5-12 4 1 9 4 12 9zM56 20c4-2 6-7 5-12-4 1-9 4-12 9z" fill="#E9DCC3" stroke="#8A6B4A" stroke-width="1.5"/><ellipse cx="11" cy="30" rx="6" ry="4" fill="#B5743F" transform="rotate(-20 11 30)"/><ellipse cx="53" cy="30" rx="6" ry="4" fill="#B5743F" transform="rotate(20 53 30)"/><path d="M14 30c0-12 8-19 18-19s18 7 18 19c0 16-7 26-18 26S14 46 14 30z" fill="#C8894E"/><ellipse cx="32" cy="46" rx="11" ry="8.5" fill="#F3D9C4"/><ellipse cx="27.5" cy="46" rx="1.8" ry="2.4" fill="#8A5A48"/><ellipse cx="36.5" cy="46" rx="1.8" ry="2.4" fill="#8A5A48"/><path d="M15 31c1-11 5-18 9-20 0 7-1 15-4 23zM49 31c-1-11-5-18-9-20 0 7 1 15 4 23zM23 13c3 6 3 14 1 22 4-6 6-13 6-22zM41 13c-3 6-3 14-1 22-4-6-6-13-6-22zM28 11h8c1 8 0 15-4 22-4-7-5-14-4-22z" fill="#A9682F"/></svg>`;
const ICON = {
  today: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>',
  kitchen: '<svg viewBox="0 0 24 24"><path d="M6 3v7a2 2 0 0 0 4 0V3M8 3v18M17 3c-2 2-3 5-3 8h3zM17 11v10"/></svg>',
  move: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="15" rx="9" ry="3"/><path d="M5 17v3M19 17v3M12 4v6M9.5 7.5L12 10l2.5-2.5"/></svg>',
  supps: '<svg viewBox="0 0 24 24"><rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-40 12 12)"/><path d="M9.3 9.8l4.5 5.4"/></svg>',
  progress: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/></svg>'
};
const TABS = [['today', 'Today'], ['kitchen', 'Kitchen'], ['move', 'Move'], ['supps', 'Supplements'], ['progress', 'Progress']];

/* ---------- onboarding ---------- */
let ob = { step: 0 };
const GOALS = [['flex', 'Feel more flexible'], ['weight', 'Lose a little weight'], ['cardio', 'Not get winded so easily'], ['protein', 'Eat more protein'], ['water', 'Drink more water'],
  ['energy', 'Have more energy'], ['strength', 'Feel stronger'], ['sleep', 'Sleep better'], ['stress', 'Less stress'], ['me', 'More time for myself']];
function suggestProtein(lb) { const kg = lb * 0.4536; return [Math.round(kg * 1.2 / 5) * 5, Math.round(kg * 1.6 / 5) * 5]; }
function grab() { // pull current onboarding inputs into the profile
  const p = P(), v = id => { const el = $('#' + id); return el ? el.value.trim() : null; };
  if (v('obName') !== null) p.name = v('obName');
  if (v('obWhy') !== null) p.why = v('obWhy');
  if (v('obWeight') !== null) p.weight = v('obWeight');
  ['protein', 'water', 'move'].forEach(k => { const x = v('ob_' + k); if (x !== null && +x > 0) p[k] = Math.round(+x); });
}
function renderOnboard() {
  const p = P(), n = 5, s = ob.step;
  const dots = '<div class="dots">' + Array.from({ length: n }, (_, i) => `<i class="${i <= s ? 'on' : ''}"></i>`).join('') + '</div>';
  let body = '';
  if (s === 0) body = `<div style="margin-top:8vh">${COW(84)}</div><h1 style="margin-top:14px">Bounce Back</h1>
    <p class="muted" style="margin-top:10px;font-size:17px">A little space for getting your health back, at your pace. Food, water, movement and the small stuff that helps.</p>
    <div class="card" style="margin-top:22px"><label class="f" for="obName">What should we call you?</label><input id="obName" autocomplete="given-name" value="${esc(p.name)}" placeholder="Your first name"></div>
    <p class="tiny muted" style="margin-top:14px">Everything you enter stays on this phone. Nobody else can see it, and you can change or erase any of it later.</p>`;
  if (s === 1) body = `<h1>What matters to you right now?</h1><p class="muted" style="margin-top:8px">Pick as many as you like. These are yours to change any time.</p>
    <div class="chips" style="margin-top:18px">${GOALS.map(g => `<button class="chip ${p.goals.includes(g[0]) ? 'on' : ''}" data-a="obGoal" data-id="${g[0]}" aria-pressed="${p.goals.includes(g[0])}">${g[1]}</button>`).join('')}</div>
    <div style="margin-top:22px"><label class="f" for="obWhy">In your own words, what would feeling better look like?</label><textarea id="obWhy" placeholder="Optional. Something like: keep up with the kids without stopping to catch my breath.">${esc(p.why)}</textarea></div>`;
  if (s === 2) body = `<h1>Anything you don't eat?</h1><p class="muted" style="margin-top:8px">Tap what to leave out and meal ideas will skip it.</p>
    <div class="chips" style="margin-top:18px">${SKIP_GROUPS.map(g => `<button class="chip ${p.skip.includes(g[0]) ? 'on' : ''}" data-a="obSkip" data-id="${g[0]}" aria-pressed="${p.skip.includes(g[0])}">${g[1]}</button>`).join('')}</div>
    <div class="card" style="margin-top:22px"><h3>Good to know, only if it applies</h3><p class="small muted" style="margin-top:4px">These just adjust the tips you see. Skip them if you'd rather not say.</p>
    <div class="list" style="margin-top:6px">${[['fluid', 'My doctor has set a limit on how much I drink'], ['kidney', 'I have a kidney condition'], ['preg', 'I\'m pregnant or breastfeeding'], ['knee', 'My knees bother me or I have an injury']].map(f => `<button data-a="obFlag" data-id="${f[0]}" style="width:100%;text-align:left"><span class="check ${p.flags[f[0]] ? 'on' : ''}">✓</span><span class="grow small">${f[1]}</span></button>`).join('')}</div></div>`;
  if (s === 3) {
    const lb = parseFloat(p.weight), rng = lb > 60 && !p.flags.kidney ? suggestProtein(lb) : null;
    body = `<h1>Set your daily targets</h1><p class="muted" style="margin-top:8px">Starting points, not rules. Pick numbers that feel doable; you can raise them later.</p>
    <div class="card" style="margin-top:18px"><label class="f" for="ob_protein">Protein each day (grams)</label><input id="ob_protein" type="number" inputmode="numeric" min="20" max="250" value="${p.protein}">
      ${p.flags.kidney ? '<p class="note" style="margin-top:10px">With a kidney condition, protein needs are individual. Use the number your doctor or dietitian gives you.</p>' :
      `<p class="small muted" style="margin-top:8px">${rng ? `For your weight, a range often used for active women in midlife works out to about <b>${rng[0]}–${rng[1]} g</b>. Anywhere in there is fine.` : 'Around 25–35 g per meal, roughly 90–120 g a day, is a common place to start.'}</p>
      <div class="row" style="margin-top:10px"><input id="obWeight" type="number" inputmode="decimal" placeholder="Weight in lb (optional)" value="${esc(p.weight)}" aria-label="Weight in pounds, optional"><button class="btn sm ghost" data-a="obCalc">Suggest</button></div>`}</div>
    <div class="card"><label class="f" for="ob_water">Water each day (ounces)</label><input id="ob_water" type="number" inputmode="numeric" min="8" max="200" value="${p.water}">
      <p class="small muted" style="margin-top:8px">${p.flags.fluid ? 'Use the limit your doctor gave you. Reminders will never push you past it.' : '64 oz (eight glasses) is a simple starting goal. Coffee, tea and food count toward your body\'s total too.'}</p></div>
    <div class="card"><label class="f" for="ob_move">Movement each week (minutes)</label><input id="ob_move" type="number" inputmode="numeric" min="10" max="900" value="${p.move}">
      <p class="small muted" style="margin-top:8px">The long-term guideline for adults is 150 minutes a week. Starting at 60–90 and building up is a fine plan.</p></div>`;
  }
  if (s === 4) body = `<h1>Reminders</h1><p class="muted" style="margin-top:8px">Gentle nudges, never guilt. Turn on the ones you want; you can change the times in Settings.</p>
    <div class="card" style="margin-top:18px"><div class="list">${S.rem.items.map(r => `<button data-a="remToggle" data-id="${r.id}" style="width:100%;text-align:left"><span class="check ${r.on ? 'on' : ''}">✓</span><span class="grow">${esc(r.label)}</span><span class="muted small">${fmtTime(r.time)}</span></button>`).join('')}</div></div>
    <p class="small muted" style="margin-top:12px">After this, Settings will show you how to put these on your phone's calendar so they buzz even when the app is closed.</p>`;
  $('#app').innerHTML = `<div class="ob">${dots}<div style="margin-top:20px">${body}</div>
    <div class="foot row">${s > 0 ? '<button class="btn ghost" data-a="obBack">Back</button>' : ''}<button class="btn grow" data-a="obNext">${s === n - 1 ? 'Start' : 'Continue'}</button></div></div>`;
  $('#tabs').hidden = true;
}
function fmtTime(t) { const [h, m] = t.split(':').map(Number); return ((h + 11) % 12 + 1) + ':' + pad(m) + (h < 12 ? ' am' : ' pm'); }

/* ---------- food helpers ---------- */
const allowedIng = id => !ING[id] || !ING[id][2].some(g => P().skip.includes(g));
const allowedRecipe = r => r.ing.every(allowedIng);
const have = r => r.ing.filter(i => S.pantry[i]).length;
const recipe = id => RECIPES.find(r => r.id === id);
const MEALS = { b: 'Breakfast', l: 'Lunch', d: 'Dinner', s: 'Snack' };
function addProtein(g, label) { day().p.push({ g: Math.round(g), l: label || '' }); save(); }
function groceryNeed() { // ingredient id -> recipes that need it (not already in the kitchen)
  const need = {};
  S.plan.forEach(id => { const r = recipe(id); if (r) r.ing.forEach(i => { if (!S.pantry[i]) (need[i] = need[i] || []).push(r.n); }); });
  return need;
}

/* ---------- TODAY ---------- */
function suggestRoutine() {
  const e = day().energy;
  if (e && e <= 2) return ROUTINES.find(r => r.id === 'm1');
  const done = sum(Object.keys(S.days), k => S.days[k].m.filter(x => x.id === 'm3').length);
  if (e >= 4) return ROUTINES.find(r => r.id === (done >= 8 ? 'm4' : 'm3'));
  return ROUTINES.find(r => r.id === (done >= 3 ? 'm3' : 'm2'));
}
const mins = r => Math.round(sum(r.steps, s => s[1]) / 60);
function ring(val, goal, color) {
  const r = 48, c = 2 * Math.PI * r, f = Math.min(1, goal ? val / goal : 0);
  return `<div class="ringwrap"><svg width="112" height="112" viewBox="0 0 112 112"><circle cx="56" cy="56" r="${r}" fill="none" stroke="var(--line)" stroke-width="11"/><circle cx="56" cy="56" r="${r}" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - f)}"/></svg><div class="mid"><div class="big">${val}</div><div class="tiny muted">of ${goal} g</div></div></div>`;
}
function renderToday() {
  const p = P(), d = day(), pr = sumP(d), wa = sumW(d), wk = weekMove(), h = new Date().getHours();
  const hi = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const sug = suggestRoutine(), todayM = sumM(d);
  const supList = S.supps;
  const E = ['Drained', 'Low', 'Okay', 'Good', 'Great'];
  return `<header class="row between"><div><div class="eyebrow">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div><h1 style="margin-top:4px">${hi}${p.name ? ', ' + esc(p.name) : ''}</h1></div>
    <button data-a="settings" aria-label="Settings" title="Settings">${COW(54)}</button></header>
  ${p.why ? `<p class="muted small" style="margin-top:8px;font-style:italic">"${esc(p.why)}"</p>` : ''}

  <div class="card" style="margin-top:16px"><div class="row between"><h2>How's your energy?</h2>${d.energy ? '<span class="badge plum">noted</span>' : ''}</div>
    <div class="energy" style="margin-top:10px" role="group" aria-label="Energy today">${E.map((t, i) => `<button class="${d.energy === i + 1 ? 'on' : ''}" data-a="energy" data-v="${i + 1}" aria-pressed="${d.energy === i + 1}">${t}</button>`).join('')}</div></div>

  <div class="card"><div class="row between"><h2>Protein</h2><button class="linkbtn small" data-a="logMeal">Log a meal</button></div>
    <div class="row" style="margin-top:12px;gap:16px">${ring(pr, p.protein, 'var(--rose)')}
      <div class="grow"><p class="small muted">${pr >= p.protein ? 'Goal met. Nicely done.' : pr === 0 ? 'Tap what you\'ve had. A rough guess is good enough.' : (p.protein - pr) + ' g to go. A snack or one more meal gets you there.'}</p>
      <div class="row" style="margin-top:10px;gap:8px">${[10, 20, 30].map(g => `<button class="quick p" data-a="addP" data-g="${g}">+${g}</button>`).join('')}</div></div></div>
    ${d.p.length ? `<div class="chips" style="margin-top:12px">${d.p.map((x, i) => `<button class="chip" data-a="delP" data-i="${i}" aria-label="Remove ${x.g} grams">${esc(x.l || 'Protein')} · ${x.g}g ✕</button>`).join('')}</div>` : ''}</div>

  <div class="card"><div class="row between"><h2>Water</h2>${d.w.length ? '<button class="linkbtn small" data-a="undoW">Undo last</button>' : ''}</div>
    <div class="row" style="margin-top:12px;gap:16px"><div class="bottle" aria-hidden="true"><i style="height:${pct(wa, p.water)}%"></i></div>
      <div class="grow"><div><span class="big">${wa}</span> <span class="muted">of ${p.water} oz</span></div>
      <p class="small muted" style="margin-top:4px">${wa >= p.water ? 'You hit your water goal.' : p.flags.fluid ? 'Stay within the limit your doctor set.' : 'Sip through the day. No need to catch up all at once.'}</p>
      <div class="row" style="margin-top:10px;gap:8px">${[8, 16, 24].map(o => `<button class="quick w" data-a="addW" data-o="${o}">+${o} oz</button>`).join('')}</div></div></div></div>

  <div class="card"><div class="row between"><h2>Move</h2><span class="badge sage">${wk} of ${p.move} min this week</span></div>
    <div class="bar" style="margin-top:10px"><i style="width:${pct(wk, p.move)}%"></i></div>
    ${todayM ? `<p class="small" style="margin-top:10px">${todayM} minutes today. ${d.m.map(x => esc(x.n)).join(', ')}.</p>` : ''}
    <div class="note sage" style="margin-top:12px"><div class="eyebrow">${todayM ? 'If you want more' : 'Idea for today'}</div><div class="row between" style="margin-top:4px"><div><b>${esc(sug.n)}</b><div class="small muted">${mins(sug)} min · ${sug.lvl}</div></div><button class="btn sm" data-a="routine" data-id="${sug.id}">Open</button></div></div></div>

  <div class="card"><div class="row between"><h2>Supplements</h2><button class="linkbtn small" data-a="tab" data-t="supps">${supList.length ? 'Manage' : 'Add yours'}</button></div>
    ${supList.length ? `<div class="list" style="margin-top:4px">${supList.map(s => `<button data-a="tookSupp" data-id="${s.id}" style="width:100%;text-align:left" aria-pressed="${!!d.s[s.id]}"><span class="check ${d.s[s.id] ? 'on' : ''}">✓</span><span class="grow"><b>${esc(s.name)}</b>${s.dose ? ' <span class="muted small">' + esc(s.dose) + '</span>' : ''}</span><span class="badge">${esc(s.when)}</span></button>`).join('')}</div>`
      : '<p class="small muted" style="margin-top:8px">Add what you take and check it off here each day.</p>'}</div>

  <div class="card"><h2>One little win</h2><p class="small muted" style="margin-top:4px">Anything you did for yourself today. It doesn't have to be about health.</p>
    <input id="win" style="margin-top:10px" value="${esc(d.win)}" placeholder="Today I…" data-change="win" aria-label="Today's little win">
    <div class="scroller" style="margin-top:10px">${WINS.map(w => `<button class="chip" data-a="winPick" data-w="${esc(w)}">${w}</button>`).join('')}</div></div>

  <div class="card"><div class="row between"><h2>My goals</h2><button class="linkbtn small" data-a="addGoal">Add one</button></div>
    ${S.myGoals.length ? `<div class="list" style="margin-top:4px">${S.myGoals.map(g => `<div><button class="check ${g.done ? 'on' : ''}" data-a="goalDone" data-id="${g.id}" aria-label="Mark done">✓</button><span class="grow" style="${g.done ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(g.text)}</span><button class="x" data-a="goalDel" data-id="${g.id}" aria-label="Remove goal">✕</button></div>`).join('')}</div>`
      : '<p class="small muted" style="margin-top:8px">Write your own, in your words. "Touch my toes by Christmas." "Walk the whole zoo without stopping."</p>'}</div>`;
}

/* ---------- KITCHEN ---------- */
function renderKitchen() {
  const k = S.ui.ktab;
  const seg = `<div class="seg" role="tablist">${[['ideas', 'Meal ideas'], ['fridge', 'My kitchen'], ['plate', 'Build a plate'], ['week', 'This week']].map(t => `<button class="${k === t[0] ? 'on' : ''}" data-a="ktab" data-t="${t[0]}" role="tab" aria-selected="${k === t[0]}">${t[1]}</button>`).join('')}</div>`;
  let body = '';
  if (k === 'ideas') {
    const m = S.ui.meal, pantryN = Object.keys(S.pantry).length;
    let list = RECIPES.filter(allowedRecipe).filter(r => m === 'all' || (m === 'quick' ? r.tags.includes('quick') : m === 'batch' ? r.tags.includes('batch') : r.meal === m));
    if (pantryN) list = list.slice().sort((a, b) => have(b) / b.ing.length - have(a) / a.ing.length);
    body = `<div class="scroller" style="margin-top:14px">${[['all', 'All'], ['b', 'Breakfast'], ['l', 'Lunch'], ['d', 'Dinner'], ['s', 'Snacks'], ['quick', '15 min or less'], ['batch', 'Cook once, eat twice']].map(f => `<button class="chip ${m === f[0] ? 'on' : ''}" data-a="meal" data-m="${f[0]}">${f[1]}</button>`).join('')}</div>
      <p class="small muted" style="margin-top:10px">${pantryN ? 'Sorted by what you already have at home.' : 'Tell the app what\'s in your kitchen and it will sort these by what you can make right now.'}</p>
      <div style="margin-top:12px">${list.map(recipeCard).join('') || '<p class="muted">Nothing matches. Try another filter.</p>'}</div>`;
  }
  if (k === 'fridge') {
    const can = RECIPES.filter(allowedRecipe).map(r => [r, r.ing.length - have(r)]).filter(x => x[1] <= 1 && have(x[0]) > 0).sort((a, b) => a[1] - b[1]).slice(0, 5);
    body = `<p class="small muted" style="margin-top:14px">Tap everything you have on hand right now. Tap again when it runs out.</p>
      ${can.length ? `<div class="card"><h3>You can make</h3><div class="list" style="margin-top:4px">${can.map(x => `<button data-a="recipe" data-id="${x[0].id}" style="width:100%;text-align:left"><span class="grow"><b>${esc(x[0].n)}</b><div class="small muted">${x[1] ? 'Missing ' + esc(ING[x[0].ing.find(i => !S.pantry[i])][0]) : 'You have everything'}</div></span><span class="badge rose">~${x[0].p} g</span></button>`).join('')}</div></div>` : ''}
      ${AISLES.map(a => { const ids = Object.keys(ING).filter(i => ING[i][1] === a && allowedIng(i)); return ids.length ? `<div class="sec eyebrow">${a}</div><div class="chips">${ids.map(i => `<button class="chip ${S.pantry[i] ? 'on' : ''}" data-a="pantry" data-id="${i}" aria-pressed="${!!S.pantry[i]}">${esc(ING[i][0])}</button>`).join('')}</div>` : ''; }).join('')}`;
  }
  if (k === 'plate') {
    const pro = MIX.protein.filter(x => allowedIng(x[2])), sel = S.ui.plate || {}, pp = pro.find(x => x[0] === sel.protein);
    const pick = (key, label, opts) => `<div class="sec eyebrow">${label}</div><div class="chips">${opts.map(o => `<button class="chip ${sel[key] === o ? 'on' : ''}" data-a="plate" data-k="${key}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
    body = `<p class="small muted" style="margin-top:14px">No recipe needed. Pick one from each row and you have a meal.</p>
      ${pick('protein', '1 · Protein (a palm-size portion or about a cup)', pro.map(x => x[0]))}${pick('veg', '2 · Veggies or fruit (fill half the plate)', MIX.veg)}${pick('base', '3 · Base', MIX.base)}${pick('flavor', '4 · Flavor', MIX.flavor)}
      ${pp ? `<div class="card" style="margin-top:18px"><h3>${esc([sel.protein, sel.veg, sel.base && sel.base !== 'No base today' ? sel.base : '', sel.flavor].filter(Boolean).join(' + '))}</h3><p class="small muted" style="margin-top:4px">About ${pp[1]} g of protein from the ${esc(pp[0].toLowerCase())}. An estimate; your portion decides the real number.</p><button class="btn block" style="margin-top:12px" data-a="ate" data-g="${pp[1]}" data-l="${esc(sel.protein + ' plate')}">I ate this · +${pp[1]} g</button></div>` : ''}`;
  }
  if (k === 'week') {
    const need = groceryNeed(), ids = Object.keys(need);
    const batch = S.plan.map(recipe).filter(r => r && r.tags.includes('batch'));
    const rows = AISLES.map(a => {
      const items = ids.filter(i => ING[i][1] === a).map(i => ({ key: i, name: ING[i][0], sub: need[i].length > 1 ? 'for ' + need[i].length + ' meals' : need[i][0] })).concat(a === 'Other' ? S.extra.map(x => ({ key: 'x:' + x, name: x, sub: 'added by you', extra: 1 })) : []);
      return items.length ? `<div class="sec eyebrow">${a}</div><div class="card"><div class="list">${items.map(it => `<div><button class="check ${S.got[it.key] ? 'on' : ''}" data-a="got" data-k="${esc(it.key)}" aria-label="Got ${esc(it.name)}">✓</button><span class="grow" style="${S.got[it.key] ? 'text-decoration:line-through;opacity:.55' : ''}">${esc(it.name)}<div class="tiny muted">${esc(it.sub)}</div></span></div>`).join('')}</div></div>` : '';
    }).join('');
    const nGot = Object.keys(S.got).filter(k2 => S.got[k2]).length;
    body = `<div class="sec row between"><h2>Meals I'm planning</h2><button class="linkbtn small" data-a="ktab" data-t="ideas">Add meals</button></div>
      ${S.plan.length ? `<div class="card"><div class="list">${S.plan.map((id, i) => { const r = recipe(id); return r ? `<div><button class="grow" style="text-align:left" data-a="recipe" data-id="${r.id}"><b>${esc(r.n)}</b><div class="small muted">${MEALS[r.meal]} · ${r.min} min · ~${r.p} g</div></button><button class="x" data-a="unplan" data-i="${i}" aria-label="Remove ${esc(r.n)}">✕</button></div>` : ''; }).join('')}</div></div>` : '<div class="card"><p class="muted small">Nothing planned yet. Open Meal ideas, tap a meal, and choose "Add to this week". Two or three dinners is plenty to start.</p></div>'}
      ${batch.length ? `<div class="note" style="margin-top:14px"><b>Prep tip.</b> ${esc(batch[0].n)} makes extra on purpose. Cook it once and tomorrow's lunch is handled. Leftovers keep 3–4 days in the fridge; freeze what you won't use by then.</div>` : ''}
      <div class="sec row between"><h2>Grocery list</h2>${rows ? '<button class="linkbtn small" data-a="shareList">Share / copy</button>' : ''}</div>
      <p class="small muted">Built from your planned meals, minus what's already in your kitchen.</p>
      ${rows || '<div class="card" style="margin-top:10px"><p class="muted small">Your list is empty.</p></div>'}
      <div class="row" style="margin-top:14px"><input id="extra" placeholder="Add anything else" aria-label="Add an item"><button class="btn" data-a="addExtra">Add</button></div>
      ${nGot ? `<button class="btn block soft" style="margin-top:12px" data-a="putAway">Put ${nGot} checked item${nGot > 1 ? 's' : ''} in my kitchen</button>` : ''}`;
  }
  return `<h1>Kitchen</h1><p class="muted" style="margin-top:6px">Protein first, lots of variety, nothing off-limits.</p><div style="margin-top:14px">${seg}</div>${body}`;
}
function recipeCard(r) {
  const h = have(r), planned = S.plan.includes(r.id);
  return `<button class="card" data-a="recipe" data-id="${r.id}" style="display:block;width:100%;text-align:left;margin-top:10px"><div class="row between"><h3>${esc(r.n)}</h3><span class="badge rose">~${r.p} g</span></div>
    <div class="row wrap small muted" style="margin-top:6px;gap:6px 12px"><span>${MEALS[r.meal]}</span><span>${r.min} min</span>${r.tags.includes('batch') ? '<span>makes extra</span>' : ''}${r.tags.includes('family') ? '<span>family-style</span>' : ''}${Object.keys(S.pantry).length ? `<span>have ${h} of ${r.ing.length}</span>` : ''}${planned ? '<span class="badge sage">planned</span>' : ''}</div></button>`;
}
function recipeSheet(id) {
  const r = recipe(id); if (!r) return;
  const missing = r.ing.filter(i => !S.pantry[i]);
  sheet(`<div class="row between"><h2>${esc(r.n)}</h2><button class="x" data-a="close" aria-label="Close">✕</button></div>
    <div class="row wrap" style="margin-top:8px;gap:6px"><span class="badge rose">about ${r.p} g protein</span><span class="badge">${r.min} min</span><span class="badge sage">${MEALS[r.meal]}</span></div>
    <div class="sec eyebrow">What you need</div><div class="chips">${r.ing.map(i => `<span class="chip ${S.pantry[i] ? 'on' : ''}">${S.pantry[i] ? '✓ ' : ''}${esc(ING[i][0])}</span>`).join('')}</div>
    <p class="tiny muted" style="margin-top:8px">Plus basics like oil, salt and pepper.${missing.length && Object.keys(S.pantry).length ? ' Green means it\'s in your kitchen.' : ''}</p>
    <div class="sec eyebrow">How</div><ol class="how">${r.how.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
    <p class="tiny muted" style="margin-top:12px">Protein is an estimate per serving. Brands, swaps and portion size change it.</p>
    <div class="stack" style="margin-top:16px"><button class="btn block" data-a="ate" data-g="${r.p}" data-l="${esc(r.n)}">I ate this · +${r.p} g</button>
    <button class="btn block ghost" data-a="plan" data-id="${r.id}">${S.plan.includes(r.id) ? 'Remove from this week' : 'Add to this week'}</button></div>`);
}

/* ---------- MOVE ---------- */
const KIND = { bounce: ['Rebounder', 'sage'], stretch: ['Stretch', 'plum'], breath: ['Breathing', 'water'] };
function renderMove() {
  const wk = weekMove(), p = P();
  const card = r => `<button class="card" data-a="routine" data-id="${r.id}" style="display:block;width:100%;text-align:left;margin-top:10px"><div class="row between"><h3>${esc(r.n)}</h3><span class="badge ${KIND[r.kind][1]}">${mins(r)} min</span></div><p class="small muted" style="margin-top:4px">${esc(r.blurb)}</p></button>`;
  const grp = (k, t) => `<div class="sec"><h2>${t}</h2></div>${ROUTINES.filter(r => r.kind === k).map(card).join('')}`;
  return `<h1>Move</h1><p class="muted" style="margin-top:6px">Short sessions that build your breath and loosen you up. Some is always better than none.</p>
    <div class="card" style="margin-top:14px"><div class="row between"><b>This week</b><span>${wk} of ${p.move} min</span></div><div class="bar" style="margin-top:8px"><i style="width:${pct(wk, p.move)}%"></i></div>
      <button class="linkbtn small" style="margin-top:10px" data-a="logMove">Log a walk or other activity</button></div>
    ${p.flags.knee || p.flags.preg ? `<div class="note" style="margin-top:14px">${p.flags.knee ? 'Since your knees are bothering you, check with your doctor or a physical therapist before bouncing, start with <b>First bounce</b>, and stop if anything hurts.' : 'While pregnant or recently postpartum, check with your doctor before rebounding. The stretch and breathing sessions are a gentler place to start.'}</div>` : ''}
    ${grp('bounce', 'On the rebounder')}
    <div class="card"><h3>How to tell it's working</h3><p class="small muted" style="margin-top:4px">Use the talk test. During the hard parts you should be breathing harder but still able to say a short sentence. If the same routine feels easier in a few weeks, your cardio is improving. That's the cue to move up.</p></div>
    ${grp('stretch', 'Stretch & flexibility')}${grp('breath', 'Calm down')}
    <div class="sec"><h2>The six basic moves</h2></div><div class="card">${MOVES.map(m => `<details><summary>${esc(m[0])}</summary><p class="small" style="margin-top:6px">${esc(m[1])}</p><p class="small muted" style="margin-top:4px">${esc(m[2])}</p></details>`).join('')}</div>
    <div class="sec"><h2>Rules that protect your knees</h2></div><div class="card small stack"><p><b>Soft knees, always.</b> Never lock them straight at the top of a bounce.</p><p><b>Push down, don't jump up.</b> Press into the mat. Height isn't the goal.</p><p><b>Use the handlebar</b> if your rebounder has one, especially at first.</p><p><b>Bare feet or grip socks</b> on the mat; supportive indoor shoes if your arches need them.</p><p><b>Clear space, level floor,</b> and a glass of water before you start.</p></div>
    <div class="sec"><h2>Follow-along videos</h2></div><div class="card"><p class="small muted">Free YouTube channels with beginner-friendly rebounder classes. Opens YouTube.</p><div class="list" style="margin-top:4px">${VIDEOS.map(v => `<a href="https://www.youtube.com/results?search_query=${encodeURIComponent(v[2])}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><span class="grow"><b>${esc(v[0])}</b><div class="small muted">${esc(v[1])}</div></span><span class="muted">↗</span></a>`).join('')}</div></div>
    <div class="sec"><h2>When to stop</h2></div><div class="card small stack"><p>Stop and rest if you feel sharp pain, dizziness, chest discomfort, or unsteady on your feet.</p><p>Call your doctor about knee pain that is severe, comes with swelling, locking or giving way, or doesn't improve in a couple of weeks. Leaking or a heavy feeling in the pelvis during bouncing is common and treatable; a pelvic-floor physical therapist can help.</p></div>`;
}
function routineSheet(id) {
  const r = ROUTINES.find(x => x.id === id); if (!r) return;
  const steps = r.kind === 'breath' ? [['In for 4, out for 6', 240]] : r.steps;
  sheet(`<div class="row between"><h2>${esc(r.n)}</h2><button class="x" data-a="close" aria-label="Close">✕</button></div>
    <div class="row wrap" style="margin-top:8px;gap:6px"><span class="badge ${KIND[r.kind][1]}">${KIND[r.kind][0]}</span><span class="badge">${mins(r)} min</span><span class="badge">${r.lvl}</span></div>
    <p class="muted" style="margin-top:10px">${esc(r.blurb)}</p>
    ${r.kind === 'bounce' ? '<p class="note sage" style="margin-top:12px">Before you step on: drink a little water, clear the space, and put your phone where you can hear it.</p>' : ''}
    <div class="sec eyebrow">What you'll do</div><div class="list small">${steps.map(s => `<div><span class="grow">${esc(s[0])}</span><span class="muted">${s[1] >= 60 ? Math.floor(s[1] / 60) + ':' + pad(s[1] % 60) : s[1] + 's'}</span></div>`).join('')}</div>
    <button class="row small" style="margin-top:12px" data-a="voice" aria-pressed="${S.ui.voice}"><span class="check ${S.ui.voice ? 'on' : ''}">✓</span>Read each step out loud</button>
    <button class="btn block" style="margin-top:16px" data-a="start" data-id="${r.id}">Start</button>`);
}

/* ---------- interval player ---------- */
let PL = null, audio = null, wake = null;
function beep(freq, ms) { try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); const o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = freq; o.connect(g); g.connect(audio.destination); g.gain.setValueAtTime(.18, audio.currentTime); g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + ms / 1000); o.start(); o.stop(audio.currentTime + ms / 1000); } catch (e) {} }
function say(t) { if (!S.ui.voice || !window.speechSynthesis) return; try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.rate = .95; speechSynthesis.speak(u); } catch (e) {} }
function startPlayer(id) {
  const r = ROUTINES.find(x => x.id === id); closeSheet(); const tt = $('.toast'); if (tt) tt.remove();
  PL = { r, i: 0, left: r.steps[0][1], paused: false, last: Date.now(), elapsed: 0, lastBeep: -1 };
  try { navigator.wakeLock && navigator.wakeLock.request('screen').then(w => wake = w).catch(() => {}); } catch (e) {}
  beep(660, 200); say(r.steps[0][0] + '. ' + r.steps[0][2]);
  PL.t = setInterval(tick, 200); drawPlayer();
}
function tick() {
  if (!PL) return; const now = Date.now(), dt = (now - PL.last) / 1000; PL.last = now;
  if (PL.paused) return;
  PL.left -= dt; PL.elapsed += dt;
  const sec = Math.ceil(PL.left);
  if (sec <= 3 && sec >= 1 && sec !== PL.lastBeep && PL.r.kind !== 'breath') { PL.lastBeep = sec; beep(520, 120); }
  if (PL.left <= 0) return nextStep();
  const c = $('#clock'); if (c && c.textContent !== fmtClock(sec)) { c.textContent = fmtClock(sec); const b = $('#pbar'); if (b) b.style.width = pct(PL.elapsed, sum(PL.r.steps, s => s[1])) + '%'; }
}
const fmtClock = s => s >= 60 ? Math.floor(s / 60) + ':' + pad(s % 60) : String(s);
function nextStep() {
  PL.i++; PL.lastBeep = -1;
  if (PL.i >= PL.r.steps.length) return finishPlayer(true);
  const st = PL.r.steps[PL.i]; PL.left = st[1]; beep(PL.r.kind === 'breath' ? 440 : 780, 220); say(PL.r.kind === 'breath' ? st[0] : st[0] + '. ' + st[2]); drawPlayer();
}
function drawPlayer() {
  const st = PL.r.steps[PL.i], nx = PL.r.steps[PL.i + 1];
  $('#overlay').innerHTML = `<div class="player" role="dialog" aria-modal="true" aria-label="${esc(PL.r.n)}"><div class="row between"><div><div class="eyebrow">${esc(PL.r.n)}</div><div class="small muted">Step ${PL.i + 1} of ${PL.r.steps.length}</div></div><button class="btn sm ghost" data-a="endEarly">End</button></div>
    <div class="bar" style="margin-top:12px"><i id="pbar" style="width:${pct(PL.elapsed, sum(PL.r.steps, s => s[1]))}%"></i></div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:18px"><div class="stepname">${esc(st[0])}</div><div class="clock" id="clock" aria-live="off">${fmtClock(Math.ceil(PL.left))}</div><p style="text-align:center;font-size:18px" class="muted">${esc(st[2])}</p></div>
    <p class="small muted" style="text-align:center;min-height:22px">${nx ? 'Next: ' + esc(nx[0]) : 'Last one'}</p>
    <div class="row" style="margin-top:12px"><button class="btn ghost grow" data-a="pause">${PL.paused ? 'Resume' : 'Pause'}</button><button class="btn ghost grow" data-a="skip">Skip</button></div></div>`;
}
function finishPlayer(done) {
  const elapsedSec = PL.elapsed, m = Math.max(1, Math.round(PL.elapsed / 60)), r = PL.r; clearInterval(PL.t); PL = null;
  try { wake && wake.release(); } catch (e) {} try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
  if (!done && elapsedSec < 45) { closeSheet(); return render(); }
  day().m.push({ min: m, n: r.n, id: r.id }); save(); if (done) { beep(880, 400); say('All done. Nice work.'); }
  $('#overlay').innerHTML = '';
  sheet(`<div style="text-align:center">${COW(72)}<h2 style="margin-top:8px">${done ? 'Done. ' : ''}${m} minute${m > 1 ? 's' : ''} logged</h2><p class="muted" style="margin-top:6px">${r.kind === 'bounce' ? 'Have some water. A few stretches now will help your knees and hips.' : 'That was time well spent.'}</p></div>
    <div class="sec eyebrow">How did it feel?</div><div class="chips">${['Felt good', 'Knee or joint pain', 'Dizzy or unsteady', 'Leaking or pelvic heaviness', 'Just tired'].map((t, i) => `<button class="chip" data-a="feel" data-i="${i}">${t}</button>`).join('')}</div>
    <div class="stack" style="margin-top:18px">${r.kind === 'bounce' ? '<button class="btn block soft" data-a="start" data-id="m5">Do the 5-minute cool-down</button>' : ''}<button class="btn block" data-a="close">Finish</button></div>`);
  render();
}
const FEEL = ['Good. Remember this one for next time.', 'Ease off for a day or two and go back to the gentlest routine. If it keeps hurting, swells, or the knee locks or gives way, have a doctor look at it.',
  'Sit down and sip some water. Use the handlebar next time and keep your feet on the mat. If dizziness keeps happening, tell your doctor.',
  'That\'s common and very treatable. Keep bounces low with feet on the mat, and consider asking about pelvic-floor physical therapy.', 'Tired is fine. Rest counts too. Try the gentler version next time, or just stretch.'];

/* ---------- SUPPLEMENTS ---------- */
const WHEN = ['morning', 'midday', 'evening', 'bedtime'];
function renderSupps() {
  const d = day();
  return `<h1>Supplements</h1><p class="muted" style="margin-top:6px">Keep track of what you take and when, and learn what each one is actually for.</p>
    <div class="note" style="margin-top:14px">This is general information, not medical advice. Before starting anything new, run it by your doctor or pharmacist, especially if you take prescription medication.</div>
    <div class="sec row between"><h2>What I take</h2><button class="btn sm" data-a="suppForm">Add</button></div>
    ${S.supps.length ? WHEN.map(w => { const l = S.supps.filter(s => s.when === w); return l.length ? `<div class="card"><div class="eyebrow">${w}</div><div class="list" style="margin-top:2px">${l.map(s => `<div><button class="check ${d.s[s.id] ? 'on' : ''}" data-a="tookSupp" data-id="${s.id}" aria-label="Took ${esc(s.name)}" aria-pressed="${!!d.s[s.id]}">✓</button><button class="grow" style="text-align:left" data-a="suppForm" data-id="${s.id}"><b>${esc(s.name)}</b><div class="small muted">${esc([s.dose, s.food ? 'with food' : '', s.notes].filter(Boolean).join(' · ')) || 'Tap to edit'}</div></button><span class="tiny muted">${taken7(s.id)}/7 days</span></div>`).join('')}</div></div>` : ''; }).join('')
      : '<div class="card"><p class="muted small">Nothing here yet. Add what you already take, or browse the guide below and add from there.</p></div>'}
    <div class="sec"><h2>Guide: what women often ask about</h2></div>
    <div class="card">${SUPP_GUIDE.map((g, i) => `<details><summary>${esc(g.n)}</summary><div class="small gap8" style="margin-top:8px"><p>${esc(g.what)}</p><p><b>Typical amounts.</b> ${esc(g.typical)}</p><p class="muted">${esc(g.note)}</p><button class="btn sm soft" data-a="suppFromGuide" data-i="${i}">Add to my list</button></div></details>`).join('')}</div>
    <p class="tiny muted" style="margin-top:12px">Amounts follow NIH Office of Dietary Supplements fact sheets. Supplements are not tested by the FDA before sale, so choose brands with third-party seals (USP, NSF).</p>`;
}
const taken7 = id => lastDays(7).filter(d => peek(dkey(d)).s[id]).length;
function suppForm(id, preset) {
  const s = S.supps.find(x => x.id === id) || preset || { name: '', dose: '', when: 'morning', food: false, notes: '' };
  sheet(`<div class="row between"><h2>${id ? 'Edit' : 'Add a supplement'}</h2><button class="x" data-a="close" aria-label="Close">✕</button></div>
    <div class="stack" style="margin-top:12px"><div><label class="f" for="sName">Name</label><input id="sName" value="${esc(s.name)}" placeholder="Vitamin D"></div>
    <div><label class="f" for="sDose">How much</label><input id="sDose" value="${esc(s.dose)}" placeholder="1 capsule, 1,000 IU"></div>
    <div><label class="f" for="sWhen">When</label><select id="sWhen">${WHEN.map(w => `<option ${s.when === w ? 'selected' : ''}>${w}</option>`).join('')}</select></div>
    <label class="row"><input type="checkbox" id="sFood" ${s.food ? 'checked' : ''} style="width:24px;min-height:24px"> Take with food</label>
    <div><label class="f" for="sNotes">Notes</label><input id="sNotes" value="${esc(s.notes)}" placeholder="Optional"></div>
    <button class="btn block" data-a="suppSave" data-id="${id || ''}">Save</button>${id ? `<button class="btn block ghost" data-a="suppDel" data-id="${id}">Remove</button>` : ''}</div>`);
}

/* ---------- PROGRESS ---------- */
function renderProgress() {
  const p = P(), ds = lastDays(7), today = tkey();
  const chart = (fn, goal, color) => { const vals = ds.map(d => fn(peek(dkey(d)))), mx = Math.max(goal, ...vals, 1); return `<div class="days">${ds.map((d, i) => `<div><i style="height:${Math.round(vals[i] / mx * 100)}%;background:${color};opacity:${vals[i] >= goal ? 1 : .55}" title="${vals[i]}"></i><span style="${dkey(d) === today ? 'font-weight:700;color:var(--ink)' : ''}">${d.toLocaleDateString(undefined, { weekday: 'narrow' })}</span></div>`).join('')}</div>`; };
  const showed = lastDays(30).filter(d => { const x = peek(dkey(d)); return x.p.length || x.w.length || x.m.length || Object.keys(x.s).length; }).length;
  const avgP = Math.round(sum(ds, d => sumP(peek(dkey(d)))) / 7), avgW = Math.round(sum(ds, d => sumW(peek(dkey(d)))) / 7), wk = weekMove();
  const wins = Object.keys(S.days).sort().reverse().filter(k => S.days[k].win).slice(0, 6);
  const en = ds.map(d => peek(dkey(d)).energy);
  const W = S.weights.slice().sort((a, b) => a.d < b.d ? -1 : 1), last7 = W.slice(-7), tr = last7.length ? (sum(last7, x => x.v) / last7.length) : 0;
  const wkKey = dkey(ds[0]), ref = S.reflect[wkKey] || '';
  return `<h1>Progress</h1><p class="muted" style="margin-top:6px">A look back, not a report card. Gaps are normal; just pick up where you are.</p>
    <div class="card" style="margin-top:14px"><div class="row" style="gap:14px">${COW(56)}<div><div class="big">${showed} day${showed === 1 ? '' : 's'}</div><div class="small muted">you showed up for yourself in the last 30</div></div></div></div>
    <div class="card"><div class="row between"><h3>Protein</h3><span class="small muted">avg ${avgP} g · goal ${p.protein}</span></div><div style="margin-top:12px">${chart(sumP, p.protein, 'var(--rose)')}</div></div>
    <div class="card"><div class="row between"><h3>Water</h3><span class="small muted">avg ${avgW} oz · goal ${p.water}</span></div><div style="margin-top:12px">${chart(sumW, p.water, 'var(--water)')}</div></div>
    <div class="card"><div class="row between"><h3>Movement</h3><span class="small muted">${wk} of ${p.move} min this week</span></div><div style="margin-top:12px">${chart(sumM, Math.max(5, Math.round(p.move / 5)), 'var(--sage)')}</div></div>
    ${en.some(Boolean) ? `<div class="card"><h3>Energy</h3><div class="days" style="height:70px;margin-top:12px">${ds.map((d, i) => `<div><i style="height:${en[i] * 20}%;background:var(--plum)"></i><span>${d.toLocaleDateString(undefined, { weekday: 'narrow' })}</span></div>`).join('')}</div><p class="tiny muted" style="margin-top:8px">Notice whether better-energy days line up with more water, protein or sleep.</p></div>` : ''}
    <div class="card"><div class="row between"><h3>Weight</h3><button class="linkbtn small" data-a="toggleWeight">${S.showWeight ? 'Hide' : 'Track it'}</button></div>
      ${S.showWeight ? `<p class="small muted" style="margin-top:4px">Optional. Daily weight bounces around from water, salt and hormones, so watch the trend, not the day.</p>
        ${W.length ? `<div class="row" style="margin-top:12px;gap:22px"><div><div class="big">${tr.toFixed(1)}</div><div class="tiny muted">trend (avg of last ${last7.length})</div></div>${W.length > 1 ? `<div><div class="big">${(tr - W[0].v > 0 ? '+' : '') + (tr - W[0].v).toFixed(1)}</div><div class="tiny muted">since ${new Date(W[0].d + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div></div>` : ''}</div>
        <div class="chips" style="margin-top:12px">${W.slice(-6).map(x => `<button class="chip" data-a="delWeight" data-d="${x.d}" aria-label="Remove weigh-in">${new Date(x.d + 'T12:00').toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })} · ${x.v} ✕</button>`).join('')}</div>` : ''}
        <div class="row" style="margin-top:12px"><input id="wIn" type="number" inputmode="decimal" placeholder="Today's weight (lb)" aria-label="Today's weight in pounds"><button class="btn" data-a="addWeight">Save</button></div>`
        : '<p class="small muted" style="margin-top:4px">Off by default. The scale is one measure; your breath, energy and how your clothes fit are others.</p>'}</div>
    ${wins.length ? `<div class="card"><h3>Little wins</h3><div class="list small" style="margin-top:4px">${wins.map(k => `<div><span class="muted" style="width:54px;flex:none">${new Date(k + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><span class="grow">${esc(S.days[k].win)}</span></div>`).join('')}</div></div>` : ''}
    <div class="card"><h3>This week's reflection</h3><p class="small muted" style="margin-top:4px">What saved time? What felt good? What would you change?</p><textarea id="reflect" style="margin-top:10px" data-change="reflect" data-k="${wkKey}" placeholder="A sentence or two is plenty.">${esc(ref)}</textarea></div>`;
}

/* ---------- SETTINGS ---------- */
function settingsSheet() {
  const p = P(), notif = 'Notification' in window ? Notification.permission : 'unsupported';
  sheet(`<div class="row between"><h2>Settings</h2><button class="x" data-a="close" aria-label="Close">✕</button></div>
    <div class="sec eyebrow">Me</div><div class="stack">
      <div><label class="f" for="setName">Name</label><input id="setName" value="${esc(p.name)}"></div>
      <div><label class="f" for="setWhy">What feeling better looks like</label><textarea id="setWhy">${esc(p.why)}</textarea></div>
      <div class="row"><div class="grow"><label class="f" for="setP">Protein (g)</label><input id="setP" type="number" inputmode="numeric" value="${p.protein}"></div><div class="grow"><label class="f" for="setW">Water (oz)</label><input id="setW" type="number" inputmode="numeric" value="${p.water}"></div><div class="grow"><label class="f" for="setM">Move (min/wk)</label><input id="setM" type="number" inputmode="numeric" value="${p.move}"></div></div>
      <div><label class="f">Foods I skip</label><div class="chips">${SKIP_GROUPS.map(g => `<button class="chip ${p.skip.includes(g[0]) ? 'on' : ''}" data-a="setSkip" data-id="${g[0]}">${g[1]}</button>`).join('')}</div></div>
      <button class="btn block" data-a="setSave">Save</button></div>
    <div class="sec eyebrow">Reminders</div>
    <div class="list">${S.rem.items.map(r => `<div><button class="check ${r.on ? 'on' : ''}" data-a="remToggle" data-id="${r.id}" data-s="1" aria-label="Toggle ${esc(r.label)}">✓</button><span class="grow small">${esc(r.label)}</span><input type="time" value="${r.time}" data-change="remTime" data-id="${r.id}" style="width:128px" aria-label="Time for ${esc(r.label)}"></div>`).join('')}</div>
    <div class="stack" style="margin-top:12px"><button class="btn block" data-a="ics">Add reminders to my phone's calendar</button>
      <p class="tiny muted">Most reliable. Downloads a calendar file; open it and your phone will alert you at these times every day, even when this app is closed.</p>
      <button class="btn block ghost" data-a="notif">${notif === 'granted' ? 'Pop-up reminders are on' : 'Also show pop-ups while the app is open'}</button>
      ${notif === 'denied' ? '<p class="tiny muted">Notifications are blocked for this site in your browser settings.</p>' : ''}</div>
    <div class="sec eyebrow">Put it on your home screen</div><p class="small muted">iPhone: open in Safari, tap Share, then "Add to Home Screen". Android: open in Chrome, tap ⋮, then "Add to Home screen". It opens like an app and works without internet.</p>
    <div class="sec eyebrow">My data</div><p class="small muted">Everything lives on this phone only. Back it up now and then so a new phone doesn't mean starting over.</p>
    <div class="stack" style="margin-top:10px"><button class="btn block ghost" data-a="export">Save a backup file</button><label class="btn block ghost" style="cursor:pointer">Restore from a backup<input type="file" id="importFile" accept="application/json,.json" hidden></label><button class="btn block ghost" data-a="reset" style="color:var(--rose)">Erase everything</button></div>
    <p class="tiny muted" style="margin-top:18px">Bounce Back shares general wellness information and is not medical advice. Talk with your doctor before changing your diet, starting supplements, or beginning a new exercise routine. Sources: CDC activity guidelines, NIH Office of Dietary Supplements, NIDDK, USDA food safety.</p>`);
}
function makeICS() {
  const on = S.rem.items.filter(r => r.on), d = new Date(), ymd = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  const ev = on.map(r => { const t = r.time.replace(':', '') + '00'; return ['BEGIN:VEVENT', 'UID:' + r.id + '-' + ymd + '@bounceback', 'DTSTAMP:' + ymd + 'T000000', 'DTSTART:' + ymd + 'T' + t, 'DURATION:PT5M', 'RRULE:FREQ=DAILY', 'SUMMARY:' + r.label.replace(/[,;\\]/g, ' '), 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + r.label.replace(/[,;\\]/g, ' '), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT'].join('\r\n'); });
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bounce Back//EN', 'CALSCALE:GREGORIAN'].concat(ev, ['END:VCALENDAR']).join('\r\n');
}
function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
function checkReminders() {
  if (!P().done) return; const now = new Date(), cur = pad(now.getHours()) + ':' + pad(now.getMinutes()), d = day(); d.fired = d.fired || {};
  S.rem.items.forEach(r => {
    if (!r.on || d.fired[r.id] || r.time > cur) return;
    const [h, m] = r.time.split(':').map(Number), late = (now.getHours() * 60 + now.getMinutes()) - (h * 60 + m);
    d.fired[r.id] = 1; save(); if (late > 20) return; // missed while closed: stay quiet
    if (r.id[0] === 'w' && (sumW(d) >= P().water)) return;
    toast(r.label);
    try { if ('Notification' in window && Notification.permission === 'granted') { if (navigator.serviceWorker && navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(reg => reg.showNotification('Bounce Back', { body: r.label, icon: 'icon-180.png', tag: r.id })); else new Notification('Bounce Back', { body: r.label }); } } catch (e) {}
  });
}

/* ---------- render ---------- */
function render() {
  if (!P().done) return renderOnboard();
  const t = S.ui.tab, app = $('#app');
  app.innerHTML = t === 'kitchen' ? renderKitchen() : t === 'move' ? renderMove() : t === 'supps' ? renderSupps() : t === 'progress' ? renderProgress() : renderToday();
  const tabs = $('#tabs'); tabs.hidden = false;
  tabs.firstElementChild.innerHTML = TABS.map(x => `<button class="tabbtn ${t === x[0] ? 'on' : ''}" data-a="tab" data-t="${x[0]}" ${t === x[0] ? 'aria-current="page"' : ''}>${ICON[x[0]]}<span>${x[1]}</span></button>`).join('');
}
function toggle(arr, v) { const i = arr.indexOf(v); i < 0 ? arr.push(v) : arr.splice(i, 1); }

const A = {
  obGoal(d) { grab(); toggle(P().goals, d.id); save(); render(); },
  obSkip(d) { toggle(P().skip, d.id); save(); render(); },
  obFlag(d) { P().flags[d.id] = !P().flags[d.id]; save(); render(); },
  obCalc() { grab(); const lb = parseFloat(P().weight); if (lb > 60) { const r = suggestProtein(lb); P().protein = Math.round((r[0] + r[1]) / 10) * 5; } else toast('Enter your weight in pounds first.'); save(); render(); },
  obBack() { grab(); ob.step--; save(); render(); scrollTo(0, 0); },
  obNext() { grab(); if (ob.step >= 4) { P().done = true; S.ui.tab = 'today'; } else ob.step++; save(); render(); scrollTo(0, 0); if (P().done) toast('You\'re all set' + (P().name ? ', ' + P().name : '') + '.'); },
  remToggle(d) { const r = S.rem.items.find(x => x.id === d.id); r.on = !r.on; save(); d.s ? settingsSheet() : render(); },
  tab(d) { S.ui.tab = d.t; save(); render(); scrollTo(0, 0); },
  settings() { settingsSheet(); },
  close() { closeSheet(); },
  closeBg(d, el, e) { if (e.target === el) closeSheet(); },
  energy(d) { day().energy = +d.v; save(); render(); },
  addP(d) { addProtein(+d.g, ''); render(); toast('+' + d.g + ' g protein. ' + cheer()); },
  delP(d) { day().p.splice(+d.i, 1); save(); render(); },
  logMeal() { sheet(`<div class="row between"><h2>Log a meal</h2><button class="x" data-a="close" aria-label="Close">✕</button></div><div class="stack" style="margin-top:12px"><div><label class="f" for="mName">What was it?</label><input id="mName" placeholder="Chicken salad"></div><div><label class="f" for="mG">Protein (grams, your best guess)</label><input id="mG" type="number" inputmode="numeric" placeholder="25"></div><p class="tiny muted">Rough guide: a palm of meat or fish is about 25–30 g, a cup of Greek yogurt 20 g, two eggs 12 g, a cup of beans 15 g.</p><button class="btn block" data-a="mealSave">Add</button></div>`); },
  mealSave() { const g = +$('#mG').value; if (!(g > 0)) return toast('Add a number of grams.'); addProtein(g, $('#mName').value.trim()); closeSheet(); render(); toast(cheer()); },
  addW(d) { day().w.push(+d.o); save(); render(); toast('+' + d.o + ' oz. ' + (sumW(day()) >= P().water ? 'Water goal met!' : cheer())); },
  undoW() { day().w.pop(); save(); render(); },
  tookSupp(d) { const s = day().s; s[d.id] ? delete s[d.id] : s[d.id] = 1; save(); render(); },
  winPick(d) { day().win = d.w; save(); render(); },
  addGoal() { sheet(`<div class="row between"><h2>A goal of my own</h2><button class="x" data-a="close" aria-label="Close">✕</button></div><div class="stack" style="margin-top:12px"><input id="gText" placeholder="In your own words" aria-label="Goal"><button class="btn block" data-a="goalSave">Add</button></div>`); },
  goalSave() { const t = $('#gText').value.trim(); if (!t) return; S.myGoals.push({ id: uid(), text: t, done: false }); save(); closeSheet(); render(); },
  goalDone(d) { const g = S.myGoals.find(x => x.id === d.id); g.done = !g.done; save(); render(); if (g.done) toast('Goal reached. That\'s a big deal.'); },
  goalDel(d) { S.myGoals = S.myGoals.filter(x => x.id !== d.id); save(); render(); },
  ktab(d) { S.ui.ktab = d.t; save(); render(); scrollTo(0, 0); },
  meal(d) { S.ui.meal = d.m; save(); render(); },
  recipe(d) { recipeSheet(d.id); },
  pantry(d) { S.pantry[d.id] ? delete S.pantry[d.id] : S.pantry[d.id] = 1; save(); const y = scrollY; render(); scrollTo(0, y); },
  plate(d) { const pl = S.ui.plate = S.ui.plate || {}; pl[d.k] = pl[d.k] === d.v ? '' : d.v; save(); const y = scrollY; render(); scrollTo(0, y); },
  ate(d) { addProtein(+d.g, d.l); closeSheet(); render(); toast('+' + d.g + ' g protein. ' + cheer()); },
  plan(d) { toggle(S.plan, d.id); save(); closeSheet(); render(); toast(S.plan.includes(d.id) ? 'Added to this week. Check the grocery list.' : 'Removed.'); },
  unplan(d) { S.plan.splice(+d.i, 1); save(); render(); },
  got(d) { S.got[d.k] = !S.got[d.k]; save(); const y = scrollY; render(); scrollTo(0, y); },
  addExtra() { const v = $('#extra').value.trim(); if (!v) return; if (!S.extra.includes(v)) S.extra.push(v); save(); render(); },
  putAway() { Object.keys(S.got).forEach(k => { if (!S.got[k]) return; if (k.startsWith('x:')) S.extra = S.extra.filter(x => 'x:' + x !== k); else S.pantry[k] = 1; }); S.got = {}; save(); render(); toast('Put away. Your kitchen is updated.'); },
  shareList() {
    const need = groceryNeed(), lines = AISLES.map(a => { const it = Object.keys(need).filter(i => ING[i][1] === a).map(i => '- ' + ING[i][0]).concat(a === 'Other' ? S.extra.map(x => '- ' + x) : []); return it.length ? a.toUpperCase() + '\n' + it.join('\n') : ''; }).filter(Boolean).join('\n\n');
    const text = 'Grocery list\n\n' + lines;
    if (navigator.share) navigator.share({ title: 'Grocery list', text }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => toast('List copied.'), () => toast('Couldn\'t copy.')); else toast('Sharing isn\'t available in this browser.');
  },
  routine(d) { routineSheet(d.id); },
  voice() { S.ui.voice = !S.ui.voice; save(); const b = $('[data-a="voice"]'); if (b) { b.setAttribute('aria-pressed', S.ui.voice); b.firstElementChild.classList.toggle('on', S.ui.voice); } },
  start(d) { startPlayer(d.id); },
  pause() { PL.paused = !PL.paused; if (PL.paused && window.speechSynthesis) speechSynthesis.cancel(); drawPlayer(); },
  skip() { nextStep(); },
  endEarly() { finishPlayer(false); },
  feel(d) { toast(FEEL[+d.i]); const dd = day(), last = dd.m[dd.m.length - 1]; if (last) last.feel = +d.i; save(); },
  logMove() { sheet(`<div class="row between"><h2>Log activity</h2><button class="x" data-a="close" aria-label="Close">✕</button></div><div class="stack" style="margin-top:12px"><div><label class="f" for="aName">What did you do?</label><input id="aName" placeholder="Walk, bike, yard work, dancing in the kitchen"></div><div><label class="f" for="aMin">Minutes</label><input id="aMin" type="number" inputmode="numeric" placeholder="20"></div><button class="btn block" data-a="moveSave">Add</button></div>`); },
  moveSave() { const m = +$('#aMin').value; if (!(m > 0)) return toast('Add the minutes.'); day().m.push({ min: Math.round(m), n: $('#aName').value.trim() || 'Activity' }); save(); closeSheet(); render(); toast(cheer()); },
  suppForm(d) { suppForm(d.id); },
  suppFromGuide(d) { const g = SUPP_GUIDE[+d.i]; suppForm('', { name: g.n, dose: '', when: g.when, food: false, notes: '' }); },
  suppSave(d) { const name = $('#sName').value.trim(); if (!name) return toast('Give it a name.'); const o = { name, dose: $('#sDose').value.trim(), when: $('#sWhen').value, food: $('#sFood').checked, notes: $('#sNotes').value.trim() }; const s = S.supps.find(x => x.id === d.id); if (s) Object.assign(s, o); else S.supps.push(Object.assign({ id: uid() }, o)); save(); closeSheet(); render(); toast('Saved.'); },
  suppDel(d) { S.supps = S.supps.filter(x => x.id !== d.id); save(); closeSheet(); render(); },
  toggleWeight() { S.showWeight = !S.showWeight; save(); render(); },
  addWeight() { const v = parseFloat($('#wIn').value); if (!(v > 40 && v < 700)) return toast('Enter a weight in pounds.'); S.weights = S.weights.filter(x => x.d !== tkey()); S.weights.push({ d: tkey(), v: Math.round(v * 10) / 10 }); save(); render(); },
  delWeight(d) { S.weights = S.weights.filter(x => x.d !== d.d); save(); render(); },
  setSkip(d, el) { toggle(P().skip, d.id); save(); el.classList.toggle('on'); },
  setSave() { const p = P(); p.name = $('#setName').value.trim(); p.why = $('#setWhy').value.trim(); [['setP', 'protein'], ['setW', 'water'], ['setM', 'move']].forEach(x => { const v = +$('#' + x[0]).value; if (v > 0) p[x[1]] = Math.round(v); }); save(); closeSheet(); render(); toast('Saved.'); },
  ics() { if (!S.rem.items.some(r => r.on)) return toast('Turn on at least one reminder first.'); download('bounce-back-reminders.ics', makeICS(), 'text/calendar'); toast('Open the downloaded file to add them to your calendar.'); },
  notif() { if (!('Notification' in window)) return toast('This browser doesn\'t support pop-up notifications. Use the calendar option.'); Notification.requestPermission().then(p => { settingsSheet(); toast(p === 'granted' ? 'Pop-ups on.' : 'Not enabled.'); }); },
  export() { download('bounce-back-backup-' + tkey() + '.json', JSON.stringify(S), 'application/json'); },
  reset() { sheet(`<h2>Erase everything?</h2><p class="muted" style="margin-top:8px">This removes all your goals, logs and lists from this phone. It can't be undone.</p><div class="stack" style="margin-top:16px"><button class="btn block" data-a="resetYes">Yes, erase it</button><button class="btn block ghost" data-a="close">Keep my data</button></div>`); },
  resetYes() { localStorage.removeItem(KEY); S = DEF(); ob.step = 0; closeSheet(); render(); }
};
document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (!el) return; const fn = A[el.dataset.a]; if (fn) fn(el.dataset, el, e); });
document.addEventListener('change', e => {
  const el = e.target, c = el.dataset && el.dataset.change;
  if (c === 'win') { day().win = el.value.trim(); save(); }
  if (c === 'reflect') { S.reflect[el.dataset.k] = el.value.trim(); save(); }
  if (c === 'remTime') { const r = S.rem.items.find(x => x.id === el.dataset.id); if (r && el.value) { r.time = el.value; const f = day().fired; if (f) delete f[r.id]; save(); } }
  if (el.id === 'importFile' && el.files[0]) { const fr = new FileReader(); fr.onload = () => { try { const s = JSON.parse(fr.result); if (!s.profile || !s.days) throw 0; localStorage.setItem(KEY, JSON.stringify(s)); S = load(); closeSheet(); render(); toast('Backup restored.'); } catch (x) { toast('That file isn\'t a Bounce Back backup.'); } }; fr.readAsText(el.files[0]); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !PL) closeSheet(); if (e.key === 'Enter' && e.target.id === 'extra') A.addExtra(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) { checkReminders(); if (!PL && !$('#overlay').innerHTML) render(); } });
setInterval(checkReminders, 30000);
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
render(); checkReminders();
window.__bb = { get state() { return S; } };
})();
