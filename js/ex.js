/* Casa pe măsură · jocurile (exercițiile) – toate se fac cu atingere, cu tragere sau de la tastatură */
(function () {
  'use strict';
  var A = window.APP, C = A.C, I = A.I, $ = A.$, $$ = A.$$, esc = A.esc, SCR = A.SCR, PC = A.PC, FIG = A.FIG;
  var EX = A.EX = {};
  function shuffle(a, seed) { var r = a.slice(), s = seed || 7; for (var i = r.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; } return r; }
  function fb(el, kind, html) { var f = $('.fbk', el); if (!f) return; f.className = 'fbk ' + (kind || ''); f.innerHTML = kind ? '<span class="mark">' + (kind === 'ok' ? I.check : kind === 'no' ? I.x : I.ear) + '</span><span>' + html + '</span>' : ''; }
  A.fb = fb;
  function ck(s, k) { return s.id + ':' + k; }
  function clipText(s, k) { var c = (s.clips || []).filter(function (x) { return x.k === k; })[0]; return c ? c.t : ''; }
  function say(s, k, opt) { opt = opt || {}; opt.text = opt.text || clipText(s, k); return A.clip(ck(s, k), opt); }
  function finish(el, s, k) { A.exDone(true); A.sfx('star'); if (k !== false) say(s, k || 'done'); fb(el, 'ok', esc(clipText(s, k || 'done') || 'Bravo!')); }
  /* înălțimea rămasă pentru joc (fără titlu, instrucțiune și mesaj) */
  A.fitAv = function (el) {
    var exa = $('.exa', el); if (!exa) return;
    var cs = getComputedStyle(el), pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    var top = exa.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - parseFloat(cs.paddingTop);
    var f = $('.fbk', el), fh = f ? Math.max(56, f.offsetHeight) + 14 : 0;
    var av = Math.round(el.clientHeight - pad - top - fh - 4);
    el.style.setProperty('--av', Math.max(window.innerHeight < 520 ? 150 : 230, av) + 'px');
  };
  A.whenNarr = function (fn) { if (A.narrDone()) A.later(fn, 250); else A.on('narrEnd', function () { A.later(fn, 250); }); };

  SCR.ex = {
    html: function (s, R) {
      var E = EX[s.ex];
      return '<div class="wrap"><div class="hrow">' + A.kick(s) + A.title(s) + '</div>' + (E.inst === false ? '' : '<div class="inst"><button class="say-btn" type="button" data-inst aria-label="Ascultă din nou instrucțiunea">' + I.voice + '</button><span>' + esc(s.n[s.n.length - 1]) + '</span></div>') + '<div class="exa ex-' + s.ex + '">' + E.html(s, R) + '</div>' + (E.fb === false ? '' : '<div class="fbk" role="status" aria-live="polite"></div>') + '</div>';
    },
    init: function (el, s, R) {
      var b = $('[data-inst]', el); if (b) b.onclick = function () { A.playNarr(true); };
      A.fitAv(el); A.later(function () { A.fitAv(el); }, 400);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (el.isConnected) A.fitAv(el); });
      var off = EX[s.ex].init(el, s, R);
      var rf = function () { A.fitAv(el); };
      window.addEventListener('resize', rf);
      return function () { window.removeEventListener('resize', rf); if (off) off(); };
    }
  };

  /* ---------- tragere comună (cu varianta atinge-atinge) ---------- */
  A.dragTok = function (tok, opt) {
    var sx, sy, ghost = null, moved = false, pid = null;
    tok.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false;
      try { tok.setPointerCapture(pid); } catch (er) {}
    });
    tok.addEventListener('pointermove', function (e) {
      if (pid !== e.pointerId) return;
      if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) {
        moved = true; ghost = tok.cloneNode(true); ghost.classList.add('drag'); var r = tok.getBoundingClientRect(); ghost.style.width = r.width + 'px'; ghost.style.left = r.left + 'px'; ghost.style.top = r.top + 'px';
        ghost.dataset.ox = sx - r.left; ghost.dataset.oy = sy - r.top; document.body.appendChild(ghost); tok.style.opacity = '.35'; opt.start && opt.start();
      }
      if (moved && ghost) { ghost.style.left = (e.clientX - ghost.dataset.ox) + 'px'; ghost.style.top = (e.clientY - ghost.dataset.oy) + 'px'; opt.over && opt.over(e.clientX, e.clientY); }
    });
    var end = function (e) {
      if (pid !== e.pointerId) return; pid = null;
      if (moved) { if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost); ghost = null; tok.style.opacity = ''; opt.drop && opt.drop(e.clientX, e.clientY); opt.over && opt.over(-1, -1); }
      else if (e.type === 'pointerup') opt.tap && opt.tap();
    };
    tok.addEventListener('pointerup', end); tok.addEventListener('pointercancel', end);
    tok.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opt.tap && opt.tap(); } });
  };
  function hitEl(list, x, y) { for (var i = 0; i < list.length; i++) { var r = list[i].getBoundingClientRect(); if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return list[i]; } return null; }
  A.hitEl = hitEl;

  /* ---------- 1.2 potrivire ---------- */
  EX.match = {
    html: function (s) {
      var it = function (x, side) { return '<button class="it tok" type="button" data-side="' + side + '" data-id="' + x.id + '" aria-pressed="false"><img src="' + A.src(x.img) + '" alt="' + esc(x.lab) + '"><b>' + esc(x.lab) + '</b></button>'; };
      return '<div class="match"><svg class="lines" aria-hidden="true"></svg><div class="side" role="group" aria-label="Animale">' + s.left.map(function (x) { return it(x, 'L'); }).join('') + '</div><div class="side" role="group" aria-label="Case">' + s.right.map(function (x) { return it(x, 'R'); }).join('') + '</div></div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { m: {} }), sel = null, tries = {};
      var box = $('.match', el), svg = $('svg.lines', el);
      function center(b) { var r = b.getBoundingClientRect(), R = box.getBoundingClientRect(); return [r.left - R.left + r.width / 2, r.top - R.top + r.height / 2]; }
      function lines() { var h = ''; Object.keys(E.m).forEach(function (id) { var l = $('[data-side=L][data-id="' + id + '"]', el), r = $('[data-side=R][data-id="' + id + '"]', el); if (!l || !r) return; var a = center(l), b = center(r); var mx = (a[0] + b[0]) / 2; h += '<path d="M' + a[0] + ' ' + a[1] + ' C' + mx + ' ' + a[1] + ' ' + mx + ' ' + b[1] + ' ' + b[0] + ' ' + b[1] + '"/>'; }); svg.innerHTML = h; }
      function paint() { $$('.it', el).forEach(function (b) { var d = !!E.m[b.dataset.id]; b.classList.toggle('done', d); b.disabled = d; b.setAttribute('aria-pressed', sel === b ? 'true' : 'false'); }); lines(); }
      function tryPair(a, b) {
        var L = a.dataset.side === 'L' ? a : b, R = a.dataset.side === 'L' ? b : a, ok = L.dataset.id === R.dataset.id;
        var idx = s.left.map(function (x) { return x.id; }).indexOf(L.dataset.id);
        A.first(s.id, idx, ok && !tries[L.dataset.id]);
        if (ok) { E.m[L.dataset.id] = 1; A.sfx('ok'); say(s, 'ok.' + L.dataset.id); fb(el, 'ok', esc(clipText(s, 'ok.' + L.dataset.id))); A.interaction('m1_potrivire_' + L.dataset.id, 'matching', L.dataset.id + '[.]' + R.dataset.id, 'correct'); }
        else { tries[L.dataset.id] = 1; A.sfx('no'); say(s, 'no'); fb(el, 'no', esc(clipText(s, 'no'))); [L, R].forEach(function (x) { x.classList.add('shake'); setTimeout(function () { x.classList.remove('shake'); }, 450); }); }
        sel = null; paint(); A.save();
        if (Object.keys(E.m).length === s.left.length) A.later(function () { finish(el, s); }, 1700);
      }
      $$('.it', el).forEach(function (b) {
        A.dragTok(b, {
          tap: function () { A.sfx('tap'); if (sel && sel !== b && sel.dataset.side !== b.dataset.side) tryPair(sel, b); else { sel = (sel === b) ? null : b; paint(); } },
          drop: function (x, y) { var t = hitEl($$('.it', el).filter(function (o) { return o.dataset.side !== b.dataset.side && !o.disabled; }), x, y); if (t) tryPair(b, t); }
        });
      });
      paint(); window.addEventListener('resize', lines); setTimeout(lines, 600);
      if (Object.keys(E.m).length === s.left.length) A.exDone(true);
      return function () { window.removeEventListener('resize', lines); };
    }
  };

  /* ---------- 1.3 cunoaște clienții ---------- */
  EX.meet = {
    html: function () {
      return '<div class="meet">' + ['g', 'l', 's'].map(function (k) { var c = C.clients[k]; return '<button class="client ' + k + ' idle" type="button" data-cl="' + k + '"><span class="tag">' + I.voice + '</span><span class="art"><img src="' + A.src('poster_' + (k === 'g' ? 'girafa' : k === 'l' ? 'liliac' : 'suricata')) + '" alt=""></span><span class="nm">' + esc(c.name) + '</span><span class="q">„' + esc(c.quote) + '”</span></button>'; }).join('') + '</div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { h: {} });
      function paint() { $$('.client', el).forEach(function (b) { b.classList.toggle('heard', !!E.h[b.dataset.cl]); }); }
      $$('.client', el).forEach(function (b) {
        b.onclick = function () {
          A.sfx('tap'); var k = b.dataset.cl;
          say(s, k, { talk: b }).then(function (done) {
            E.h[k] = 1; paint(); A.save();
            if (done && Object.keys(E.h).length === 3 && !A.exDone()) finish(el, s);
          });
        };
      });
      paint(); if (Object.keys(E.h).length === 3) A.exDone(true);
    }
  };

  /* ---------- 1.5 alegere ---------- */
  EX.choice = {
    html: function (s) { return '<div class="prog" aria-hidden="true">' + s.items.map(function () { return '<i></i>'; }).join('') + '</div><div class="choice"></div>'; },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { i: 0 }), box = $('.choice', el), busy = false;
      function prog() { $$('.prog i', el).forEach(function (d, i) { d.className = i < E.i ? 'd' : i === E.i ? 'c' : ''; }); }
      function show(play) {
        prog();
        if (E.i >= s.items.length) { box.innerHTML = '<div style="grid-column:1/-1;text-align:center">' + I.star.replace('<svg', '<svg style="width:140px;height:140px"') + '</div>'; if (!A.exDone()) finish(el, s); return; }
        var it = s.items[E.i];
        box.innerHTML = '<div class="tile pop"><img src="' + A.src('semn_' + it.tile) + '" alt="Semnul de pe cartonaș"></div><div class="col"><p class="q"><button class="say-btn" type="button" data-q aria-label="Ascultă întrebarea">' + I.voice + '</button> ' + esc(it.q) + '</p>' +
          '<div class="opts">' + it.opts.map(function (o, j) { return '<button class="opt" type="button" data-j="' + j + '"><span class="oi">' + (I[o.i] || '') + '</span>' + esc(o.t) + '</button>'; }).join('') + '</div></div>';
        fb(el, '');
        $('[data-q]', box).onclick = function () { say(s, 'q' + E.i, { text: it.q }); };
        $$('.opt', box).forEach(function (b) {
          b.onclick = function () {
            if (busy) return; var j = +b.dataset.j, ok = j === it.a;
            A.first(s.id, E.i, ok);
            A.interaction('m1_semn_' + it.tile, 'choice', it.opts[j].t, ok ? 'correct' : 'incorrect', it.q);
            if (ok) {
              busy = true; b.classList.add('ok'); A.sfx('ok'); fb(el, 'ok', esc(it.ok));
              say(s, 'ok' + E.i, { text: it.ok }).then(function () { busy = false; E.i++; A.save(); show(true); });
            } else { b.classList.add('no', 'shake'); A.sfx('no'); fb(el, 'no', esc(it.no)); say(s, 'no' + E.i, { text: it.no }); setTimeout(function () { b.classList.remove('shake'); }, 450); }
          };
        });
        if (play) A.later(function () { say(s, 'q' + E.i, { text: it.q }); }, 350);
      }
      show(false);
      A.whenNarr(function () { if (E.i < s.items.length) say(s, 'q' + E.i, { text: s.items[E.i].q }); });
    }
  };

  /* ---------- 1.6, 3.5 sortare ---------- */
  function tokImg(it) { return it.tile ? A.src('semn_' + it.tile) : it.piece ? A.src(it.piece) : A.src('x_' + it.art); }
  EX.sort = {
    html: function (s) {
      return '<div class="sort"><div class="pool" role="group" aria-label="Piese de așezat">' + shuffle(s.items, s.id.length * 13).map(function (it) { return '<button class="tok" type="button" data-id="' + it.id + '" aria-pressed="false"><img src="' + tokImg(it) + '" alt=""><b>' + esc(it.lab) + '</b></button>'; }).join('') + '</div>' +
        '<div class="bins">' + s.bins.map(function (b) { return '<button class="bin" type="button" data-bin="' + b.id + '" aria-label="Pune la ' + esc(b.lab) + '"><span class="who"><img src="' + A.src(b.img) + '" alt="">' + esc(b.lab) + '</span><span class="in"></span></button>'; }).join('') + '</div></div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { p: {} }), sel = null, tries = {};
      var byId = {}; s.items.forEach(function (it, i) { byId[it.id] = it; it._i = i; });
      function paint() {
        $$('.pool .tok', el).forEach(function (t) { var p = !!E.p[t.dataset.id]; t.classList.toggle('gone', p); t.hidden = p; t.setAttribute('aria-pressed', sel === t.dataset.id ? 'true' : 'false'); });
        $$('.bin', el).forEach(function (b) { var ids = Object.keys(E.p).filter(function (k) { return E.p[k] === b.dataset.bin; }); $('.in', b).innerHTML = ids.map(function (k) { return '<img src="' + tokImg(byId[k]) + '" alt="' + esc(byId[k].lab) + '">'; }).join(''); });
      }
      function put(id, bin) {
        var it = byId[id], ok = it.a === bin;
        A.first(s.id, it._i, ok && !tries[id]);
        var B = $('[data-bin="' + bin + '"]', el);
        if (ok) { E.p[id] = bin; sel = null; A.sfx('ok'); B.classList.add('okflash'); setTimeout(function () { B.classList.remove('okflash'); }, 700); say(s, 'ok.' + id, { text: it.ok }); fb(el, 'ok', esc(it.ok)); A.interaction(s.id.replace('.', '_') + '_' + id, 'matching', id + '[.]' + bin, 'correct'); }
        else { tries[id] = 1; A.sfx('no'); B.classList.add('shake'); setTimeout(function () { B.classList.remove('shake'); }, 450); say(s, 'no'); fb(el, 'no', esc(clipText(s, 'no'))); }
        paint(); A.save();
        if (Object.keys(E.p).length === s.items.length) A.later(function () { finish(el, s); }, 1900);
      }
      $$('.pool .tok', el).forEach(function (t) {
        A.dragTok(t, {
          tap: function () { sel = sel === t.dataset.id ? null : t.dataset.id; paint(); if (sel) say(s, 'lab.' + sel, { text: byId[sel].lab }); },
          over: function (x, y) { $$('.bin', el).forEach(function (b) { b.classList.toggle('hot', b === hitEl([b], x, y)); }); },
          drop: function (x, y) { var b = hitEl($$('.bin', el), x, y); if (b) put(t.dataset.id, b.dataset.bin); }
        });
      });
      $$('.bin', el).forEach(function (b) { b.onclick = function () { if (sel) put(sel, b.dataset.bin); else { fb(el, 'info', 'Atinge întâi o piesă de sus.'); } }; });
      paint(); if (Object.keys(E.p).length === s.items.length) A.exDone(true);
    }
  };

  /* ---------- 2.3 ușile ---------- */
  EX.doors = {
    html: function (s) { return '<div class="prog" aria-hidden="true">' + s.rounds.map(function () { return '<i></i>'; }).join('') + '</div><div class="doors"><div class="doorscene" role="group" aria-label="Uși de măsurat"></div></div>'; },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { r: 0 }), sc = $('.doorscene', el), busy = false, tries = {};
      function prog() { $$('.prog i', el).forEach(function (d, i) { d.className = i < E.r ? 'd' : i === E.r ? 'c' : ''; }); }
      function round(play) {
        prog(); fb(el, '');
        if (E.r >= s.rounds.length) { sc.innerHTML = '<div style="position:absolute;inset:0;display:grid;place-items:center">' + I.star.replace('<svg', '<svg style="width:150px;height:150px"') + '</div>'; if (!A.exDone()) finish(el, s); return; }
        var R = s.rounds[E.r], cl = R.client, F = FIG[cl];
        if (R.kind === 'fly') {
          var H = 11;
          sc.innerHTML = '<div style="position:absolute;left:50%;bottom:21.5%;translate:-50% 0;width:' + (10 / H * 78) + '%;height:' + (6 / H * 78) + '%;background:#FFE7C2;border:3px solid var(--ink);border-bottom:none"></div>' +
            '<div style="position:absolute;left:50%;bottom:calc(21.5% + ' + (6 / H * 78) + '%);translate:-50% 0;width:' + (11 / H * 78) + '%;height:' + (3.3 / H * 78) + '%"><img src="' + A.src('a37') + '" alt="" style="width:100%;height:100%"></div>' +
            '<button class="dr" type="button" data-k="no" style="position:absolute;left:36%;bottom:21.5%;height:' + (5 / H * 78) + '%" aria-label="Ușa cea mare, jos"><img src="' + A.src('b42') + '" alt=""></button>' +
            '<button class="dr" type="button" data-k="no" style="position:absolute;left:56%;bottom:21.5%;height:' + (2.5 / H * 78) + '%" aria-label="Ușa mică, jos"><img src="' + A.src('a65') + '" alt=""></button>' +
            '<button class="dr" type="button" data-k="ok" style="position:absolute;left:48%;bottom:calc(21.5% + ' + (6.6 / H * 78) + '%);height:' + (1.25 / H * 78) + '%" aria-label="Gaura mică și rotundă, sus, sub acoperiș"><img src="' + A.src('a50') + '" alt=""></button>' +
            '<div class="who bat" style="left:6%;bottom:60%;height:' + (2.4 / H * 78) + '%;transition:left 1s ease-in-out,bottom 1s ease-in-out"><img src="' + A.src('m_liliac_nobar') + '" alt="Liliacul" style="height:100%;width:auto;transform:rotate(180deg)"></div>';
          var bat = $('.who', sc);
          $$('.dr', sc).forEach(function (d) {
            d.onclick = function () {
              if (busy) return; var ok = d.dataset.k === 'ok';
              A.first(s.id, E.r, ok && !tries[E.r]);
              if (ok) {
                busy = true; d.classList.add('ok'); A.sfx('whoosh'); var r = d.getBoundingClientRect(), R0 = sc.getBoundingClientRect();
                bat.style.left = ((r.left - R0.left) / R0.width * 100) + '%'; bat.style.bottom = ((R0.bottom - r.bottom) / R0.height * 100) + '%';
                fb(el, 'ok', esc(clipText(s, 'l.ok')));
                say(s, 'l.ok').then(function () { busy = false; E.r++; A.save(); round(true); });
              } else { tries[E.r] = 1; d.classList.add('bad'); A.sfx('no'); fb(el, 'no', esc(clipText(s, 'l.no'))); say(s, 'l.no'); setTimeout(function () { d.classList.remove('bad'); }, 900); }
            };
          });
          if (play) A.later(function () { A.clip(ck(s, R.intro.k), { text: R.intro.t }); }, 300);
          return;
        }
        var doors = R.doors.map(function (id) { return PC[id]; }), maxH = Math.max(F.h, Math.max.apply(null, doors.map(function (d) { return d.h; })));
        var H = maxH / 0.62;
        var row = '<div class="row">' + doors.map(function (d) { return '<button class="dr" type="button" data-id="' + d.id + '" style="height:' + (d.h / H * 100 / 0.785) + '%;aspect-ratio:' + (d.w / d.h) + '"><span class="sr">Ușa </span><img src="' + A.src(d.id) + '" alt=""><span class="lab">' + String(Math.round(d.h * 10) / 10).replace('.', ',') + ' cm</span><span class="sr"> (' + esc(d.n) + ')</span></button>'; }).join('') + '</div>';
        sc.innerHTML = row + '<div class="who" style="left:2%;height:' + (F.h / H * 100) + '%"><img src="' + F.src + '" alt="' + esc(C.clients[cl].name) + ', mărimea mea"></div><div class="meas" hidden></div>';
        // înălțimea rândului: ușile stau pe podea (rândul e poziționat la 21.5% de jos)
        $('.row', sc).style.height = '78.5%';
        var who = $('.who', sc), meas = $('.meas', sc);
        var placeRow = function () { var ww = who.getBoundingClientRect().width / Math.max(1, sc.clientWidth) * 100; $('.row', sc).style.left = Math.min(40, ww + 5) + '%'; };
        placeRow(); setTimeout(placeRow, 300);
        $$('.dr', sc).forEach(function (d) {
          d.onclick = function () {
            if (busy) return; busy = true; A.sfx('tap');
            var P = PC[d.dataset.id], r = d.getBoundingClientRect(), R0 = sc.getBoundingClientRect(), wr = who.getBoundingClientRect();
            var left = (r.right - R0.left + 6) / R0.width * 100; if (left * R0.width / 100 + wr.width > R0.width) left = (r.left - R0.left - wr.width - 6) / R0.width * 100;
            who.style.left = left + '%';
            $$('.dr', sc).forEach(function (x) { x.classList.remove('ok', 'bad'); });
            var res = P.h < F.h ? 'small' : P.h > F.h * 1.5 ? 'big' : 'ok';
            setTimeout(function () {
              meas.hidden = false; var top = R0.bottom - R0.height * 0.215 - wr.height;
              meas.style.top = (top - R0.top) / R0.height * 100 + '%'; meas.style.left = Math.min(r.left, R0.left + left / 100 * R0.width) - R0.left - 8 + 'px'; meas.style.width = (r.width + wr.width + 30) + 'px';
              meas.style.borderTopColor = res === 'ok' ? 'var(--green)' : res === 'small' ? 'var(--red)' : 'var(--orange)';
              who.classList.toggle('bend', res === 'small');
              d.classList.add(res === 'ok' ? 'ok' : 'bad');
              var key = cl + '.' + res; if (!VO_has(ck(s, key))) key = cl + '.' + (res === 'ok' ? 'ok' : 'small');
              A.first(s.id, E.r, res === 'ok' && !tries[E.r]);
              A.interaction('m2_usa_' + cl, 'choice', P.id + ' ' + P.h + 'cm', res === 'ok' ? 'correct' : 'incorrect', 'Ușa pe măsura clientului: ' + C.clients[cl].name);
              if (res === 'ok') { A.sfx('ok'); fb(el, 'ok', esc(clipText(s, key))); say(s, key).then(function () { busy = false; E.r++; A.save(); round(true); }); }
              else { tries[E.r] = 1; A.sfx('no'); fb(el, 'no', esc(clipText(s, key))); say(s, key).then(function () { busy = false; who.classList.remove('bend'); }); }
            }, 650);
          };
        });
        if (play) A.later(function () { A.clip(ck(s, R.intro.k), { text: R.intro.t }); }, 300);
      }
      function VO_has(k) { return !!A.VO.clips[k]; }
      round(false);
      A.whenNarr(function () { if (E.r < s.rounds.length) A.clip(ck(s, s.rounds[E.r].intro.k), { text: s.rounds[E.r].intro.t }); });
    }
  };

  /* ---------- glisor vertical comun (tavan, fereastră) ---------- */
  function vdrag(handle, box, onMove, onEnd) {
    var pid = null;
    handle.addEventListener('pointerdown', function (e) { pid = e.pointerId; try { handle.setPointerCapture(pid); } catch (er) {} e.preventDefault(); });
    handle.addEventListener('pointermove', function (e) { if (pid !== e.pointerId) return; var R = box.getBoundingClientRect(); onMove((e.clientY - R.top) / R.height); });
    var up = function (e) { if (pid !== e.pointerId) return; pid = null; onEnd(); };
    handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
    handle.addEventListener('keydown', function (e) { var d = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0; if (d) { e.preventDefault(); onMove(null, d); } if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEnd(); } });
    handle.addEventListener('keyup', function (e) { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') onEnd(); });
  }

  /* ---------- 2.4 tavanul ---------- */
  EX.ceiling = {
    html: function () { return '<div class="room" aria-label="Camera cu tavan reglabil"><div class="wall"></div><div class="fig"></div><div class="ceil"><span class="grip" role="slider" tabindex="0" aria-label="Înălțimea tavanului" aria-valuemin="1" aria-valuemax="10">' + I.grip + '</span></div><span class="hint">trage tavanul ↕</span></div>'; },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { ph: 0 }), room = $('.room', el), wall = $('.wall', room), fig = $('.fig', room), ceil = $('.ceil', room), grip = $('.grip', room);
      var H = 9.4, FLOOR = 0.80, ch = 4, lowT = 0;   // cm
      function y(cm) { return (FLOOR - cm / H * FLOOR) * 100; }
      function setup() {
        var cl = E.ph === 0 ? 'g' : 's', F = FIG[cl];
        fig.innerHTML = '<img src="' + F.src + '" alt="' + esc(C.clients[cl].name) + '">'; fig.style.height = (F.h / H * FLOOR * 100) + '%'; fig.style.bottom = (100 - FLOOR * 100) + '%'; fig.style.left = '38%';
        wall.style.left = '18%'; wall.style.right = '18%'; wall.style.bottom = (100 - FLOOR * 100) + '%';
        ch = E.ph === 0 ? 4.2 : 8.6; place();
      }
      function place() {
        var F = FIG[E.ph === 0 ? 'g' : 's'];
        ceil.style.top = 'calc(' + y(ch) + '% - 22px)'; ceil.style.left = '18%'; ceil.style.right = '18%';
        wall.style.top = y(ch) + '%';
        grip.setAttribute('aria-valuenow', Math.round(ch * 10) / 10); grip.setAttribute('aria-valuetext', (Math.round(ch * 10) / 10 + ' centimetri').replace('.', ','));
        var low = ch < F.h + 0.15; fig.classList.toggle('squash', low);
        fig.style.transform = low ? 'scaleY(' + Math.max(0.35, (ch - 0.05) / F.h).toFixed(3) + ')' : '';
        if (low && E.ph === 0 && Date.now() - lowT > 2500) { lowT = Date.now(); A.sfx('no'); say(s, 'g.low'); }
      }
      vdrag(ceil, room, function (r, d) { if (d) ch += -d * 0.2; else ch = (FLOOR - r) / FLOOR * H; ch = Math.max(1.2, Math.min(H - 0.3, ch)); place(); }, function () {
        if (A.exDone()) return;
        var F = FIG[E.ph === 0 ? 'g' : 's'];
        if (E.ph === 0) {
          if (ch >= F.h + 0.15) { A.first(s.id, 0, true); A.sfx('ok'); fb(el, 'ok', esc(clipText(s, 'g.ok'))); say(s, 'g.ok').then(function () { E.ph = 1; A.save(); setup(); say(s, 's.intro'); fb(el, 'info', esc(clipText(s, 's.intro'))); }); }
          else { A.first(s.id, 0, false); fb(el, 'no', esc(clipText(s, 'g.low'))); }
        } else {
          if (ch < F.h + 0.15) { fb(el, 'no', 'Prea jos! Suricata se lovește la cap.'); A.sfx('no'); }
          else if (ch > F.h * 1.75) { A.first(s.id, 1, false); A.sfx('no'); fb(el, 'no', esc(clipText(s, 's.high'))); say(s, 's.high'); }
          else { A.first(s.id, 1, true); A.sfx('ok'); fb(el, 'ok', esc(clipText(s, 's.ok'))); say(s, 's.ok').then(function () { E.ph = 2; A.save(); finish(el, s); }); }
        }
      });
      if (E.ph >= 2) { E.ph = 1; setup(); ch = 3; place(); A.exDone(true); } else setup();
    }
  };

  /* ---------- 3.2 obloanele ---------- */
  EX.shutters = {
    html: function () {
      return '<div class="shut"><div class="scene" role="group" aria-label="Camera liliacului"><div class="beam"></div><div class="bat"><img src="' + A.src('m_liliac') + '" alt="Liliacul, agățat de bară"></div><span class="zz" aria-hidden="true">z z z</span>' +
        '<div class="sky"><span class="sun">' + I.sun + '</span><span class="moon">' + I.moon + '</span></div>' +
        '<button class="sh l" type="button" aria-pressed="false" aria-label="Oblonul din stânga"></button><button class="sh r" type="button" aria-pressed="false" aria-label="Oblonul din dreapta"></button></div>' +
        '<div class="meter"><p class="say" style="transform:none" id="shs">E zi. Liliacul vrea să doarmă.</p></div></div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = {}), sc = $('.scene', el), l = $('.sh.l', el), r = $('.sh.r', el), phase = 0, msg = $('#shs', el);
      function closed(b) { return b.classList.contains('closed'); }
      function upd() {
        [l, r].forEach(function (b) { b.setAttribute('aria-pressed', closed(b) ? 'true' : 'false'); b.setAttribute('aria-label', (b === l ? 'Oblonul din stânga, ' : 'Oblonul din dreapta, ') + (closed(b) ? 'închis' : 'deschis')); });
        var both = closed(l) && closed(r), none = !closed(l) && !closed(r);
        if (phase === 0) { sc.classList.toggle('dark', both); if (both) { phase = 1; A.first(s.id, 0, true); A.sfx('ok'); msg.textContent = 'Întuneric: liliacul doarme.'; fb(el, 'ok', esc(clipText(s, 'sleep'))); say(s, 'sleep').then(function () { A.later(function () { phase = 2; sc.classList.add('night'); msg.textContent = 'S-a făcut seară!'; fb(el, 'info', esc(clipText(s, 'night'))); say(s, 'night'); }, 600); }); } }
        else if (phase === 2) { sc.classList.toggle('dark', !none); if (none) { phase = 3; A.sfx('whoosh'); $('.bat', el).classList.add('fly'); msg.textContent = 'Noapte: liliacul zboară.'; fb(el, 'ok', esc(clipText(s, 'fly'))); say(s, 'fly').then(function () { E.done = 1; A.save(); finish(el, s); }); } }
      }
      [l, r].forEach(function (b) { b.onclick = function () { if (phase === 1 || phase === 3) return; A.sfx('snap'); b.classList.toggle('closed'); upd(); }; });
      A.whenNarr(function () { if (phase === 0) say(s, 'bright'); });
      if (E.done) A.exDone(true);
    }
  };

  /* ---------- 3.3 fereastra la ochi ---------- */
  EX.winheight = {
    html: function () { return '<div class="room" aria-label="Peretele casei"><div class="wall"></div><div class="fig"></div><div class="eye"><span>ochii</span></div><div class="win" role="slider" tabindex="0" aria-label="Înălțimea ferestrei"></div><span class="hint">trage fereastra ↕</span></div>'; },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { ph: 0 }), room = $('.room', el), wall = $('.wall', room), fig = $('.fig', room), win = $('.win', room), eye = $('.eye', room);
      var H = 9.4, FLOOR = 0.80, wy = 1;
      var P = { g: { eye: 6.0, w: 'a58' }, s: { eye: 1.8, w: 'a57' } };
      function cl() { return E.ph === 0 ? 'g' : 's'; }
      function setup() {
        var c = cl(), F = FIG[c], W = PC[P[c].w];
        wall.style.cssText = 'left:14%;right:14%;top:' + ((FLOOR - 8.2 / H * FLOOR) * 100) + '%;bottom:' + (100 - FLOOR * 100) + '%';
        fig.innerHTML = '<img src="' + F.src + '" alt="' + esc(C.clients[c].name) + '">'; fig.style.height = (F.h / H * FLOOR * 100) + '%'; fig.style.bottom = (100 - FLOOR * 100) + '%'; fig.style.left = '20%';
        win.innerHTML = '<img src="' + A.src(W.id) + '" alt="Fereastra">'; win.style.width = (W.w / H * FLOOR * room.clientHeight) + 'px'; win.style.height = (W.h / H * FLOOR * 100) + '%'; win.style.left = '55%';
        eye.style.top = ((FLOOR - P[c].eye / H * FLOOR) * 100) + '%'; eye.style.left = '14%'; eye.style.right = '14%';
        wy = c === 'g' ? 2.0 : 5.6; place();
      }
      function place() { var W = PC[P[cl()].w]; win.style.top = ((FLOOR - (wy + W.h) / H * FLOOR) * 100) + '%'; win.setAttribute('aria-valuenow', Math.round(wy * 10) / 10); win.setAttribute('aria-valuetext', ('fereastra la ' + Math.round(wy * 10) / 10 + ' centimetri de la podea').replace('.', ',')); }
      vdrag(win, room, function (r, d) { var W = PC[P[cl()].w]; if (d) wy += -d * 0.2; else wy = (FLOOR - r) / FLOOR * H - W.h / 2; wy = Math.max(0, Math.min(8.2 - W.h, wy)); place(); }, function () {
        if (A.exDone()) return;
        var c = cl(), W = PC[P[c].w], ok = wy <= P[c].eye && wy + W.h >= P[c].eye;
        if (ok) {
          A.first(s.id, E.ph, true); A.sfx('ok'); fb(el, 'ok', esc(clipText(s, c + '.ok')));
          say(s, c + '.ok').then(function () { if (E.ph === 0) { E.ph = 1; A.save(); setup(); say(s, 's.intro'); fb(el, 'info', esc(clipText(s, 's.intro'))); } else { E.ph = 2; A.save(); finish(el, s); } });
        } else { A.first(s.id, E.ph, false); A.sfx('no'); fb(el, 'no', wy > P[c].eye ? 'Prea sus! Clientul nu ajunge să privească afară.' : 'Prea jos! Ochii clientului sunt mai sus.'); }
      });
      if (E.ph >= 2) { E.ph = 1; A.exDone(true); }
      setTimeout(setup, 60); window.addEventListener('resize', setup);
      return function () { window.removeEventListener('resize', setup); };
    }
  };

  /* ---------- 3.6 ordinea pașilor ---------- */
  EX.seq = {
    html: function (s) {
      var order = shuffle(s.steps.map(function (x, i) { return i; }), 5);
      if (order.join('') === '0123') order = [2, 0, 3, 1];
      return '<div class="seq"><div class="steps" role="group" aria-label="Pașii ferestrei-gol, amestecați">' + order.map(function (i) { var x = s.steps[i]; return '<button class="step" type="button" data-i="' + i + '"><span class="n" aria-hidden="true"></span><img src="' + A.src(x.img) + '" alt=""><small>' + esc(x.t) + '</small></button>'; }).join('') + '</div>' +
        '<div class="photos" hidden>' + s.photos.map(function (p) { return A.ph(p, { r: 'r43' }); }).join('') + '</div></div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { k: 0 }), tried = false;
      function paint() { $$('.step', el).forEach(function (b) { var i = +b.dataset.i; b.classList.toggle('done', i < E.k); $('.n', b).textContent = i + 1; }); if (E.k >= 4) $('.photos', el).hidden = false; }
      $$('.step', el).forEach(function (b) {
        b.onclick = function () {
          var i = +b.dataset.i; if (i < E.k) { say(s, 's' + (i + 1)); return; }
          if (i === E.k) { A.sfx('ok'); E.k++; paint(); A.save(); fb(el, 'ok', esc(clipText(s, 's' + E.k))); say(s, 's' + E.k).then(function () { if (E.k >= 4 && !A.exDone()) { A.first(s.id, 0, !tried); A.interaction('m3_fereastra_gol', 'sequencing', '1,2,3,4', tried ? 'incorrect' : 'correct', 'Ordinea pașilor ferestrei-gol'); finish(el, s); } }); }
          else { tried = true; A.sfx('no'); b.classList.add('shake'); setTimeout(function () { b.classList.remove('shake'); }, 450); fb(el, 'no', esc(clipText(s, 'no'))); say(s, 'no'); }
        };
      });
      paint(); if (E.k >= 4) A.exDone(true);
    }
  };

  /* ---------- 4.3 du clienții acasă ---------- */
  EX.place = {
    html: function () {
      var W = 18.6, H = 14, g = 8.0;
      var zones = [
        { id: 'l', x: 6.4, y: .9, w: 5.8, h: 2.4, lab: 'sus, în pod' },
        { id: 'g', x: 5.6, y: g - 4.2, w: 7.4, h: 4.2, lab: 'pe pământ' },
        { id: 's', x: 5.9, y: g + 1.6, w: 6.8, h: 3.2, lab: 'sub pământ' }
      ];
      var scene = A.kitScene({ W: W, H: H, ground: g, items: [
        { wall: '#FFE7C2', x: 5.4, y: g - 4.4, w: 7.8, h: 4.4 }, { p: 'b36', x: 5.8, y: g - 7.85, w: 7, h: 3.45 }, { p: 'b66', x: 6.4, y: g - 7.2 + 2.2 - 2.0, w: 5.8, h: .45 },
        { wall: '#F6D9A8', x: 5.7, y: g + 1.4, w: 7.2, h: 3.6, round: true }, { p: 'a73', x: 14.6, bottom: g }, { html: I.sun, x: 15.6, y: .5, w: 2.2, h: 2.2 }
      ], extra: zones.map(function (z) { return '<div class="zone" data-z="' + z.id + '" style="left:' + (z.x / W * 100) + '%;top:' + ((z.id === 'l' ? g - 7.0 : z.y) / H * 100) + '%;width:' + (z.w / W * 100) + '%;height:' + (z.h / H * 100) + '%"><span class="zl">' + z.lab + '</span></div>'; }).join('') });
      return '<div class="placegame"><div class="board-mini" style="background:none;border:none;min-height:0"><div role="group" aria-label="Planșa cu pod, parter și o cameră sub pământ" style="border:3px solid var(--ink);border-radius:20px;overflow:hidden">' + scene + '</div></div>' +
        '<div class="tray3" role="group" aria-label="Clienții">' + ['g', 'l', 's'].map(function (k) { return '<button class="tok" type="button" data-cl="' + k + '" aria-pressed="false"><img src="' + FIG[k].src + '" alt="">' + esc(C.clients[k].name) + '</button>'; }).join('') + '</div></div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { p: {} }), sel = null, tries = {};
      function paint() {
        $$('.tray3 .tok', el).forEach(function (t) { t.hidden = !!E.p[t.dataset.cl]; t.setAttribute('aria-pressed', sel === t.dataset.cl ? 'true' : 'false'); });
        $$('.zone', el).forEach(function (z) { var k = z.dataset.z; var im = $('img.placed', z); if (E.p[k] && !im) z.insertAdjacentHTML('beforeend', '<img class="placed pop" src="' + FIG[k].src + '" alt="' + esc(C.clients[k].name) + '"' + (k === 'l' ? ' style="height:80%;align-self:flex-start;margin-top:4%"' : '') + '>'); });
      }
      function put(cl, z) {
        var ok = cl === z, idx = ['g', 'l', 's'].indexOf(cl);
        A.first(s.id, idx, ok && !tries[cl]);
        if (ok) { E.p[cl] = 1; sel = null; A.sfx('drop'); fb(el, 'ok', esc(clipText(s, cl + '.ok'))); say(s, cl + '.ok'); A.interaction('m4_nivel_' + cl, 'choice', z, 'correct'); }
        else { tries[cl] = 1; A.sfx('no'); fb(el, 'no', esc(clipText(s, cl + '.no'))); say(s, cl + '.no'); var Z = $('[data-z="' + z + '"]', el); Z.classList.add('shake'); setTimeout(function () { Z.classList.remove('shake'); }, 450); }
        paint(); A.save();
        if (Object.keys(E.p).length === 3) A.later(function () { finish(el, s); }, 2200);
      }
      $$('.tray3 .tok', el).forEach(function (t) {
        A.dragTok(t, {
          tap: function () { sel = sel === t.dataset.cl ? null : t.dataset.cl; paint(); if (sel) fb(el, 'info', 'Acum atinge locul pentru ' + esc(C.clients[sel].name.toLowerCase()) + '.'); },
          over: function (x, y) { $$('.zone', el).forEach(function (z) { z.classList.toggle('hot', z === hitEl([z], x, y)); }); },
          drop: function (x, y) { var z = hitEl($$('.zone', el), x, y); if (z) put(t.dataset.cl, z.dataset.z); }
        });
      });
      $$('.zone', el).forEach(function (z) { z.setAttribute('role', 'button'); z.setAttribute('tabindex', '0'); z.setAttribute('aria-label', 'Locul: ' + $('.zl', z).textContent); var go = function () { if (sel && !E.p[z.dataset.z]) put(sel, z.dataset.z); }; z.onclick = go; z.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }; });
      paint(); if (Object.keys(E.p).length === 3) A.exDone(true);
    }
  };

  /* ---------- 4.4, 5.6 atinge în imagine ---------- */
  var HS = {
    street: function () {
      var W = 18.6, H = 15, g = 8.6;
      var hs = function (id, x, y, w, h, lab) { return '<button class="hs" type="button" data-hs="' + id + '" style="left:' + (x / W * 100) + '%;top:' + (y / H * 100) + '%;width:' + (w / W * 100) + '%;height:' + (h / H * 100) + '%" aria-label="' + lab + '"></button>'; };
      return '<div class="pane p-street">' + A.kitScene({ W: W, H: H, ground: g, items: [
        { wall: '#CFE6FF', x: 4.5, y: g - 5.4, w: 6.6, h: 5.4 }, { p: 'a37', x: 3.0, y: g - 8.4, w: 9.64, h: 3.04 }, { p: 'b66', x: 5.0, y: g - 6.2, w: 5.4, h: .4 },
        { fig: 'l', x: 6.8, y: g - 5.9, h: 1.7 }, { p: 'b51', x: 9.0, bottom: g }, { p: 'a58', x: 5.2, y: g - 4.3 },
        { p: 'a42', x: 14.0, bottom: g, w: .6, h: 3.4 }, { p: 'a61', x: 13.2, y: g - 5.6 },
        { p: 'a69', x: 1.0, y: .8 }, { html: I.sun, x: 14.8, y: .4, w: 2.8, h: 2.8 },
        { wall: '#F6D9A8', x: 5.0, y: g + 2.0, w: 6.4, h: 3.0, round: true }, { fig: 's', x: 7.4, y: g + 2.4, h: 2.1 }, { p: 'a73', x: 1.4, bottom: g }
      ], extra: hs('soare', 14.6, .2, 3.2, 3.2, 'soarele') + hs('nor', .8, .5, 3.4, 2.1, 'norul') + hs('liliac', 6.2, g - 6.4, 2.8, 2.6, 'liliacul') + hs('usa', 8.7, g - 2.8, 1.8, 2.8, 'ușa') + hs('copac', 12.8, g - 5.8, 3.2, 5.8, 'copacul') + hs('suricata', 5.2, g + 2.0, 6.0, 3.0, 'suricata') + hs('fereastra', 5.0, g - 4.5, 2.8, 2.6, 'fereastra') + hs('iarba', 1.2, g - 1.6, 2.6, 1.6, 'iarba') }) + '</div>';
    },
    examples: function () {
      var p = function (n, list) { return '<div class="pane p-ex">' + A.img(n) + list.map(function (h) { return '<button class="hs" type="button" data-hs="' + h[0] + '" style="left:' + (h[1] / 686 * 100) + '%;top:' + (h[2] / 816 * 100) + '%;width:' + (h[3] / 686 * 100) + '%;height:' + (h[4] / 816 * 100) + '%" aria-label="' + h[5] + '"></button>'; }).join('') + '</div>'; };
      return p('ex1', [['acop', 295, 30, 355, 110, 'acoperișul roșu, un triunghi'], ['trapez', 18, 100, 295, 80, 'acoperișul pridvorului, un trapez'], ['cerc', 405, 200, 67, 67, 'fereastra rotundă galbenă'], ['cerc', 530, 230, 52, 52, 'geamul rotund al ușii'], ['stalp', 0, 200, 52, 272, 'stâlpul din stânga'], ['stalp', 210, 200, 52, 272, 'stâlpul din dreapta'], ['usa', 500, 205, 112, 268, 'ușa cea mare'], ['tri', 338, 128, 155, 62, 'triunghiurile mici'], ['girafa', 58, 225, 122, 250, 'girafa']]) +
        p('ex3', [['deal', 184, 317, 310, 155, 'dealul, un semicerc'], ['cerc', 222, 378, 52, 52, 'fereastra rotundă roz'], ['cerc', 402, 378, 52, 52, 'fereastra rotundă galbenă'], ['usa', 295, 375, 90, 100, 'ușa în arc'], ['arc', 505, 385, 100, 90, 'arcada roz'], ['cam', 5, 530, 222, 100, 'o cameră sub pământ'], ['cam', 265, 530, 235, 100, 'altă cameră sub pământ']]);
    }
  };
  EX.hotspot = {
    html: function (s) { return '<div class="hot"><p class="hq"><button class="say-btn" type="button" data-q aria-label="Ascultă întrebarea">' + I.voice + '</button><span id="hq"></span><span class="prog" aria-hidden="true">' + s.items.map(function () { return '<i></i>'; }).join('') + '</span></p><div class="hscene">' + HS[s.scene]() + '</div></div>'; },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { i: 0 }), busy = false, tried = {};
      function prog() { $$('.prog i', el).forEach(function (d, i) { d.className = i < E.i ? 'd' : i === E.i ? 'c' : ''; }); }
      function show(play) {
        prog(); $$('.hs', el).forEach(function (h) { h.classList.remove('ok', 'bad'); });
        if (E.i >= s.items.length) { $('#hq', el).textContent = 'Gata!'; if (!A.exDone()) finish(el, s); return; }
        var it = s.items[E.i]; $('#hq', el).textContent = it.q;
        if (play) A.later(function () { say(s, 'q' + E.i, { text: it.q }); }, 400);
      }
      $('[data-q]', el).onclick = function () { if (E.i < s.items.length) say(s, 'q' + E.i, { text: s.items[E.i].q }); };
      $$('.hs', el).forEach(function (h) {
        h.onclick = function () {
          if (busy || E.i >= s.items.length) return; var it = s.items[E.i], ok = it.a.indexOf(h.dataset.hs) >= 0;
          if (ok) {
            busy = true; A.first(s.id, E.i, !tried[E.i]); A.sfx('ok'); $$('.hs[data-hs="' + h.dataset.hs + '"]', el).forEach(function (x) { x.classList.add('ok'); }); fb(el, 'ok', esc(it.ok));
            A.interaction(s.id.replace('.', '_') + '_q' + E.i, 'choice', h.dataset.hs, 'correct', it.q);
            say(s, 'ok' + E.i, { text: it.ok }).then(function () { busy = false; E.i++; A.save(); show(true); });
          } else { tried[E.i] = 1; A.sfx('no'); h.classList.add('bad'); setTimeout(function () { h.classList.remove('bad'); }, 700); fb(el, 'no', esc(clipText(s, 'no'))); say(s, 'no'); }
        };
      });
      show(false);
      A.whenNarr(function () { if (E.i < s.items.length) say(s, 'q' + E.i, { text: s.items[E.i].q }); });
    }
  };

  /* ---------- 5.2 bara coloniei ---------- */
  EX.bar = {
    html: function (s) {
      return '<div class="barg"><div class="attic" role="img" aria-label="Podul liliecilor"><div class="roofl"></div><div class="floor"></div><div class="rail"></div>' + [0, 1, 2, 3, 4].map(function (i) { return '<div class="bat wait" data-b="' + i + '" style="left:' + (5 + i * 6.5) + '%;top:70%;width:' + (0.78 / 14 * 100) + '%"><img src="' + A.src('m_liliac_nobar') + '" alt=""></div>'; }).join('') + '</div>' +
        '<div class="opts" role="group" aria-label="Barele">' + s.bars.map(function (b) { var P = PC[b]; return '<button class="opt" type="button" data-b="' + b + '"><img src="' + A.src(b) + '" alt="" style="' + (P.h > P.w ? 'transform:rotate(90deg);height:18px;width:auto;max-width:none' : '') + '"><span>' + String(Math.round(Math.max(P.w, P.h) * 10) / 10).replace('.', ',') + ' cm</span></button>'; }).join('') + '</div></div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = {}), busy = false, tried = false, att = $('.attic', el), bar = $('.rail', el);
      var SW = 14, BW = 0.78, GAP = 0.26;   // scena are 14 cm lățime
      $$('.opts .opt', el).forEach(function (b) {
        b.onclick = function () {
          if (busy) return; busy = true;
          var P = PC[b.dataset.b], L = Math.max(P.w, P.h), need = 5 * BW + 4 * GAP;
          bar.innerHTML = '<img src="' + A.src(P.id) + '" alt="" style="' + (P.h > P.w ? 'transform:rotate(90deg);transform-origin:0 0;translate:0 0' : '') + '">';
          bar.style.width = (L / SW * 100) + '%';
          if (P.h > P.w) { bar.innerHTML = '<div style="height:12px;background:#C5884A;border:2px solid var(--ink);border-radius:3px"></div>'; }
          var bl = 50 - L / SW * 50, ok = L >= need;
          $$('.bat', el).forEach(function (bt, i) {
            bt.classList.remove('fall', 'wait');
            var x = bl + (L - need) / 2 / SW * 100 + i * (BW + GAP) / SW * 100;
            var fits = (i + 1) * BW + i * GAP <= L + 0.01;
            setTimeout(function () {
              if (fits) { bt.style.left = x + '%'; bt.style.top = 'calc(26% + 4px)'; }
              else { bt.style.left = (bl + L / SW * 100 + 1.5 + (i - 3) * 6) + '%'; bt.style.top = 'calc(26% + 4px)'; setTimeout(function () { bt.classList.add('fall'); }, 700); }
              A.sfx('pop');
            }, i * 260);
          });
          A.first(s.id, 0, ok && !tried);
          A.interaction('m5_bara_colonie', 'choice', P.id + ' ' + L + 'cm', ok ? 'correct' : 'incorrect', 'Bara pentru 5 lilieci');
          setTimeout(function () {
            if (ok) { var k = L > need * 1.5 ? 'okbig' : 'ok'; A.sfx('ok'); fb(el, 'ok', esc(clipText(s, k))); say(s, k).then(function () { E.done = 1; A.save(); finish(el, s); }); }
            else { tried = true; A.sfx('no'); fb(el, 'no', esc(clipText(s, 'short'))); say(s, 'short').then(function () { busy = false; }); }
          }, 5 * 260 + 700);
        };
      });
      if (E.done) A.exDone(true);
    }
  };

  /* ---------- 5.3 tunelurile ---------- */
  EX.tunnels = {
    html: function () {
      var ents = [[18, 29], [50, 29], [82, 29]], chs = [[22, 62], [52, 84], [80, 60]];
      return '<div class="tun"><div class="scene" role="group" aria-label="Casa suricatei, sub pământ"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>' +
        ents.map(function (e, i) { return '<button class="ent" type="button" data-e="' + i + '" style="left:' + e[0] + '%;top:' + e[1] + '%" aria-pressed="false" aria-label="Intrarea ' + (i + 1) + '"></button>'; }).join('') +
        chs.map(function (c, i) { return '<button class="ch" type="button" data-c2="' + i + '" style="left:' + c[0] + '%;top:' + c[1] + '%" aria-label="Camera ' + (i + 1) + '">' + (i === 1 ? '<img src="' + FIG.s.src + '" alt="">' : '') + '</button>'; }).join('') +
        '<img class="eagle" src="data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><path d="M2 20 Q25 2 50 18 Q75 2 98 20 Q75 12 56 24 L50 30 L44 24 Q25 12 2 20Z" fill="#3B3F52"/></svg>') + '" alt="">' +
        '</div><div class="cnt3" hidden><span class="hq" style="align-self:center">Câte intrări?</span>' + [1, 2, 3].map(function (n) { return '<button class="opt" type="button" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div></div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { t: {} }), sel = null, svg = $('.scene > svg', el);
      var ents = [[18, 29], [50, 29], [82, 29]], chs = [[22, 62], [52, 84], [80, 60]];
      function draw() {
        svg.innerHTML = Object.keys(E.t).map(function (e) { var a = ents[e], b = chs[E.t[e]]; var my = (a[1] + b[1]) / 2; return '<path d="M' + a[0] + ' ' + a[1] + ' C' + a[0] + ' ' + my + ' ' + b[0] + ' ' + my + ' ' + b[0] + ' ' + b[1] + '" fill="none" stroke="#C5884A" stroke-width="5.5" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:22px"/>'; }).join('');
        $$('.ent', el).forEach(function (b) { b.classList.toggle('done', E.t[b.dataset.e] !== undefined); b.setAttribute('aria-pressed', sel === b.dataset.e ? 'true' : 'false'); });
        $$('.ch', el).forEach(function (c) { var used = Object.keys(E.t).some(function (e) { return String(E.t[e]) === c.dataset.c2; }); c.classList.toggle('done', used); });
      }
      $$('.ent', el).forEach(function (b) { b.onclick = function () { A.sfx('tap'); sel = sel === b.dataset.e ? null : b.dataset.e; draw(); if (sel) fb(el, 'info', 'Acum atinge o cameră.'); }; });
      $$('.ch', el).forEach(function (c) {
        c.onclick = function () {
          if (sel === null) { fb(el, 'info', 'Atinge întâi o intrare, pe linia verde.'); return; }
          E.t[sel] = +c.dataset.c2; sel = null; A.sfx('drop'); draw(); A.save();
          var n = Object.keys(E.t).length;
          if (n < 3) { fb(el, 'ok', esc(clipText(s, 'one'))); say(s, 'one'); }
          else { fb(el, 'ok', esc(clipText(s, 'all'))); say(s, 'all').then(eagle); }
        };
      });
      function eagle() {
        var eg = $('.eagle', el); eg.classList.add('go'); A.sfx('whoosh'); fb(el, 'info', esc(clipText(s, 'eagle')));
        say(s, 'eagle').then(function () { $('.cnt3', el).hidden = false; fb(el, 'info', esc(clipText(s, 'q'))); say(s, 'q'); });
      }
      var tried = false;
      $$('.cnt3 .opt', el).forEach(function (b) {
        b.onclick = function () {
          var ok = +b.dataset.n === 3; A.first(s.id, 0, ok && !tried);
          A.interaction('m5_intrari_suricata', 'numeric', b.dataset.n, ok ? 'correct' : 'incorrect', 'Câte intrări are casa suricatei?');
          if (ok) { b.classList.add('ok'); A.sfx('ok'); fb(el, 'ok', esc(clipText(s, 'qok'))); say(s, 'qok').then(function () { E.done = 1; A.save(); A.exDone(true); A.sfx('star'); }); }
          else { tried = true; b.classList.add('no'); A.sfx('no'); fb(el, 'no', esc(clipText(s, 'qno'))); say(s, 'qno'); setTimeout(function () { b.classList.remove('no'); }, 900); }
        };
      });
      draw(); if (E.done) { $('.cnt3', el).hidden = false; A.exDone(true); }
    }
  };

  /* ---------- 5.4 formele ---------- */
  var SH = {
    patrat: '<rect x="18" y="18" width="64" height="64" rx="2" fill="#FCC93A"/>',
    dreptunghi: '<rect x="30" y="8" width="40" height="84" rx="2" fill="#22BFAE"/>',
    triunghi: '<path d="M50 12 L90 84 H10 Z" fill="#F15C50"/>',
    cerc: '<circle cx="50" cy="50" r="38" fill="#4F8BF3"/>',
    semicerc: '<path d="M10 72 A40 40 0 0 1 90 72 Z" fill="#D8904A"/>',
    romb: '<path d="M50 8 L88 50 L50 92 L12 50 Z" fill="#9466EE"/>',
    hexagon: '<path d="M30 14 H70 L90 50 L70 86 H30 L10 50 Z" fill="#4FBE83"/>',
    oval: '<ellipse cx="50" cy="50" rx="26" ry="40" fill="#C6A7F6"/>',
    trapez: '<path d="M28 24 H72 L92 80 H8 Z" fill="#FF9F1C"/>',
    arcada: '<path d="M14 90 V48 A36 36 0 0 1 86 48 V90 H68 V50 A18 18 0 0 0 32 50 V90 Z" fill="#FF8CC6"/>'
  };
  var SHN = { patrat: 'pătrat', dreptunghi: 'dreptunghi', triunghi: 'triunghi', cerc: 'cerc', semicerc: 'semicerc', romb: 'romb', hexagon: 'hexagon', oval: 'oval', trapez: 'trapez', arcada: 'arcadă' };
  A.SH = SH;
  EX.shapes = {
    html: function (s) { return '<div class="shapes" role="group" aria-label="Zece forme">' + s.shapes.map(function (k) { return '<button class="shp" type="button" data-k="' + k + '" aria-label="' + SHN[k] + '"><svg viewBox="0 0 100 100" aria-hidden="true">' + SH[k] + '</svg><b>' + SHN[k] + '</b></button>'; }).join('') + '</div>'; },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { h: {} });
      function paint() { $$('.shp', el).forEach(function (b) { b.classList.toggle('heard', !!E.h[b.dataset.k]); }); }
      $$('.shp', el).forEach(function (b) {
        b.onclick = function () {
          var k = b.dataset.k; b.classList.remove('bounce'); void b.offsetWidth; b.classList.add('bounce'); A.sfx('pop');
          E.h[k] = 1; paint(); A.save();
          say(s, k, { text: SHN[k] }).then(function (done) { if (Object.keys(E.h).length === s.shapes.length && !A.exDone()) { A.later(function () { finish(el, s); }, 200); } });
        };
      });
      paint(); if (Object.keys(E.h).length === s.shapes.length) A.exDone(true);
    }
  };

  /* ---------- 5.5 roluri ---------- */
  var RN = { usa: 'ușă', perete: 'perete', stalp: 'stâlp', planseu: 'planșeu', acoperis: 'acoperiș', fereastra_pod: 'fereastră de pod', deal: 'deal', fereastra_semicerc: 'fereastră în semicerc', tufis: 'tufiș', fereastra_rotunda: 'fereastră rotundă', coroana: 'coroana copacului', soare: 'soare' };
  var FN = { dreptunghi: 'dreptunghi', triunghi: 'triunghi', semicerc: 'semicerc', cerc: 'cerc' };
  function roleSvg(f, r) {
    // scena: 100×100, pământul la y=74
    var base = '<rect x="0" y="74" width="100" height="2" fill="none"/>';
    var house = '<rect x="22" y="40" width="56" height="34" fill="#FFE7C2" stroke="#1F2433" stroke-width="1.2" opacity=".55"/>';
    var R = {
      dreptunghi: {
        usa: house + '<rect x="42" y="48" width="16" height="26" fill="#22BFAE" stroke="#1F2433" stroke-width="1.2"/><circle cx="54" cy="62" r="1.5" fill="#1F2433"/>',
        perete: '<rect x="18" y="34" width="64" height="40" fill="#22BFAE" stroke="#1F2433" stroke-width="1.2"/>',
        stalp: '<rect x="26" y="30" width="6" height="44" fill="#22BFAE" stroke="#1F2433" stroke-width="1.2"/><rect x="68" y="30" width="6" height="44" fill="#22BFAE" stroke="#1F2433" stroke-width="1.2"/><rect x="20" y="26" width="60" height="5" fill="#D8904A" opacity=".6"/>',
        planseu: '<rect x="20" y="20" width="60" height="54" fill="#FFE7C2" stroke="#1F2433" stroke-width="1.2" opacity=".55"/><rect x="16" y="45" width="68" height="6" fill="#22BFAE" stroke="#1F2433" stroke-width="1.2"/>'
      },
      triunghi: {
        acoperis: house + '<path d="M16 41 L50 16 L84 41 Z" fill="#F15C50" stroke="#1F2433" stroke-width="1.2"/>',
        fereastra_pod: house + '<path d="M16 41 L50 16 L84 41 Z" fill="#FFD7E8" stroke="#1F2433" stroke-width="1.2"/><path d="M42 37 L50 26 L58 37 Z" fill="#F15C50" stroke="#1F2433" stroke-width="1"/><path d="M50 26 V37 M46 32 H54" stroke="#fff" stroke-width="1.2"/>'
      },
      semicerc: {
        deal: '<path d="M14 74 A36 36 0 0 1 86 74 Z" fill="#D8904A" stroke="#1F2433" stroke-width="1.2"/><path d="M44 74 V64 A6 6 0 0 1 56 64 V74 Z" fill="#F15C50" stroke="#1F2433" stroke-width="1"/>',
        fereastra_semicerc: house + '<path d="M38 60 A12 12 0 0 1 62 60 Z" fill="#D8904A" stroke="#1F2433" stroke-width="1.2"/><path d="M41 60 A9 9 0 0 1 59 60 Z" fill="#D7EEFF"/><path d="M50 51 V60 M44 53 L50 60 L56 53" stroke="#D8904A" stroke-width="1.4" fill="none"/>',
        tufis: house + '<path d="M60 74 A12 12 0 0 1 84 74 Z" fill="#4FBE83" stroke="#1F2433" stroke-width="1.2"/>'
      },
      cerc: {
        fereastra_rotunda: house + '<circle cx="50" cy="56" r="9" fill="#4F8BF3" stroke="#1F2433" stroke-width="1.2"/><circle cx="50" cy="56" r="6" fill="#D7EEFF"/><path d="M50 50 V62 M44 56 H56" stroke="#4F8BF3" stroke-width="1.6"/>',
        coroana: '<rect x="47" y="46" width="6" height="28" fill="#A0642E" stroke="#1F2433" stroke-width="1"/><circle cx="50" cy="36" r="18" fill="#4FBE83" stroke="#1F2433" stroke-width="1.2"/>',
        soare: house + '<g stroke="#F2B930" stroke-width="2.4" stroke-linecap="round"><path d="M80 8 V3 M80 29 V34 M66 18 H61 M94 18 H99 M70 8 L67 5 M90 28 L93 31 M70 28 L67 31 M90 8 L93 5"/></g><circle cx="80" cy="18" r="8" fill="#FCC93A" stroke="#1F2433" stroke-width="1.2"/>'
      }
    };
    return base + (r ? R[f][r] : '<g transform="translate(25 22) scale(.5)">' + SH[f === 'triunghi' ? 'triunghi' : f] + '</g>');
  }
  EX.roles = {
    html: function (s) {
      return '<div class="roles"><div class="stagebox"><svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Forma și rolul ei"></svg></div>' +
        '<div class="col"><div class="forms" role="group" aria-label="Forma">' + s.forms.map(function (f) { return '<button class="btn" type="button" data-f="' + f.f + '" aria-pressed="false"><svg viewBox="0 0 100 100" style="width:30px;height:30px" aria-hidden="true">' + SH[f.f] + '</svg>' + FN[f.f] + '</button>'; }).join('') + '</div>' +
        '<p class="hq" style="margin:4px 0">Ce poate deveni?</p><div class="rl" role="group" aria-label="Rolul"></div></div></div>';
    },
    init: function (el, s) {
      var E = A.st().ex[s.id] || (A.st().ex[s.id] = { v: {} }), f = s.forms[0].f, svg = $('.stagebox svg', el);
      function render(r) {
        svg.innerHTML = roleSvg(f, r);
        var F = s.forms.filter(function (x) { return x.f === f; })[0];
        $$('.forms .btn', el).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === f ? 'true' : 'false'); });
        $('.rl', el).innerHTML = F.roles.map(function (k) { return '<button class="btn" type="button" data-r="' + k + '" aria-pressed="' + (k === r) + '">' + RN[k] + '</button>'; }).join('');
        $$('.rl .btn', el).forEach(function (b) {
          b.onclick = function () {
            A.sfx('pop'); render(b.dataset.r); svg.classList.remove('pop'); void svg.getBoundingClientRect(); svg.classList.add('pop');
            E.v[f] = E.v[f] || {}; E.v[f][b.dataset.r] = 1; A.save();
            say(s, b.dataset.r, { text: RN[b.dataset.r] }).then(function () {
              var all = s.forms.every(function (x) { return E.v[x.f] && Object.keys(E.v[x.f]).length >= 2 || (x.roles.length < 2 && E.v[x.f]); });
              if (all && !A.exDone()) finish(el, s);
            });
          };
        });
      }
      $$('.forms .btn', el).forEach(function (b) { b.onclick = function () { f = b.dataset.f; A.sfx('tap'); render(null); say(s, 'f.' + f, { text: FN[f] }); }; });
      render(null);
      var all0 = s.forms.every(function (x) { return E.v[x.f] && Object.keys(E.v[x.f]).length >= 2; }); if (all0) A.exDone(true);
    }
  };

  /* ---------- 6.1 alege clientul ---------- */
  EX.choose = {
    html: function () {
      return '<div class="meet">' + ['g', 'l', 's'].map(function (k) { var c = C.clients[k]; return '<button class="client ' + k + ' idle" type="button" data-cl="' + k + '" aria-pressed="false"><span class="tag">' + I.voice + '</span><span class="art"><img src="' + A.src('poster_' + (k === 'g' ? 'girafa' : k === 'l' ? 'liliac' : 'suricata')) + '" alt=""></span><span class="nm">' + esc(c.name) + '</span><span class="q">„' + esc(c.quote) + '”</span></button>'; }).join('') + '</div>' +
        '<div class="acts" style="justify-content:center"><button class="btn big pri" type="button" id="pick" disabled>' + I.check + '<span>Alege un client</span></button></div>';
    },
    init: function (el, s) {
      var st = A.st(), sel = st.client, pick = $('#pick', el);
      function paint() { $$('.client', el).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cl === sel ? 'true' : 'false'); }); pick.disabled = !sel; $('span', pick).textContent = sel ? (sel === 'l' ? 'Îl aleg pe ' : 'O aleg pe ') + C.clients[sel].name.toLowerCase() + '!' : 'Alege un client'; }
      $$('.client', el).forEach(function (b) { b.onclick = function () { A.sfx('tap'); sel = b.dataset.cl; paint(); say(s, sel, { talk: b }); }; });
      pick.onclick = function () {
        if (!sel) return;
        if (st.house && st.house.client && st.house.client !== sel && st.house.items && st.house.items.length) { st.houses = st.houses || {}; st.houses[st.house.client] = st.house; st.house = (st.houses[sel]) || null; }
        st.client = sel; A.save(); A.sfx('star'); A.interaction('m6_client', 'choice', sel, 'neutral', 'Clientul ales');
        fb(el, 'ok', esc(clipText(s, 'ok.' + sel))); say(s, 'ok.' + sel).then(function () { A.exDone(true); A.later(A.next, 400); });
      };
      paint(); if (st.client) A.exDone(true);
    }
  };
})();
