/* Casa pe măsură · tipurile de ecran (start, despre, strada, copertă, concept, cartonaș, recapitulare, galerie, final, adulți) */
(function () {
  'use strict';
  var A = window.APP, C = A.C, I = A.I, $ = A.$, $$ = A.$$, esc = A.esc, mk = A.mk, dc = A.dc, SCR = A.SCR;
  var PIECES = C.pieces, PC = {}; PIECES.forEach(function (p) { PC[p.id] = p; }); A.PC = PC;
  var FIG = C.fig; A.FIG = FIG;
  function alt(n) { return (C.alt || {})[n] || ''; }
  A.alt = alt;
  function src(n) {
    if (/^cov_|^hero/.test(n)) return 'media/img/' + n + '.webp';
    if (/^foto_/.test(n)) return 'media/foto/' + n + '.webp';
    if (/^ws_|^casa_/.test(n)) return 'media/ws/' + n + '.webp';
    if (/^semn_/.test(n)) return 'media/char/' + n + '.png';
    if (/^m_/.test(n)) return 'media/char/' + n + '.png';
    if (/^poster_/.test(n)) return 'media/char/' + n + '.webp';
    if (/^fg\d|^ex\d/.test(n)) return 'media/fisa/' + n + (/^fg/.test(n) ? '.png' : '.webp');
    if (/^[ab]\d+$|^x_/.test(n)) return 'media/kit/' + n + '.png';
    return 'media/' + n;
  }
  A.src = src;
  function img(n, cls, extra) { var a = alt(n); return '<img src="' + src(n) + '" alt="' + esc(a) + '"' + (a ? '' : ' aria-hidden="true"') + (cls ? ' class="' + cls + '"' : '') + (extra || '') + ' draggable="false">'; }
  A.img = img;
  function ph(n, opt) {
    opt = opt || {};
    var media = opt.video ? '<video src="media/video/' + n + '.mp4" poster="' + src(opt.poster || '') + '" muted loop playsinline autoplay aria-label="' + esc(alt(n)) + '"></video>' : img(n);
    return '<figure class="ph ' + (opt.r || 'r43') + '"' + dc(opt.c, opt.w) + ' style="margin:0">' + media + (opt.cap ? '<figcaption class="cap">' + esc(opt.cap) + '</figcaption>' : '') + '</figure>';
  }
  A.ph = ph;
  function kick(s) { return s.k ? '<p class="kick">' + esc(s.k) + '</p>' : ''; }
  function title(s) { return '<h1 class="t" id="t-' + s.id.replace('.', '-') + '">' + mk(s.t) + '</h1>'; }
  A.kick = kick; A.title = title;
  function say(x) { return x ? '<p class="say"' + dc(x.c, x.w) + '>' + mk(x.t) + '</p>' : ''; }
  A.say = say;

  /* ---------- scenă din piesele kitului (cm) ---------- */
  A.kitScene = function (spec) {
    var W = spec.W, H = spec.H, g = spec.ground;
    var pg = g / H * 100, pl = (g + 0.4) / H * 100;
    var bg = spec.bg || ('linear-gradient(var(--sky) 0 ' + pg + '%,var(--grass) ' + pg + '% ' + pl + '%,var(--earth) ' + pl + '%)');
    var h = '<div class="kitscene ' + (spec.cls || '') + '" style="aspect-ratio:' + W + '/' + H + ';background:' + bg + '"' + (spec.label ? ' role="img" aria-label="' + esc(spec.label) + '"' : ' aria-hidden="true"') + '>';
    (spec.items || []).forEach(function (it) { h += A.kitItem(it, W, H); });
    return h + (spec.extra || '') + '</div>';
  };
  A.kitItem = function (it, W, H) {
    var w = it.w, hh = it.h, inner = '';
    if (it.p && PC[it.p]) { var p = PC[it.p]; w = w || p.w; hh = hh || p.h; if (it.r === 90 || it.r === 270) { } inner = '<img src="' + src(it.p) + '" alt="" draggable="false">'; }
    else if (it.fig) { var f = FIG[it.fig]; hh = hh || f.h; w = w || hh * f.ar; inner = '<img src="' + f.src + '" alt="" draggable="false">'; }
    else if (it.wall) { inner = ''; }
    var y = it.bottom !== undefined ? it.bottom - hh : it.y;
    var st = 'left:' + (it.x / W * 100) + '%;top:' + (y / H * 100) + '%;width:' + (w / W * 100) + '%;height:' + (hh / H * 100) + '%;' +
      (it.wall ? 'background:' + it.wall + ';border:2px solid rgba(31,36,51,.22);' + (it.round ? 'border-radius:50%;' : '') : '') + (it.r ? 'transform:rotate(' + it.r + 'deg);' : '') + (it.z ? 'z-index:' + it.z + ';' : '') + (it.style || '');
    return '<div class="pc ' + (it.cls || '') + '"' + (it.id ? ' data-id="' + it.id + '"' : '') + dc(it.c, it.wd) + ' style="' + st + '">' + inner + (it.html || '') + '</div>';
  };

  /* ---------- start ---------- */
  SCR.start = {
    html: function () {
      var st = A.st(), resume = st.loc && st.loc !== '0.0' && A.ALL[st.loc];
      return '<div class="hero">' + img('hero') + '</div><div class="veil" aria-hidden="true"></div>' +
        '<div class="panel">' +
        '<div class="idbar"><img class="cp" src="media/brand/cp_logo_negru.png" alt="Finanțat de Municipiul Timișoara prin Centrul de Proiecte și Administrația pentru Sănătate și Educație">' +
        '<p class="proj"><b>' + esc(C.meta.project) + '</b><br>' + esc(C.meta.edition) + '<br>' + esc(C.meta.activity) + '</p></div>' +
        '<h1 class="logo-t" id="t-0-0" aria-label="Casa pe măsură"><span>Casa</span><span>pe</span><span>măsură</span></h1>' +
        '<p class="sub">Arhitectura celor mici</p>' +
        '<p class="sub2">Un arhitect gândește casa pentru cineva. Alege-ți clientul și construiește-i o casă pe măsura lui!</p>' +
        '<div class="acts">' + (resume ? '<button class="btn big pri" type="button" data-go="' + esc(st.loc) + '">' + I.play + 'Continuă</button><button class="btn" type="button" data-go="0.1">De la început</button>'
          : '<button class="btn big pri" type="button" data-go="0.1">' + I.play + 'Începe</button><button class="btn" type="button" data-go="0.2">' + I.home + 'Strada atelierului</button>') + '</div>' +
        '<p class="by">Atelier creat de <b>' + esc(C.meta.contentAuthor) + '</b><br>E-learning: <b>' + esc(C.meta.author) + '</b> · <b>' + esc(C.meta.org) + '</b></p>' +
        '<p class="by" style="font-weight:400">Pentru copiii din clasele I–II · cu voce, jocuri și un constructor de case · telefon, tabletă sau calculator</p>' +
        '</div><p class="fund">' + esc(C.meta.funding) + '</p>';
    },
    init: function (el) {
      $$('[data-go]', el).forEach(function (b) { b.onclick = function () { A.unlock(); A.sfx('pop'); A.go(b.dataset.go); }; });
      setTimeout(function () { var b = $('.btn.pri', el); if (b) b.focus({ preventScroll: true }); }, 900);
    }
  };
  A.intro = function () {
    if (A.reduce) return;
    var d = document.createElement('div'); d.className = 'intro'; d.setAttribute('role', 'presentation');
    d.innerHTML = '<video src="media/video/intro_cp.mp4" muted playsinline autoplay aria-label="Logo animat: Centrul de Proiecte Timișoara"></video><button class="btn skip" type="button">Sari peste</button>';
    document.body.appendChild(d);
    var close = function () { if (d.parentNode) { d.style.transition = 'opacity .5s'; d.style.opacity = '0'; setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 500); } };
    var v = $('video', d); v.onended = close; v.onerror = close; setTimeout(close, 7500);
    $('.skip', d).onclick = function () { A.unlock(); close(); };
    var p = v.play(); if (p && p.catch) p.catch(close);
  };

  /* ---------- despre ---------- */
  SCR.about = {
    html: function (s) {
      return '<div class="wrap about">' + kick(s) + title(s) +
        '<div class="grid"><div class="col">' +
        '<p class="lead"' + dc(1) + '>Un arhitect gândește case <b>pentru cineva</b>. Azi, tu ești arhitectul.</p>' +
        '<div class="diana"' + dc(2) + '><figure class="ph" style="margin:0">' + img('ws_diana_tabla') + '</figure><div><b>' + esc(C.meta.contentAuthor) + '</b><small>formatoarea atelierului „Casa pe măsură”, pentru clasele I–II · ' + esc(C.meta.school) + '</small></div></div>' +
        '<div class="how">' + s.how.map(function (h) { return '<div class="h"' + dc(h.c) + '><span class="i">' + (I[h.i] || I.tap) + '</span>' + esc(h.t) + '</div>'; }).join('') + '</div>' +
        '</div><div class="col"><div class="strip">' + s.photos.map(function (p, i) { return '<figure class="ph"' + dc(3) + ' style="margin:0">' + img(p) + '</figure>'; }).join('') + '</div>' +
        '<p class="lead" style="font-size:var(--fs-s)"' + dc(3) + '>Fotografii de la atelierele din noiembrie 2026, Școala Gimnazială nr. 30, Timișoara.</p></div></div></div>';
    }
  };

  /* ---------- strada (cuprins) ---------- */
  SCR.hub = {
    html: function (s) {
      var st = A.st(), nx = -1;
      for (var m = 0; m < 6; m++) if (!st.done[m]) { nx = m; break; }
      var houses = C.modules.map(function (M, mi) {
        var col = A.MC[M.color], p = A.modProgress(mi), done = st.done[mi];
        return '<button class="house' + (done ? ' done' : '') + (mi === nx ? ' nx' : '') + '" type="button" data-mod="' + mi + '" style="--hc:' + col[0] + '">' +
          '<span class="st" aria-hidden="true">' + (done ? I.star : '') + '</span><span class="roof" aria-hidden="true"></span>' +
          '<span class="body"><span class="win">' + img('cov_m' + M.num + '_s', '', '') + '</span><span class="nm"><span class="sr">Lecția ' + M.num + ': </span>' + esc(M.title) + '<span class="sr">' + (done ? ', terminată, ai stea' : p > 0 ? ', începută' : '') + '</span></span>' +
          '<span class="pr" aria-hidden="true"><i style="width:' + Math.round(p * 100) + '%"></i></span><span class="door" aria-hidden="true">' + M.num + '</span></span></button>';
      }).join('');
      return '<div class="wrap hub">' + kick(s) + title(s) + '<div class="street">' + houses + '</div>' +
        '<div class="side"><button class="btn ' + (A.allDone() ? 'pri' : '') + '" type="button" data-go="9.0">' + I.flag + 'Finalul atelierului</button>' +
        '<button class="btn" type="button" data-go="' + C.adults.id + '">' + I.book + 'Pentru profesori și părinți</button></div></div>';
    },
    init: function (el) {
      $$('[data-mod]', el).forEach(function (b) { b.onclick = function () { A.unlock(); A.sfx('knock'); A.goModule(+b.dataset.mod); }; });
      $$('[data-go]', el).forEach(function (b) { b.onclick = function () { A.unlock(); A.go(b.dataset.go); }; });
      var nx = $('.house.nx', el); if (nx) nx.style.animation = 'pulse 1.6s ease-in-out infinite';
      if (A.justStarred !== undefined && A.justStarred !== null) {
        var h = $$('.house', el)[A.justStarred]; A.justStarred = null;
        setTimeout(function () { A.sfx('star'); A.confetti(); if (h) h.classList.add('pop'); }, 500);
        if (A.allDone()) A.later(function () { A.clip('ui:hub.alldone'); }, 1800);
      }
    }
  };

  /* ---------- copertă ---------- */
  SCR.cover = {
    html: function (s, R) {
      var M = C.modules[R.m];
      return '<div class="bg">' + img(s.img) + '</div><div class="cc"><p class="ln"><b>' + M.num + '</b>Lecția ' + M.num + ' · ' + esc(M.sub) + '</p>' +
        '<h1 id="t-' + s.id.replace('.', '-') + '">' + esc(M.title) + '</h1>' +
        '<div class="goals">' + (s.goals || []).map(function (g) { return '<span class="goal"' + dc(g.c) + '><span>' + (I[g.i] || I.star) + '</span>' + esc(g.t) + '</span>'; }).join('') + '</div></div>';
    },
    init: function (el, s) { if (s.sfx === 'knock') A.later(function () { A.sfx('knock'); }, 300); }
  };

  /* ---------- concept ---------- */
  SCR.concept = {
    html: function (s) {
      var L = kick(s) + title(s);
      if (s.lead) L += '<p class="lead"' + dc(s.lead.c) + '>' + mk(s.lead.t) + '</p>';
      if (s.cards) L += '<div class="cards">' + s.cards.map(function (x) { return '<div class="card"' + dc(x.c, x.w) + '><span class="ic">' + (I[x.i] || I.star) + '</span><span><b>' + esc(x.t) + '</b>' + (x.p ? '<small>' + esc(x.p) + '</small>' : '') + '</span></div>'; }).join('') + '</div>';
      if (s.cols) L += '<div class="cards">' + s.cols.map(function (x) { var cl = C.clients[x.cl]; return '<div class="card"' + dc(x.c) + '><span class="ic" style="background:#fff;width:64px;height:64px">' + '<img src="' + FIG[x.cl].src + '" alt="" style="max-height:52px;max-width:52px"></span><span><b>' + esc(cl.name) + '</b><small>' + esc(x.t) + '</small></span></div>'; }).join('') + '</div>';
      L += say(s.say);
      var R = '';
      if (s.demo && DEMO[s.demo]) R = DEMO[s.demo].html(s);
      else if (s.imgs) R = '<div class="col" style="display:grid;grid-template-columns:repeat(' + Math.min(s.imgs.length, s.imgs.length > 2 ? 3 : 2) + ',minmax(0,1fr));gap:12px">' + s.imgs.map(function (x) { return ph(x.src, { c: x.c, cap: x.cap, r: s.imgs.length > 2 ? 'r34' : 'r43', video: x.video, poster: 'foto_suricata_vizuina' }); }).join('') + '</div>';
      else if (s.img) R = ph(s.img.src, { c: s.img.c, cap: s.img.cap });
      if (s.demo && s.imgs) R = '<div class="col">' + DEMO[s.demo].html(s) + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' + s.imgs.map(function (x) { return ph(x.src, { c: x.c, cap: x.cap }); }).join('') + '</div></div>';
      return '<div class="wrap"><div class="lay"><div class="col">' + L + '</div><div class="col">' + R + '</div></div></div>';
    },
    init: function (el, s) { if (s.demo && DEMO[s.demo] && DEMO[s.demo].init) return DEMO[s.demo].init(el, s); }
  };

  /* ---------- demonstrații animate ---------- */
  var DEMO = A.DEMO = {};
  // 2.1 – comparația de mărime
  DEMO.lineup = {
    html: function () {
      var kid = '<svg viewBox="0 0 40 100" aria-hidden="true"><circle cx="20" cy="12" r="10" fill="#8A93A6"/><path d="M8 28h24l-3 38h-5l-1 32h-6l-1-32h-5z" fill="#8A93A6"/></svg>';
      return '<div class="lineup" style="position:relative;aspect-ratio:4/3;border:3px solid var(--ink);border-radius:22px;background:linear-gradient(var(--sky) 0 86%,var(--grass) 86% 88%,var(--earth) 88%);overflow:hidden" role="img" aria-label="Girafa e cât trei oameni mari; suricata ajunge la genunchiul unui copil; liliacul încape în palmă.">' +
        '<div style="position:absolute;left:6%;bottom:14%;height:20%" data-c="0">' + kid.replace('<svg', '<svg style="height:100%"') + '<span style="position:absolute;top:-30px;left:50%;translate:-50% 0;font:900 14px var(--disp);background:#fff;border:2px solid var(--ink);border-radius:99px;padding:1px 8px">tu</span></div>' +
        '<div style="position:absolute;left:20%;bottom:14%;height:76%;display:flex;flex-direction:column-reverse" data-c="1">' + [0, 1, 2].map(function () { return '<svg viewBox="0 0 40 100" style="height:33.3%" aria-hidden="true"><circle cx="20" cy="12" r="10" fill="#C7CCD8"/><path d="M8 28h24l-3 38h-5l-1 32h-6l-1-32h-5z" fill="#C7CCD8"/></svg>'; }).join('') + '</div>' +
        '<div style="position:absolute;left:30%;bottom:14%;height:78%" data-c="1">' + img('poster_girafa', '', ' style="height:100%;width:auto"') + '</div>' +
        '<div style="position:absolute;left:66%;bottom:14%;height:9%" data-c="2">' + img('poster_suricata', '', ' style="height:100%;width:auto"') + '</div>' +
        '<div style="position:absolute;left:62%;bottom:14%;height:20%;opacity:.5" data-c="2">' + kid.replace('<svg', '<svg style="height:100%"') + '</div>' +
        '<div style="position:absolute;right:4%;top:8%;width:26%;aspect-ratio:1;border-radius:50%;background:#fff;border:3px solid var(--ink);display:grid;place-items:center" data-c="3"><svg viewBox="0 0 100 100" style="position:absolute;inset:12%" aria-hidden="true"><path d="M20 70c0-20 8-40 18-40s6 22 8 22 4-34 12-34 6 30 8 30 4-22 10-20 6 30 4 42c-2 12-18 18-30 18S20 84 20 70z" fill="#F3D3B5" stroke="#1F2433" stroke-width="3"/></svg>' + img('m_liliac', '', ' style="position:relative;height:42%;width:auto;margin-top:-10%"') + '</div>' +
        '<div style="position:absolute;left:4%;top:5%;display:flex;gap:8px;align-items:flex-end" data-c="4">' + ['g', 's', 'l'].map(function (k) { return '<span style="background:#FFF6E2;border:2px dashed var(--ink);border-radius:8px;padding:4px;height:' + (k === 'g' ? 74 : 40) + 'px;display:flex;align-items:flex-end"><img src="' + FIG[k].src + '" alt="" style="height:100%;width:auto"></span>'; }).join('') + '<span style="font:900 14px var(--disp);background:#fff;border:2px solid var(--ink);border-radius:99px;padding:2px 10px">„mărimea mea”</span></div></div>';
    }
  };
  // 2.2 – măsurarea ușii
  DEMO.measure = {
    html: function () {
      var W = 18, H = 10, g = 8.6;
      return '<div class="measure">' + A.kitScene({ W: W, H: H, ground: g, label: 'Măsurarea ușii: clientul lângă ușă, cu marginea de jos pe podea.', items: [
        { p: 'a39', x: 2.2, bottom: g, cls: 'mdoor', id: 'd1' },
        { fig: 'g', x: 6.0, bottom: g, cls: 'mfig', id: 'f1', c: 1 },
        { p: 'a65', x: 10.6, bottom: g, cls: 'mdoor', id: 'd2', c: 3 },
        { fig: 'g', x: 12.2, bottom: g, cls: 'mfig bend', id: 'f2', c: 3 },
        { p: 'b52', x: 14.6, bottom: g, cls: 'mdoor', id: 'd3', c: 4 }
      ], extra: '<div class="mline" data-c="2" style="position:absolute;left:10%;right:62%;top:' + ((g - 6.6) / H * 100) + '%;border-top:4px dashed var(--green)"></div>' +
        '<div data-c="2" style="position:absolute;left:12%;top:4%;font:900 18px var(--disp);background:#DDF5E6;border:2.5px solid var(--ink);border-radius:99px;padding:2px 12px">încape ✓</div>' +
        '<div data-c="3" style="position:absolute;left:57%;top:12%;font:900 18px var(--disp);background:#FFE4DF;border:2.5px solid var(--ink);border-radius:99px;padding:2px 12px">prea mică ✗</div>' +
        '<div data-c="4" style="position:absolute;right:2%;top:46%;font:900 15px var(--disp);background:#FFF0BF;border:2.5px solid var(--ink);border-radius:99px;padding:2px 10px">mult prea mare<br>pentru suricată</div>' +
        '<div data-c="4" style="position:absolute;left:' + (17.4 / W * 100) + '%;top:' + ((g - 2.1) / H * 100) + '%;height:' + (2.1 / H * 100) + '%;translate:-100% 0">' + '<img src="' + FIG.s.src + '" alt="" style="height:100%;width:auto">' + '</div>'
      }) + '</div>';
    }
  };
  // 3.4 – pridvorul și copacul
  DEMO.porch = {
    html: function () {
      var W = 20, H = 11, g = 9.6;
      return A.kitScene({ W: W, H: H, ground: g, label: 'Girafa stă la umbră, sub pridvorul sprijinit pe stâlpi, sau sub un copac.', items: [
        { html: I.sun, x: 16.5, y: .4, w: 2.6, h: 2.6, cls: 'sunpc' },
        { p: 'a42', x: 2.15, bottom: g, h: 3.2, w: .55, c: 2 }, { p: 'a61', x: 1.0, y: g - 5.4, c: 2 },
        { wall: 'rgba(31,36,51,.16)', x: .6, y: g, w: 4.2, h: .5, round: true, c: 2 },
        { p: 'b53', x: 7.0, bottom: g, c: 3 }, { p: 'a54', x: 13.1, bottom: g, c: 3 },
        { p: 'a53', x: 6.4, y: g - 7.9, w: 7.9, h: .5, c: 3 }, { p: 'b40', x: 6.2, y: g - 9.8, w: 8.3, h: 1.95, c: 3 },
        { wall: 'rgba(31,36,51,.16)', x: 6.6, y: g, w: 7.6, h: .55, c: 3 },
        { fig: 'g', x: 8.6, bottom: g, c: 1, cls: 'gfig' }
      ] });
    }
  };
  // 4.1 – cuvintele locului
  DEMO.words = {
    html: function () {
      var W = 18.6, H = 16, g = 9.4;
      var tag = function (t, x, y, c) { return '<div data-c="' + c + '" style="position:absolute;left:' + (x / W * 100) + '%;top:' + (y / H * 100) + '%;font:900 clamp(16px,2vw,24px) var(--disp);background:var(--yellow);border:3px solid var(--ink);border-radius:12px;padding:2px 12px;box-shadow:0 4px 0 var(--ink)">' + t + '</div>'; };
      return A.kitScene({ W: W, H: H, ground: g, label: 'Casa cu pod sus, podea jos, linia verde, camere sub pământ și un copac lângă casă.', items: [
        { wall: '#FFD7E8', x: 4, y: g - 6, w: 6.5, h: 6 }, { p: 'b36', x: 3.75, y: g - 9.4, w: 7, h: 3.45 },
        { p: 'b66', x: 5.2, y: g - 7.6, w: 4.2, h: .45 }, { fig: 'l', x: 6.5, y: g - 7.2, h: 1.9 },
        { p: 'a67', x: 6.6, bottom: g }, { p: 'a57', x: 4.6, y: g - 4.6 },
        { p: 'a42', x: 13.2, bottom: g, w: .55, h: 3.2 }, { p: 'a61', x: 12.35, y: g - 5.3 },
        { wall: '#F6D9A8', x: 4.4, y: g + 1.6, w: 5.6, h: 2.6, round: true }, { fig: 's', x: 6.6, y: g + 2.0, h: 2.1 }
      ], extra: tag('sus', 10.6, g - 8.6, 1) + tag('jos', 10.6, g - 1.4, 2) + tag('deasupra', .6, g - 1.6, 3) + tag('dedesubt', .6, g + .9, 3) + tag('lângă', 14.4, g - 2.6, 4) });
    }
  };

  /* ---------- cartonașul (1.4) ---------- */
  function cardk(cl, signs, opt) {
    var c = C.clients[cl];
    return '<div class="cardk"><div class="fig"' + dc(opt && opt.figc) + '><img src="' + FIG[cl].src + '" alt="' + esc(c.name) + ', mărimea mea"></div><div><p class="nm">' + esc(c.name) + '</p><p class="q">„' + esc(c.quote) + '”</p>' +
      '<div class="signs">' + signs.map(function (x, i) { return '<button class="sign" type="button" data-sign="' + x.tile + '"' + dc(x.c) + '><img src="' + src('semn_' + x.tile) + '" alt=""><b>' + esc(x.h) + '</b><small>' + esc(x.p) + '</small></button>'; }).join('') + '</div></div></div>';
  }
  A.cardk = cardk;
  SCR.card = {
    html: function (s) { return '<div class="wrap">' + kick(s) + title(s) + cardk(s.client, s.signs) + say(s.say) + '</div>'; },
    init: function (el) {
      A.on('cue', function (k) { $$('.sign', el).forEach(function (b, i) { b.classList.toggle('cur', i === k - 1); }); });
      A.on('narrEnd', function () { $$('.sign', el).forEach(function (b) { b.classList.remove('cur'); }); });
      $$('.sign', el).forEach(function (b) { b.onclick = function () { A.clip('sign:' + b.dataset.sign); }; });
    }
  };
  var SIGNQ = { g: ['g_marime', 'g_zi', 'g_sus', 'g_umbra'], l: ['l_marime', 'l_noapte', 'l_sus', 'l_multi'], s: ['s_marime', 's_zi', 's_jos', 's_familie'] };
  var SIGNH = ['Scara', 'Lumina', 'Nivelul', 'Spațiul'];
  A.SIGNQ = SIGNQ;
  SCR.mycard = {
    html: function (s) {
      var cl = A.st().client || 'g', n = s.variants[cl];
      var signs = SIGNQ[cl].map(function (t, i) { return { tile: t, h: SIGNH[i], p: n[i + 1].replace(/^[^:]+:\s*/, ''), c: i + 1 }; });
      return '<div class="wrap">' + kick(s) + title(s) + cardk(cl, signs) + '<p class="say" data-c="5">Acum, la treabă!</p></div>';
    },
    init: function (el) {
      if (!A.st().client) A.toast('Alege mai întâi un client (ecranul 6.1).');
      A.on('cue', function (k) { $$('.sign', el).forEach(function (b, i) { b.classList.toggle('cur', i === k - 1); }); });
      A.on('narrEnd', function () { $$('.sign', el).forEach(function (b) { b.classList.remove('cur'); }); });
      $$('.sign', el).forEach(function (b) { b.onclick = function () { A.clip('sign:' + b.dataset.sign); }; });
    }
  };

  /* ---------- recapitulare ---------- */
  SCR.recap = {
    html: function (s, R) {
      var M = C.modules[R.m], last = R.m === 5;
      var burst = ''; for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2; burst += '<i style="--dx:' + Math.round(Math.cos(a) * 140) + 'px;--dy:' + Math.round(Math.sin(a) * 140) + 'px;background:' + ['#F15C50', '#22BFAE', '#4F8BF3', '#9466EE', '#FF8CC6', '#4FBE83'][i % 6] + ';animation-delay:' + (.25 + i * .02) + 's"></i>'; }
      return '<div class="wrap recap"><div class="lay"><div class="col">' + kick(s) + title(s) +
        '<div class="pts">' + s.pts.map(function (p) { return '<div class="pt"' + dc(p.c) + '><span>' + (I[p.i] || I.star) + '</span>' + esc(p.t) + '</div>'; }).join('') + '</div>' +
        '<div class="acts" data-c="' + (s.n.length - 1) + '"><button class="btn pri" type="button" data-act="hub">' + I.home + 'Pe stradă</button>' +
        (last ? '<button class="btn yel" type="button" data-act="fin">' + I.flag + 'Finalul atelierului</button>' : '<button class="btn yel" type="button" data-act="nxm">Lecția ' + (M.num + 1) + I.next + '</button>') + '</div></div>' +
        '<div class="col"><div class="bigstar" data-c="' + (s.n.length - 1) + '"><span class="burst" aria-hidden="true">' + burst + '</span>' + I.star.replace('<svg', '<svg role="img" aria-label="Stea de arhitect pentru lecția ' + M.num + '"') + '</div>' +
        '<p class="say" style="align-self:center" data-c="' + (s.n.length - 1) + '">Lecția ' + M.num + ': ' + esc(M.title) + ' ✓</p></div></div></div>';
    },
    init: function (el, s, R) {
      var played = false;
      A.on('cue', function (k) { if (k === s.n.length - 1 && !played) { played = true; $('.bigstar', el).classList.add('on'); A.sfx('star'); A.confetti(); A.refreshStars(); } });
      A.on('narrEnd', function () { if (!played) { played = true; $('.bigstar', el).classList.add('on'); A.sfx('star'); A.refreshStars(); } });
      $$('[data-act]', el).forEach(function (b) { b.onclick = function () { var k = b.dataset.act; if (k === 'hub') A.go('0.2'); else if (k === 'fin') A.go('9.0'); else A.goModule(R.m + 1); }; });
    }
  };

  /* ---------- galeria (6.6) ---------- */
  SCR.gallery = {
    html: function (s) {
      var mine = A.houseThumb ? A.houseThumb() : null;
      return '<div class="wrap">' + kick(s) + title(s) +
        '<div class="gal">' + (mine ? '<figure class="ph mine" data-c="2" style="margin:0"><img src="' + mine + '" alt="Casa construită de tine"><figcaption class="cap">Casa ta</figcaption></figure>' : '') +
        s.photos.map(function (p, i) { return '<figure class="ph" style="margin:0"' + dc(i < 4 ? 0 : 1) + ' data-zoom="' + p + '">' + img(p) + '</figure>'; }).join('') + '</div>' +
        '<div class="acts" data-c="2">' + (mine ? '<button class="btn pri" type="button" data-a="dl">' + I.dl + 'Salvează casa ta</button><button class="btn" type="button" data-a="pr">' + I.print + 'Tipărește</button>' : '<button class="btn pri" type="button" data-a="build">' + I.build + 'Construiește casa ta</button>') + '</div></div>';
    },
    init: function (el) {
      $$('[data-zoom]', el).forEach(function (f) { f.onclick = function () { var d = document.createElement('div'); d.className = 'lightbox'; d.innerHTML = img(f.dataset.zoom) + '<button class="ib x" type="button" aria-label="Închide">' + I.x + '</button>'; document.body.appendChild(d); var cl = function () { d.parentNode && d.parentNode.removeChild(d); }; d.onclick = cl; $('.x', d).focus(); }; });
      $$('[data-a]', el).forEach(function (b) { b.onclick = function () { var k = b.dataset.a; if (k === 'dl') A.downloadHouse(); else if (k === 'pr') A.printHouse(); else A.go('6.3'); }; });
    }
  };

  /* ---------- final ---------- */
  /* ---------- fișele de tipar pentru clasă (descărcare) ---------- */
  A.kitDl = function (noHead) {
    var D = C.adults;
    return '<section class="kitdl"' + (noHead ? ' aria-label="Fișele pentru clasă"' : ' aria-labelledby="kitdl-h"') + '>' + (noHead ? '' : '<h2 id="kitdl-h">' + I.print + 'Fișele pentru clasă</h2>' +
      '<p class="kd-lead">Kitul atelierului, gata de tipărit: planșa perechii, colile de forme, cartonașele și afișele clienților, fișa lecției.</p>') +
      '<a class="btn pri kd-all" href="media/print/' + esc(D.kitzip[0]) + '" download>' + I.dl + '<span>Descarcă tot kitul <small>(ZIP, ' + esc(D.kitzip[1]) + ')</small></span></a>' +
      '<ul class="kd-list">' + D.kit.map(function (k) {
        return '<li><a href="media/print/' + esc(k[0]) + '" download><img src="media/print/' + esc(k[4]) + '" alt="" loading="lazy"><span><b>' + esc(k[1]) + '</b><small>' + esc(k[2]) + '</small><em>' + I.pdf + 'PDF · ' + esc(k[3]) + '</em></span><span class="kd-ic" aria-hidden="true">' + I.dl + '</span></a></li>';
      }).join('') + '</ul>' +
      '<p class="kd-note">Tipărește la 100%, fără „potrivire în pagină”: piesele și animalele au aceeași scară. <a href="media/print/CITESTE-MA.txt" download>Instrucțiuni de tipar</a> (cantități pentru 4 clase, hârtie, tăiere).</p></section>';
  };

  SCR.final = {
    html: function (s) {
      var st = A.st(), n = A.starsCount(), mine = A.houseThumb ? A.houseThumb() : null, cl = st.client && C.clients[st.client];
      var stars = ''; for (var i = 0; i < 6; i++) stars += (st.done[i] ? I.star : I.star0);
      var sc = A.score();
      return '<div class="wrap final">' + kick(s) + title(s) + '<div class="grid"><div class="col">' +
        '<div class="diploma" data-c="0"><h2>Diplomă de arhitect</h2>' +
        '<label class="nm" for="dname">Arhitect: <input id="dname" type="text" maxlength="40" autocomplete="off" placeholder="numele tău" value="' + esc(st.name || '') + '"></label>' +
        '<div class="row"><div class="stars6" role="img" aria-label="' + n + ' stele din 6">' + stars + '</div></div>' +
        '<div class="row">' + (mine ? '<img class="house" src="' + mine + '" alt="Casa construită de tine">' : '') + '<p style="margin:0;font:800 var(--fs-b)/1.35 var(--disp)">' + (cl ? 'Clientul tău: <b>' + esc(cl.name) + '</b><br>' : '') + 'Atelierul „Casa pe măsură”<br><small style="font:400 var(--fs-s) var(--read)">' + esc(C.meta.project) + '</small></p></div>' +
        '<div class="acts" style="margin-top:14px"><button class="btn" type="button" data-a="pr">' + I.print + 'Tipărește diploma</button></div></div>' +
        '<div class="credits" data-c="1"><p style="margin:0 0 8px;font:900 var(--fs-b) var(--disp);color:var(--ink)">Ți-a plăcut atelierul?</p><div class="faces" role="group" aria-label="Ți-a plăcut atelierul?">' +
        [['3', '😀', 'Mi-a plăcut mult'], ['2', '🙂', 'Mi-a plăcut'], ['1', '😐', 'Așa și așa']].map(function (f) { return '<button type="button" data-like="' + f[0] + '" aria-pressed="' + (String(st.like) === f[0]) + '" aria-label="' + f[2] + '">' + f[1] + '</button>'; }).join('') + '</div></div>' +
        A.kitDl() +
        '</div><div class="col">' +
        '<div class="credits" data-c="2"><b>Atelierul „Casa pe măsură”</b> (conținut, kitul de tipar și ilustrațiile clienților): <b>' + esc(C.meta.contentAuthor) + '</b>.<br><b>E-learning:</b> ' + esc(C.meta.author) + ' · ' + esc(C.meta.org) + ', în proiectul <i>' + esc(C.meta.project) + '</i>, ' + esc(C.meta.activity) + '.<br>' +
        'Voci: ElevenLabs v4 prin Magnific (naratoarea și cei trei clienți). Ilustrații de copertă și fotografii cu animale și case: generate cu IA în Magnific, în stilul kitului; fotografia cu arhitecții și cele două cu girafa și liliacul: Freepik. Fotografiile din clasă: atelierele din noiembrie 2026, fără fețe de copii. Fonturi: Nunito, Andika (SIL OFL).' +
        (sc.total ? '<br>Jocuri rezolvate din prima: ' + sc.ok + ' din ' + sc.total + '.' : '') + '</div>' +
        '<div class="logos" data-c="3"><img class="cp" src="media/brand/cp_logo_negru.png" alt="Finanțat de Municipiul Timișoara prin Centrul de Proiecte și Administrația pentru Sănătate și Educație"><img class="sig" src="media/brand/semnatura_cerneala.png" alt="Urban Instances V3 · Cetatea citită"><span style="font:700 12px/1.4 var(--read);color:var(--ink2);flex:1 1 220px">' + esc(C.meta.funding) + '</span></div>' +
        '<div class="lt" data-c="2"><span class="glow" aria-hidden="true"></span><img src="media/brand/leetucation_v2.svg" alt="LEETUCATION"><div class="who"><b>Gelu-Emanuel Cebzan</b>LEETUCATION SRL · Timișoara</div></div>' +
        '<div class="acts"><button class="btn pri" type="button" data-a="hub">' + I.home + 'Înapoi pe stradă</button>' + (window.SCO && SCO.ok ? '<button class="btn" type="button" data-a="exit">' + I.exit + 'Ieși din curs</button>' : '') + '</div>' +
        '</div></div></div>';
    },
    init: function (el) {
      var st = A.st();
      $('#dname', el).addEventListener('input', function (e) { st.name = e.target.value.slice(0, 40); A.save(); });
      $$('[data-like]', el).forEach(function (b) {
        b.onclick = function () { st.like = +b.dataset.like; $$('[data-like]', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); A.sfx('pop'); A.clip('9.0:thanks'); A.interaction('feedback_placut', 'likert', String(st.like), 'neutral', 'Ți-a plăcut atelierul? 3 = mult, 2 = da, 1 = așa și așa'); A.save(); };
      });
      $$('[data-a]', el).forEach(function (b) { b.onclick = function () { var k = b.dataset.a; if (k === 'hub') A.go('0.2'); else if (k === 'exit') A.exit(); else A.printDiploma(); }; });
      A.on('narrEnd', function () { if (st.like === null || st.like === undefined) A.clip('9.0:like'); });
      if (A.allDone()) A.later(function () { A.confetti(); A.sfx('star'); }, 600);
    }
  };

  /* ---------- pentru adulți ---------- */
  SCR.adults = {
    html: function (s) {
      var D = C.adults, tabs = [['d', 'Despre atelier'], ['f', 'Desfășurarea (50 min)'], ['k', 'Kitul de tipar'], ['u', 'Cu e-learningul în clasă'], ['b', 'Bibliografie']];
      return '<div class="wrap adults"><p class="kick">Pentru profesori și părinți</p><h1 class="t" id="t-8-0">Colțul <span class="mk">adulților</span></h1>' +
        '<div class="tabs" role="tablist">' + tabs.map(function (t, i) { return '<button type="button" role="tab" id="tab-' + t[0] + '" aria-controls="pane" aria-selected="' + (i === 0) + '" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
        '<div class="pane" id="pane" role="tabpanel" tabindex="0"></div></div>';
    },
    init: function (el) {
      var D = C.adults, pane = $('#pane', el), st = A.st(), CFG = window.CFG || {};
      function bibItem(t) { return '<li>' + esc(t).replace(/\*([^*]+)\*/g, '<i>$1</i>') + '</li>'; }
      var P = {
        d: function () {
          return '<h2>Casa pe măsură · Arhitectura celor mici</h2><p><b>Atelier creat de ' + esc(C.meta.contentAuthor) + '</b>, formatoare, pentru clasele I–II (' + esc(C.meta.school) + '). ' + esc(C.meta.project) + ', ' + esc(C.meta.activity) + '. E-learning: ' + esc(C.meta.author) + ' · ' + esc(C.meta.org) + '.</p>' +
            '<p class="note"><b>Scopul.</b> ' + esc(D.scope) + '</p><h3>Obiectivele operaționale</h3><table><thead><tr><th scope="col">Obiectivul</th><th scope="col">Ce face copilul</th><th scope="col">Cum verificăm</th><th scope="col">În e-learning</th></tr></thead><tbody>' +
            D.objectives.map(function (o) { return '<tr><th scope="row">' + esc(o[0]) + '</th><td>' + esc(o[1]) + '</td><td>' + esc(o[2]) + '</td><td>' + esc(o[3]) + '</td></tr>'; }).join('') + '</tbody></table>' +
            '<h3>Discipline integrate</h3><p>Matematică și explorarea mediului · Arte vizuale și abilități practice · Comunicare în limba română · Dezvoltare personală.</p>';
        },
        f: function () {
          return '<h2>Desfășurarea atelierului în clasă</h2><p>50 de minute. Formatoarea conduce; învățătoarea ajută perechile și ține timpul. <b>Regula de aur: întâi așezăm, apoi lipim.</b></p><table><thead><tr><th scope="col">Minutul</th><th scope="col">Momentul</th><th scope="col">Ce se întâmplă</th><th scope="col">În e-learning</th></tr></thead><tbody>' +
            D.flow.map(function (o) { return '<tr><th scope="row">' + esc(o[0]) + '</th><td><b>' + esc(o[1]) + '</b></td><td>' + esc(o[2]) + '</td><td>' + esc(o[3]) + '</td></tr>'; }).join('') + '</tbody></table>' +
            '<h3>Întrebările-cheie, fără a da soluția</h3><ol><li><b>Scara:</b> „Pune cartonașul lângă ușă, cu marginea de jos pe podea. Încape clientul? Ușa e prea mică? E mult prea mare?”</li><li><b>Lumina:</b> „Când e treaz clientul? Când doarme? Ce lumină îi trebuie în cameră când doarme?”</li><li><b>Nivelul:</b> „Unde stă clientul: deasupra pământului, sus sau sub pământ? Unde lipiți casa pe planșă?”</li><li><b>Umbra · spațiul:</b> girafa: „Cum îi faceți umbră?”; liliacul: „Unde stă toată colonia?”; suricata: „Pe unde fuge înăuntru, dacă vine un pericol?”</li></ol>' +
            '<p class="note">Perechile rapide: al doilea nivel sub pământ, turnul de pază al suricatei, o grădină pe acoperiș, mobilierul clientului. Perechile care taie mai încet: piesele mari; întâi doar baza, ușa și acoperișul.</p>';
        },
        k: function () {
          return '<h2>Kitul de tipar</h2><p>Fișierele atelierului, gata de tipar (la 100%, fără „potrivire în pagină”: animalele de pe cartonașe au aceeași scară cu piesele).</p>' + A.kitDl(true) +
            '<p style="margin-top:12px">Pe masă, în plus: hârtie colorată A4 (2 coli pe pereche, pentru pereți și camere), foarfece cu vârf rotunjit, lipici stick, carioci.</p>';
        },
        u: function () {
          return '<h2>Cum folosiți e-learningul</h2><ol><li><b>Înainte de atelier</b>, la tablă (proiector): lecțiile 1–2 ca introducere, apoi copiii lucrează pe hârtie, cu kitul.</li><li><b>Pe tabletă, câte doi:</b> lecțiile 1–5 durează 5–8 minute fiecare; lecția 6 (constructorul) 10–15 minute. Un copil alege piesele, celălalt le așază; apoi schimbă rolurile.</li><li><b>Acasă, cu părinții:</b> constructorul se poate relua oricând; casa se salvează ca imagine sau se tipărește.</li><li><b>Clasa a II-a:</b> ecranul 3.6 (fereastra-gol) și carioca din constructor pentru cuvintele-cheie (O7, O8).</li></ol>' +
            '<h3>Accesibilitate</h3><p>Totul are voce; textul de pe ecran e scurt și în fontul Andika, gândit pentru cititorii începători. Fiecare joc cu tragere are și varianta „atinge, apoi atinge”; pe tastatură: Tab, Enter, săgeți. Subtitrarea se pornește din meniu.</p>' +
            '<h3>LMS</h3><p>SCORM 2004 (ediția a 3-a). Cursul e „completed/passed” când copilul primește toate cele 6 stele (ajunge la recapitularea fiecărei lecții). Scorul este informativ (jocuri rezolvate din prima). Casa, alegerile și explicația copilului se salvează în LMS (suspend_data și interactions). Nu se cer date personale; numele de pe diplomă este opțional.</p>';
        },
        b: function () {
          var tch = (CFG.bibSupl || []);
          return '<h2>Bibliografie</h2>' + (tch.length ? '<h3>Recomandate de profesor</h3><ol>' + tch.map(bibItem).join('') + '</ol>' : '') +
            D.bib.map(function (sec) { return '<h3>' + esc(sec.h) + '</h3><ol>' + sec.items.map(bibItem).join('') + '</ol>'; }).join('') +
            '<h3>Lecturile mele</h3><ol id="myb">' + ((st.notes || []).map(function (n, i) { return '<li>' + esc(n) + ' <button class="btn" style="min-height:36px;padding:2px 10px;font-size:14px" type="button" data-del="' + i + '" aria-label="Șterge: ' + esc(n) + '">✕</button></li>'; }).join('') || '<li style="list-style:none;margin-left:-1.4em;color:var(--mute)">Adaugă aici cărți sau site-uri pe care le recomanzi.</li>') + '</ol>' +
            '<form id="mybf"><label class="sr" for="mybi">Adaugă o lectură</label><input id="mybi" type="text" maxlength="300" placeholder="Autor, titlu, editură, an"><button class="btn" type="submit">Adaugă</button></form>' +
            '<p style="font-size:.9em;color:var(--ink2);margin-top:10px">Profesorii pot adăuga lecturi pentru toți elevii în <code>js/config.js</code> (câmpul <code>bibSupl</code>).</p>';
        }
      };
      function show(t) {
        $$('[role=tab]', el).forEach(function (b) { b.setAttribute('aria-selected', b.dataset.t === t ? 'true' : 'false'); });
        pane.setAttribute('aria-labelledby', 'tab-' + t);
        pane.innerHTML = P[t]();
        var f = $('#mybf', pane);
        if (f) {
          f.onsubmit = function (e) { e.preventDefault(); var v = $('#mybi', pane).value.trim(); if (!v) return; st.notes = st.notes || []; st.notes.push(v.slice(0, 300)); A.save(); show('b'); };
          $$('[data-del]', pane).forEach(function (b) { b.onclick = function () { st.notes.splice(+b.dataset.del, 1); A.save(); show('b'); }; });
        }
      }
      $$('[role=tab]', el).forEach(function (b) { b.onclick = function () { show(b.dataset.t); }; b.onkeydown = function (e) { var tabs = $$('[role=tab]', el), i = tabs.indexOf(b); if (e.key === 'ArrowRight') { tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); } if (e.key === 'ArrowLeft') { tabs[(i + tabs.length - 1) % tabs.length].focus(); tabs[(i + tabs.length - 1) % tabs.length].click(); } }; });
      show('d');
    }
  };
})();
