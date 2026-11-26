/* Casa pe măsură · motorul cursului (HTML5, SCORM 2004 3rd Ed.)
   Urban Instances V3 · Cetatea citită · Activitatea 5: Arhitectura celor mici
   Atelier: Diana-Andra Lucaciu · E-learning: Gelu-Emanuel Cebzan · LEETUCATION SRL */
(function () {
  'use strict';
  var C = window.COURSE, CFG = window.CFG || {}, VO = C.vo || { screens: {}, clips: {} };
  var KEY = CFG.storageKey || 'UI3_CasaPeMasura_v1';
  var A = window.APP = {};
  A.C = C; A.VO = VO;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mk(s) { return esc(s).replace(/\*([^*]+)\*/g, '<span class="mk">$1</span>'); }
  function plain(s) { return String(s || '').replace(/\*/g, ''); }
  function dc(c, w) { return (c === undefined || c === null) ? '' : ' data-c="' + c + '"' + (w ? ' data-w="' + esc(w) + '"' : ''); }
  A.$ = $; A.$$ = $$; A.esc = esc; A.mk = mk; A.plain = plain; A.dc = dc;
  A.reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- pictograme ---------- */
  var S = function (p, vb) { return '<svg viewBox="' + (vb || '0 0 24 24') + '" aria-hidden="true" focusable="false">' + p + '</svg>'; };
  var st2 = 'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
  A.I = {
    home: S('<path ' + st2 + ' d="M3 11.5L12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20"/>'),
    prev: S('<path ' + st2 + ' stroke-width="3" d="M15 5l-7 7 7 7"/>'),
    next: S('<path ' + st2 + ' stroke-width="3" d="M9 5l7 7-7 7"/>'),
    play: S('<path fill="currentColor" d="M8 5v14l11-7z"/>'),
    pause: S('<path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/>'),
    voice: S('<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9z"/><path ' + st2 + ' d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>'),
    mute: S('<path fill="currentColor" d="M4 9v6h4l5 4V5L8 9z"/><path ' + st2 + ' d="M16.5 9.5l5 5M21.5 9.5l-5 5"/>'),
    replay: S('<path ' + st2 + ' d="M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5"/>'),
    menu: S('<circle cx="5" cy="12" r="2.2" fill="currentColor"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/><circle cx="19" cy="12" r="2.2" fill="currentColor"/>'),
    x: S('<path ' + st2 + ' stroke-width="3" d="M6 6l12 12M18 6L6 18"/>'),
    check: S('<path ' + st2 + ' stroke-width="3.2" d="M5 12.5l4.5 4.5L19 7"/>'),
    star: S('<path fill="#FCC93A" stroke="#1F2433" stroke-width="1.6" stroke-linejoin="round" d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"/>'),
    star0: S('<path fill="#fff" stroke="#1F2433" stroke-width="1.6" stroke-linejoin="round" d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"/>'),
    ear: S('<path ' + st2 + ' d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 6.5a2.5 2.5 0 0 1-5 0M10 9.5a2 2 0 0 1 4 0"/>'),
    tap: S('<path ' + st2 + ' d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10l4.3.9a2 2 0 0 1 1.6 2.3L17 19H10l-3.4-4.2a1.6 1.6 0 0 1 2.4-2.1L9 13M6 4.5L4.5 3M15 4.5L16.5 3"/>'),
    drag: S('<path ' + st2 + ' d="M12 3v18M3 12h18M12 3l-2.5 2.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5"/>'),
    pair: S('<circle cx="8" cy="7.5" r="3" ' + st2 + '/><circle cx="16.5" cy="8.5" r="2.6" ' + st2 + '/><path ' + st2 + ' d="M3 20c0-3.5 2.4-6 5-6s5 2.5 5 6M13 20c.2-2.8 1.6-5 3.5-5s3.5 2 3.5 5"/>'),
    arch: S('<path ' + st2 + ' d="M12 3l-6 17M12 3l6 17M8.5 13h7M12 3v2"/><circle cx="12" cy="5" r="1.6" fill="currentColor"/>'),
    card: S('<rect x="3" y="5" width="18" height="14" rx="2.5" ' + st2 + '/><path ' + st2 + ' d="M7 9h4M7 13h10M7 16h6"/>'),
    plan: S('<path ' + st2 + ' d="M4 20l1.2-4.6L16.8 3.8a2 2 0 0 1 2.9 2.9L8.1 18.3zM14.5 6l3 3"/>'),
    model: S('<path ' + st2 + ' d="M3 11l9-7 9 7M5.5 9v11h13V9M9.5 20v-6h5v6"/>'),
    ruler: S('<path ' + st2 + ' d="M3 15.5L15.5 3 21 8.5 8.5 21zM7 11.5l2 2M10 8.5l2 2M13 5.5l2 2M5.5 14l1.5 1.5"/>'),
    door: S('<path ' + st2 + ' d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M3.5 21h17"/><circle cx="15" cy="12.5" r="1.3" fill="currentColor"/>'),
    window: S('<rect x="4" y="4" width="16" height="16" rx="1.5" ' + st2 + '/><path ' + st2 + ' d="M12 4v16M4 12h16"/>'),
    shutter: S('<rect x="4" y="3" width="7" height="18" rx="1" ' + st2 + '/><rect x="13" y="3" width="7" height="18" rx="1" ' + st2 + '/><path ' + st2 + ' stroke-width="1.8" d="M5.5 7h4M5.5 10h4M5.5 13h4M5.5 16h4M14.5 7h4M14.5 10h4M14.5 13h4M14.5 16h4"/>'),
    tree: S('<circle cx="12" cy="9" r="6" ' + st2 + '/><path ' + st2 + ' d="M12 15v6M8 21h8"/>'),
    updown: S('<path ' + st2 + ' d="M3 12h18M12 3v6M9 6l3-3 3 3M12 21v-6M9 18l3 3 3-3"/>'),
    words: S('<path ' + st2 + ' d="M4 6h16M4 12h10M4 18h13"/>'),
    rooms: S('<rect x="3" y="4" width="18" height="16" rx="1.5" ' + st2 + '/><path ' + st2 + ' d="M3 12h11M14 4v16M8 12v3"/>'),
    shapes: S('<path ' + st2 + ' d="M7 3l4.5 7.5h-9z"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1" ' + st2 + '/><circle cx="7" cy="17" r="4" ' + st2 + '/><path ' + st2 + ' d="M13 21a4 4 0 0 1 8 0z"/>'),
    build: S('<path ' + st2 + ' d="M14.5 6.5l3-3 3 3-3 3M17.5 3.5L9 12M4 20l5-5 2 2-5 5zM3 11l8-7 3 3"/>'),
    sun: S('<circle cx="12" cy="12" r="4.5" fill="#FCC93A" stroke="#1F2433" stroke-width="1.6"/><path fill="none" stroke="#F2A20D" stroke-width="2.2" stroke-linecap="round" d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>'),
    moon: S('<path fill="#FCD66A" stroke="#1F2433" stroke-width="1.6" d="M15.5 3.5a8.5 8.5 0 1 0 5 13.6A7 7 0 0 1 15.5 3.5z"/>'),
    up: S('<path fill="none" stroke="#1F2433" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M12 20V5M6 11l6-6 6 6"/><path fill="none" stroke="#6DB54A" stroke-width="3" d="M3 21.5h18"/>'),
    down: S('<path fill="none" stroke="#6DB54A" stroke-width="3" d="M3 3h18"/><path fill="none" stroke="#1F2433" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M12 6v14M6 14l6 6 6-6"/>'),
    tall: S('<path fill="none" stroke="#1F2433" stroke-width="2.6" stroke-linecap="round" d="M7 21V3M17 21v-7M4 21h16"/><circle cx="7" cy="3.5" r="1.5" fill="#1F2433"/><circle cx="17" cy="14" r="1.5" fill="#1F2433"/>'),
    small: S('<path fill="none" stroke="#1F2433" stroke-width="2.6" stroke-linecap="round" d="M7 21v-6M17 21V6M4 21h16"/><circle cx="7" cy="15" r="1.5" fill="#1F2433"/><circle cx="17" cy="6" r="1.5" fill="#1F2433"/>'),
    rotate: S('<path ' + st2 + ' d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/>'),
    flip: S('<path ' + st2 + ' d="M12 3v18M9 7L4 17h5zM15 7l5 10h-5z"/>'),
    front: S('<rect x="9" y="9" width="11" height="11" rx="1.5" fill="currentColor" opacity=".35"/><rect x="4" y="4" width="11" height="11" rx="1.5" ' + st2 + '/>'),
    back: S('<rect x="4" y="4" width="11" height="11" rx="1.5" fill="currentColor" opacity=".35"/><rect x="9" y="9" width="11" height="11" rx="1.5" ' + st2 + '/>'),
    trash: S('<path ' + st2 + ' d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>'),
    undo: S('<path ' + st2 + ' d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>'),
    redo: S('<path ' + st2 + ' d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3"/>'),
    pen: S('<path ' + st2 + ' d="M4 20l1.2-4.6L16.8 3.8a2 2 0 0 1 2.9 2.9L8.1 18.3zM14.5 6l3 3"/>'),
    dl: S('<path ' + st2 + ' d="M12 3v12M7 10l5 5 5-5M4 20h16"/>'),
    print: S('<path ' + st2 + ' d="M7 8V3h10v5M7 17H4v-8h16v8h-3M7 14h10v7H7z"/>'),
    resize: S('<path ' + st2 + ' stroke-width="2.8" d="M8 20h12V8M20 20L10 10"/>'),
    full: S('<path ' + st2 + ' d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    cc: S('<rect x="2.5" y="5" width="19" height="14" rx="2.5" ' + st2 + '/><path ' + st2 + ' d="M10 10a2.5 2.5 0 1 0 0 4M17 10a2.5 2.5 0 1 0 0 4"/>'),
    book: S('<path ' + st2 + ' d="M4 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4zM20 5h-6a3 3 0 0 0-3 3"/><path ' + st2 + ' d="M20 5v13h-7"/>'),
    exit: S('<path ' + st2 + ' d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>'),
    pdf: S('<path ' + st2 + ' d="M6 3h9l4 4v14H6zM15 3v4h4M9 13h6M9 17h4"/>'),
    flag: S('<path ' + st2 + ' d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
    grip: S('<path ' + st2 + ' d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"/>')
  };
  var I = A.I;

  /* ---------- structura ---------- */
  var START = { id: '0.0', type: 'start' };
  var ORDER = [], ALL = {};
  function reg(s, m, i) { ALL[s.id] = { s: s, m: m, i: i }; ORDER.push(s.id); }
  reg(START, -1, 0); reg(C.about, -1, 1); reg(C.hub, -1, 2);
  C.modules.forEach(function (M, mi) { M.screens.forEach(function (s, i) { reg(s, mi, i); }); });
  reg(C.final, -1, 0);
  ALL[C.adults.id] = { s: C.adults, m: -1, i: 0 };
  A.ALL = ALL; A.ORDER = ORDER; A.MODS = C.modules;
  var MC = { red: ['#F15C50', '#FFD7D2'], teal: ['#22BFAE', '#C9F1EC'], yellow: ['#FCC93A', '#FFF0BF'], green: ['#4FBE83', '#D3F2E0'], violet: ['#A37BF2', '#E6DBFF'], blue: ['#4F8BF3', '#D6E4FF'] };
  A.MC = MC;

  /* ---------- stare ---------- */
  var st = { v: 1, vis: {}, done: {}, q: {}, ex: {}, client: null, house: null, name: '', like: null, loc: null, ix: 0, said: {} };
  var prefs = { cc: false, mute: false };
  A.st = function () { return st; };
  function loadPrefs() { try { var p = JSON.parse(localStorage.getItem(KEY + '_prefs') || '{}'); for (var k in p) prefs[k] = p[k]; } catch (e) {} }
  function savePrefs() { try { localStorage.setItem(KEY + '_prefs', JSON.stringify(prefs)); } catch (e) {} }
  function load() {
    var raw = '';
    if (SCO.ok) raw = SCO.get('cmi.suspend_data');
    else { try { raw = localStorage.getItem(KEY) || ''; } catch (e) {} }
    if (raw) { try { var o = JSON.parse(raw); if (o && o.v === 1) for (var k in o) st[k] = o[k]; } catch (e) {} }
    if (SCO.ok) {
      var n = parseInt(SCO.get('cmi.interactions._count'), 10); if (!isNaN(n)) st.ix = n;
      if (!st.name) { var ln = SCO.get('cmi.learner_name'); if (ln) { var p = ln.split(','); st.name = (p.length > 1 ? p[1] + ' ' + p[0] : ln).trim(); } }
    }
  }
  var saveT = null;
  function save() { clearTimeout(saveT); saveT = setTimeout(saveNow, 350); }
  function saveNow() {
    var raw = JSON.stringify(st);
    if (raw.length > 62000 && st.house && st.house.strokes) { st.house.strokes = st.house.strokes.slice(-60); raw = JSON.stringify(st); }
    if (!SCO.ok) { try { localStorage.setItem(KEY, raw); } catch (e) {} return; }
    SCO.set('cmi.suspend_data', raw);
    if (st.loc) SCO.set('cmi.location', st.loc);
    var seen = ORDER.filter(function (id) { return st.vis[id]; }).length;
    SCO.set('cmi.progress_measure', (Math.round(seen / ORDER.length * 100) / 100).toFixed(2));
    var sc = score();
    if (sc.total > 0) { SCO.set('cmi.score.min', 0); SCO.set('cmi.score.max', sc.total); SCO.set('cmi.score.raw', sc.ok); SCO.set('cmi.score.scaled', (sc.ok / sc.total).toFixed(2)); }
    if (allDone()) SCO.set('cmi.completion_status', 'completed');
    SCO.commit();
  }
  A.save = save; A.saveNow = saveNow;
  function score() {
    var ok = 0, total = 0;
    for (var k in st.q) { (st.q[k] || []).forEach(function (x) { if (x === 0 || x === 1) { total++; if (x === 1) ok++; } }); }
    return { ok: ok, total: total };
  }
  A.score = score;
  function starsCount() { var n = 0; for (var i = 0; i < 6; i++) if (st.done[i]) n++; return n; }
  function allDone() { return starsCount() === 6; }
  A.starsCount = starsCount; A.allDone = allDone;
  function modProgress(mi) { var sc = C.modules[mi].screens, n = 0; sc.forEach(function (s) { if (st.vis[s.id]) n++; }); return n / sc.length; }
  A.modProgress = modProgress;
  /* primul răspuns la un item (scor informativ) */
  A.first = function (sid, idx, ok) {
    var a = st.q[sid] || (st.q[sid] = []);
    if (a[idx] === undefined || a[idx] === null) { a[idx] = ok ? 1 : 0; save(); return true; }
    return false;
  };
  function ident(x) { return String(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9_.:-]+/g, '_').slice(0, 250) || 'x'; }
  A.interaction = function (id, type, resp, result, desc) {
    if (!SCO.ok) return;
    if (type === 'choice') resp = ident(resp);
    else if (type === 'matching') resp = String(resp).split('[.]').map(ident).join('[.]');
    else if (type === 'sequencing') resp = String(resp).split(',').map(ident).join('[,]');
    else if (type === 'performance') type = 'other';
    var n = st.ix++;
    var p = 'cmi.interactions.' + n + '.';
    SCO.set(p + 'id', String(id).replace(/[^A-Za-z0-9_.:-]/g, '_').slice(0, 250));
    SCO.set(p + 'type', type);
    if (desc) SCO.set(p + 'description', String(desc).slice(0, 250));
    if (resp !== undefined && resp !== null) SCO.set(p + 'learner_response', String(resp).slice(0, 4000));
    if (result) SCO.set(p + 'result', result);
    SCO.set(p + 'timestamp', new Date().toISOString().replace(/\.\d+Z$/, ''));
    save();
  };

  /* ---------- sunete (Web Audio, fără fișiere) ---------- */
  var actx = null;
  function ac() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } } if (actx && actx.state === 'suspended') actx.resume(); return actx; }
  function tone(f, t0, d, type, vol, f2) {
    var c = ac(); if (!c || prefs.mute) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, c.currentTime + t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, c.currentTime + t0 + d);
    g.gain.setValueAtTime(0.0001, c.currentTime + t0); g.gain.exponentialRampToValueAtTime(vol || 0.18, c.currentTime + t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + d);
    o.connect(g); g.connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + d + 0.05);
  }
  function knockOne(t0) {
    var c = ac(); if (!c || prefs.mute) return;
    var len = Math.floor(c.sampleRate * 0.09), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    var s = c.createBufferSource(); s.buffer = b; var f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 520; f.Q.value = 2.5;
    var g = c.createGain(); g.gain.value = 1.4; s.connect(f); f.connect(g); g.connect(c.destination); s.start(c.currentTime + t0);
    tone(150, t0, 0.12, 'sine', 0.35, 90);
  }
  A.sfx = function (k) {
    if (prefs.mute) return;
    if (k === 'ok') { tone(660, 0, .14, 'triangle', .16); tone(880, .1, .2, 'triangle', .16); }
    else if (k === 'no') { tone(300, 0, .18, 'sine', .14, 220); }
    else if (k === 'pop') { tone(520, 0, .08, 'sine', .18, 900); }
    else if (k === 'drop') { tone(300, 0, .1, 'sine', .2, 160); }
    else if (k === 'tap') { tone(700, 0, .05, 'sine', .1); }
    else if (k === 'star') { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * .1, .35, 'triangle', .15); }); tone(1568, .45, .5, 'sine', .08); }
    else if (k === 'knock') { knockOne(0); knockOne(.26); knockOne(.52); }
    else if (k === 'whoosh') { tone(200, 0, .4, 'sawtooth', .03, 1200); }
    else if (k === 'snap') { tone(1200, 0, .04, 'square', .05); }
  };

  /* ---------- voce ---------- */
  var narr = new Audio(), fx = new Audio();
  narr.preload = 'auto'; fx.preload = 'auto';
  var gestured = false, raf = 0, shown = -1, curVO = null, curS = null, scrEl = null, narrDone = false, wordQ = [];
  A.unlock = function () { if (gestured) return; gestured = true; ac(); try { narr.play().then(function () { narr.pause(); }).catch(function () {}); } catch (e) {} };
  function sentAt(t) { var c = curVO.cues, i = -1; for (var k = 0; k < c.length; k++) if (t + 0.05 >= c[k]) i = k; return i; }
  function wordTime(ci, w) {
    var s = curS && curVO && (curS.nv || curS.n) && (curS.nv || curS.n)[ci]; if (!s || !curVO.sents || !curVO.sents[ci]) return null;
    var pos = s.toLowerCase().indexOf(String(w).toLowerCase()); if (pos < 0) return null;
    var a = curVO.sents[ci][0], b = curVO.sents[ci][1];
    return a + (b - a) * (pos / Math.max(1, s.length)) - 0.1;
  }
  function revealTo(i, t) {
    if (!scrEl) return;
    for (var k = shown + 1; k <= i; k++) {
      $$('[data-c="' + k + '"]', scrEl).forEach(function (e) {
        if (e.dataset.w) { var wt = wordTime(k, e.dataset.w); if (wt !== null && wt > t) { wordQ.push({ e: e, t: wt }); return; } }
        e.classList.add('on');
      });
      emit('cue', k);
    }
    if (i > shown) shown = i;
    wordQ = wordQ.filter(function (q) { if (t >= q.t) { q.e.classList.add('on'); return false; } return true; });
    if (prefs.cc && curS) setCap((curS.nv || curS.n || [])[Math.max(0, i)] || '');
  }
  function revealAll() {
    if (!scrEl) return;
    $$('[data-c]', scrEl).forEach(function (e) { e.classList.add('on'); });
    var n = curVO ? curVO.cues.length : 0;
    for (var k = shown + 1; k < n; k++) emit('cue', k);
    shown = 99; wordQ = [];
  }
  A.revealAll = revealAll;
  function loop() {
    cancelAnimationFrame(raf);
    var tick = function () {
      if (!curVO) return;
      revealTo(sentAt(narr.currentTime), narr.currentTime);
      if (!narr.paused && !narr.ended) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  function setVoiceBtn(on) { var b = $('#bVoice'); if (!b) return; b.innerHTML = (on ? I.pause : I.voice) + '<span class="sr">' + (on ? 'Pauză' : 'Ascultă vocea') + '</span>'; b.classList.toggle('on', !!on); b.setAttribute('aria-label', on ? 'Pauză' : 'Ascultă vocea'); }
  function playNarr(fromStart) {
    if (!curVO) return;
    stopClip();
    if (fromStart) { narr.currentTime = 0; shown = -1; wordQ = []; $$('[data-c]', scrEl).forEach(function (e) { e.classList.remove('on'); }); }
    narr.muted = prefs.mute;
    var p = narr.play();
    if (p && p.catch) p.catch(function () { setVoiceBtn(false); revealAll(); onNarrEnd(true); });
    setVoiceBtn(true); loop();
  }
  A.playNarr = playNarr;
  function stopNarr() { try { narr.pause(); } catch (e) {} cancelAnimationFrame(raf); setVoiceBtn(false); }
  A.stopNarr = stopNarr;
  narr.addEventListener('ended', function () { setVoiceBtn(false); revealAll(); onNarrEnd(false); });
  narr.addEventListener('pause', function () { if (!narr.ended) setVoiceBtn(false); });
  function onNarrEnd(blocked) {
    if (narrDone) return; narrDone = true;
    if (curS) { st.said[curS.id] = 1; save(); }
    emit('narrEnd', blocked);
    if (A.autoNextOk()) pulseNext(true);
  }
  A.narrDone = function () { return narrDone || !curVO; };

  /* clipuri scurte (replici, feedback); întorc o promisiune */
  var clipRes = null;
  function stopClip() { try { fx.pause(); } catch (e) {} if (clipRes) { var r = clipRes; clipRes = null; r(false); } $$('.talk').forEach(function (e) { e.classList.remove('talk'); }); }
  A.stopClip = stopClip;
  A.clip = function (key, opt) {
    opt = opt || {};
    var c = VO.clips[key];
    if (!narr.paused) { stopNarr(); revealAll(); onNarrEnd(false); }
    stopClip();
    if (opt.cap !== false && prefs.cc && opt.text) setCap(opt.text);
    if (!c || prefs.mute) return new Promise(function (res) { setTimeout(function () { res(true); }, opt.text ? Math.min(2500, 300 + opt.text.length * 40) : 200); });
    if (opt.talk) opt.talk.classList.add('talk');
    return new Promise(function (res) {
      clipRes = res;
      fx.src = c.file; fx.currentTime = 0; fx.muted = prefs.mute;
      var done = function () { fx.onended = null; if (opt.talk) opt.talk.classList.remove('talk'); if (clipRes === res) { clipRes = null; res(true); } };
      fx.onended = done;
      var p = fx.play(); if (p && p.catch) p.catch(function () { done(); });
    });
  };
  A.clips = function (keys, gap) {
    var i = 0;
    return new Promise(function (res) {
      var nextOne = function () { if (i >= keys.length) return res(true); var k = keys[i++]; A.clip(k).then(function (ok) { if (!ok) return res(false); setTimeout(nextOne, gap || 60); }); };
      nextOne();
    });
  };
  function setCap(t) { var c = $('#cap'); if (c) c.textContent = plain(t); }

  /* ---------- evenimente pe ecran ---------- */
  var listeners = [];
  function emit(ev, arg) { listeners.forEach(function (l) { if (l.ev === ev) try { l.fn(arg); } catch (e) { console.warn(e); } }); }
  A.on = function (ev, fn) { listeners.push({ ev: ev, fn: fn }); };
  var timers = [];
  A.later = function (fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; };

  /* ---------- navigare ---------- */
  var SCR = A.SCR = {};
  var curId = null, leaving = null, exDone = false;
  A.cur = function () { return curId; };
  A.exDone = function (v) { if (v === undefined) return exDone; exDone = v; if (v) { pulseNext(true); save(); } };
  A.autoNextOk = function () { var t = curS && curS.type; return !(t === 'ex' || t === 'builder' || t === 'check' || t === 'explain' || t === 'mycard' && false) || exDone; };
  function pulseNext(on) { var b = $('#bNext'); if (b) b.classList.toggle('pulse', !!on); }
  A.pulseNext = pulseNext;
  function modOf(id) { return ALL[id] ? ALL[id].m : -1; }
  function nextId(id) {
    var R = ALL[id]; if (!R) return null;
    if (id === '0.0') return '0.1';
    if (id === '0.1' || id === '0.2') return R.s.id === '0.2' ? firstUnvisited() : '0.2';
    if (id === '9.0' || id === C.adults.id) return '0.2';
    var M = C.modules[R.m];
    if (R.i < M.screens.length - 1) return M.screens[R.i + 1].id;
    return '0.2';
  }
  function prevId(id) {
    var R = ALL[id]; if (!R) return null;
    if (id === '0.1') return '0.0';
    if (id === '0.2') return '0.1';
    if (id === '9.0' || id === C.adults.id) return '0.2';
    if (R.m >= 0) { if (R.i > 0) return C.modules[R.m].screens[R.i - 1].id; return '0.2'; }
    return null;
  }
  function firstUnvisited() {
    for (var m = 0; m < 6; m++) if (!st.done[m]) { var sc = C.modules[m].screens; for (var i = 0; i < sc.length; i++) if (!st.vis[sc[i].id]) return sc[i].id; return sc[0].id; }
    return '9.0';
  }
  A.firstUnvisited = firstUnvisited;
  A.goModule = function (mi) {
    var sc = C.modules[mi].screens;
    if (st.done[mi]) return go(sc[0].id);
    for (var i = 0; i < sc.length; i++) if (!st.vis[sc[i].id]) return go(sc[i].id);
    go(sc[0].id);
  };
  A.next = function () { A.unlock(); var n = nextId(curId); if (n) go(n); };
  A.prev = function () { A.unlock(); var p = prevId(curId); if (p) go(p); };
  function theme(R) {
    var root = document.documentElement;
    if (R.m >= 0) { var col = MC[C.modules[R.m].color]; root.style.setProperty('--mc', col[0]); root.style.setProperty('--mc2', col[1]); }
    else { root.style.setProperty('--mc', '#FF9F1C'); root.style.setProperty('--mc2', '#FFE1B3'); }
  }
  function go(id, opt) {
    opt = opt || {};
    if (!ALL[id]) id = '0.0';
    var R = ALL[id], s = R.s;
    stopNarr(); stopClip();
    $$('.modal,.lightbox,.ghost,.tok.drag').forEach(function (m) { if (m.parentNode) m.parentNode.removeChild(m); });
    timers.forEach(clearTimeout); timers = [];
    listeners = [];
    if (leaving) { try { leaving(); } catch (e) {} leaving = null; }
    curId = id; curS = s; exDone = false; narrDone = false; shown = -1; wordQ = [];
    st.vis[id] = 1;
    if (id !== '0.0' && id !== C.adults.id) st.loc = id;
    if (R.m >= 0 && s.type === 'recap' && !st.done[R.m]) { st.done[R.m] = 1; A.justStarred = R.m; }
    save();
    theme(R);
    var stage = $('.stage');
    var olds = $$('.scr', stage);
    var el = document.createElement('section');
    el.className = 'scr t-' + s.type + (s.type === 'start' ? ' start' : '') + (s.type === 'cover' ? ' cover' : '');
    el.setAttribute('aria-labelledby', 't-' + id.replace('.', '-'));
    var T = SCR[s.type] || SCR.concept;
    el.innerHTML = T.html(s, R);
    stage.appendChild(el);
    scrEl = el;
    olds.forEach(function (old) { old.classList.add('out'); old.classList.remove('in'); old.setAttribute('aria-hidden', 'true'); old.style.pointerEvents = 'none'; setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 450); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('in'); }); });
    // voce
    var vid = id + (s.type === 'mycard' && st.client ? st.client : '');
    curVO = VO.screens[vid] || null;
    if (s.type === 'mycard') curS = { id: id, n: (s.variants || {})[st.client || 'g'] || [], type: 'mycard' };
    if (curVO) { narr.src = curVO.file; narr.load(); }
    updateChrome(R);
    leaving = T.init ? T.init(el, s, R) : null;
    var h = $('h1', el); if (h && opt.focus !== false && id !== '0.0') { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) {} }
    if (curVO && !opt.silent && !(T.noAuto && T.noAuto(s))) {
      if (gestured) { setTimeout(function () { if (curId === id) playNarr(true); }, 420); }
      else { revealAll(); setVoiceBtn(false); pulseVoice(); }
    } else { revealAll(); setTimeout(function () { if (curId === id) onNarrEnd(false); }, 200); }
    if (!curVO) narrDone = true;
  }
  A.go = go;
  function pulseVoice() { var b = $('#bVoice'); if (b) { b.classList.add('pulse'); setTimeout(function () { b.classList.remove('pulse'); }, 4000); } }

  /* ---------- cadrul (bara de sus și de jos) ---------- */
  function chrome() {
    var app = $('#app');
    app.innerHTML =
      '<header class="top"><button class="ib sm home" id="bHome" type="button" aria-label="Strada atelierului (toate lecțiile)">' + I.home + '</button>' +
      '<div class="crumb" id="crumb"></div>' +
      '<div class="stars" id="stars" aria-label="Stele"></div>' +
      '<button class="ib sm" id="bMenu" type="button" aria-label="Meniu" aria-haspopup="dialog">' + I.menu + '</button></header>' +
      '<main class="stage" id="main"></main>' +
      '<nav class="bar" id="bar" aria-label="Navigare"><button class="ib" id="bPrev" type="button" aria-label="Înapoi">' + I.prev + '</button>' +
      '<div class="mid"><button class="ib sm only-short" id="bHome2" type="button" aria-label="Strada atelierului">' + I.home + '</button>' +
      '<button class="ib voice" id="bVoice" type="button" aria-label="Ascultă vocea">' + I.voice + '</button>' +
      '<button class="ib sm" id="bReplay" type="button" aria-label="Ascultă de la început">' + I.replay + '</button><p class="cap" id="cap" aria-live="off"></p><span class="stars only-short" id="stars2" aria-hidden="true"></span><button class="ib sm only-short" id="bMenu2" type="button" aria-label="Meniu" aria-haspopup="dialog">' + I.menu + '</button></div>' +
      '<button class="ib next" id="bNext" type="button" aria-label="Mai departe">' + I.next + '</button></nav>' +
      '<div class="toast" hidden></div>';
    $('#bHome').onclick = function () { A.unlock(); go('0.2'); };
    $('#bPrev').onclick = A.prev;
    $('#bNext').onclick = A.next;
    $('#bVoice').onclick = function () { A.unlock(); if (!curVO) return; if (narr.paused) { if (narr.ended || narr.currentTime >= curVO.dur - 0.2) playNarr(true); else playNarr(false); } else stopNarr(); };
    $('#bReplay').onclick = function () { A.unlock(); if (curVO) playNarr(true); };
    $('#bMenu').onclick = openMenu; $('#bMenu2').onclick = openMenu;
    $('#bHome2').onclick = function () { A.unlock(); go('0.2'); };
    document.addEventListener('keydown', function (e) {
      if ($('.modal') || e.target.closest && e.target.closest('input,textarea,.board')) return;
      if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); A.next(); }
      else if (e.altKey && e.key === 'ArrowLeft') { e.preventDefault(); A.prev(); }
    });
  }
  function updateChrome(R) {
    var s = R.s, cr = $('#crumb');
    $('#app').classList.toggle('isstart', s.type === 'start');
    $('.top').hidden = s.type === 'start';
    $('#bar').hidden = s.type === 'start';
    if (R.m >= 0) {
      var M = C.modules[R.m];
      cr.innerHTML = '<span class="lnum" aria-hidden="true">' + M.num + '</span><span class="ltit"><span class="sr">Lecția ' + M.num + ': </span>' + esc(M.title) + '</span><span class="dots" aria-hidden="true">' +
        M.screens.map(function (x, i) { return '<i class="' + (x.id === s.id ? 'c' : st.vis[x.id] ? 'v' : '') + '"></i>'; }).join('') + '</span>';
    } else {
      cr.innerHTML = '<span class="ltit">' + esc(C.meta.title) + ' · ' + esc(R.s.id === '9.0' ? 'Final' : R.s.id === '0.2' ? 'Strada atelierului' : R.s.id === C.adults.id ? 'Pentru adulți' : 'Bun venit') + '</span>';
    }
    var n = starsCount();
    $('#stars').innerHTML = I.star + '<span>' + n + '<span class="sr"> din 6 stele</span><span aria-hidden="true">/6</span></span>';
    $('#stars2').innerHTML = I.star + '<span>' + n + '/6</span>';
    $('#bPrev').disabled = !prevId(s.id);
    $('#bVoice').disabled = !curVO; $('#bReplay').disabled = !curVO;
    $('#bar').classList.toggle('nocap', !prefs.cc);
    setCap('');
    pulseNext(false);
  }
  A.refreshStars = function () { var n = starsCount(); var e = $('#stars'); if (e) e.innerHTML = I.star + '<span>' + n + '<span class="sr"> din 6 stele</span><span aria-hidden="true">/6</span></span>'; var e2 = $('#stars2'); if (e2) e2.innerHTML = I.star + '<span>' + n + '/6</span>'; };

  /* ---------- fereastră modală, meniu, mesaje ---------- */
  A.modal = function (title, html, onOpen) {
    var m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', plain(title));
    m.innerHTML = '<div class="box"><h2>' + esc(title) + '</h2><button class="ib sm x" type="button" aria-label="Închide">' + I.x + '</button>' + html + '</div>';
    document.body.appendChild(m);
    var last = document.activeElement;
    var close = function () { if (m.parentNode) m.parentNode.removeChild(m); document.removeEventListener('keydown', kd, true); if (last && last.focus) last.focus(); };
    var kd = function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      if (e.key === 'Tab') { var f = $$('button,a[href],input,select,textarea', m).filter(function (x) { return !x.disabled && x.offsetParent !== null; }); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    };
    document.addEventListener('keydown', kd, true);
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    $('.x', m).onclick = close;
    setTimeout(function () { $('.x', m).focus(); }, 30);
    if (onOpen) onOpen(m, close);
    return close;
  };
  function openMenu() {
    A.modal('Meniu', '<div class="menu-list">' +
      '<button class="btn" data-m="cc" type="button" aria-pressed="' + prefs.cc + '">' + I.cc + 'Subtitrare: ' + (prefs.cc ? 'pornită' : 'oprită') + '</button>' +
      '<button class="btn" data-m="mute" type="button" aria-pressed="' + prefs.mute + '">' + (prefs.mute ? I.mute : I.voice) + 'Sunet: ' + (prefs.mute ? 'oprit' : 'pornit') + '</button>' +
      '<button class="btn" data-m="home" type="button">' + I.home + 'Strada atelierului</button>' +
      '<button class="btn" data-m="adults" type="button">' + I.book + 'Pentru profesori și părinți</button>' +
      '<button class="btn" data-m="about" type="button">' + I.ear + 'Despre atelier</button>' +
      '<button class="btn" data-m="full" type="button">' + I.full + 'Ecran complet</button>' +
      (SCO.ok ? '<button class="btn" data-m="exit" type="button">' + I.exit + 'Ieși din curs (se salvează)</button>' : '') +
      '</div>', function (m, close) {
        $$('[data-m]', m).forEach(function (b) {
          b.onclick = function () {
            var k = b.dataset.m;
            if (k === 'cc') { prefs.cc = !prefs.cc; savePrefs(); $('#bar').classList.toggle('nocap', !prefs.cc); close(); openMenu(); return; }
            if (k === 'mute') { prefs.mute = !prefs.mute; savePrefs(); narr.muted = prefs.mute; fx.muted = prefs.mute; close(); openMenu(); return; }
            close();
            if (k === 'home') go('0.2'); else if (k === 'adults') go(C.adults.id); else if (k === 'about') go('0.1');
            else if (k === 'full') { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) {} }
            else if (k === 'exit') A.exit();
          };
        });
      });
  }
  var toastT = null;
  A.toast = function (t) { var e = $('.toast'); if (!e) return; e.textContent = t; e.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { e.hidden = true; }, 2600); };
  A.confetti = function () {
    if (A.reduce) return;
    var c = document.createElement('div'); c.className = 'confetti'; var cols = ['#F15C50', '#FF9F1C', '#FCC93A', '#22BFAE', '#4F8BF3', '#9466EE', '#FF8CC6', '#4FBE83'];
    for (var i = 0; i < 70; i++) { var p = document.createElement('i'); p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % cols.length]; p.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; p.style.animationDelay = (Math.random() * .5) + 's'; c.appendChild(p); }
    document.body.appendChild(c); setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 3800);
  };
  A.exit = function () { saveNow(); SCO.finish(); A.toast('Progresul a fost salvat. Poți închide fereastra.'); };

  /* ---------- pornire ---------- */
  function boot() {
    loadPrefs();
    SCO.init();
    load();
    chrome();
    window.addEventListener('pagehide', function () { saveNow(); SCO.finish(); });
    window.addEventListener('beforeunload', function () { saveNow(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) saveNow(); });
    document.addEventListener('pointerdown', function () { A.unlock(); }, { once: true });
    go('0.0', { focus: false });
    if (!CFG.skipIntro && !st.loc) A.intro && A.intro();
  }
  A.boot = boot;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 0); });
  else setTimeout(boot, 0);
})();
