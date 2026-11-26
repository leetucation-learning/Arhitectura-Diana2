/* Casa pe măsură · constructorul de case (6.3), verificarea clientului (6.4), explicația (6.5), imagine și tipărire.
   Planșa are mărimea reală a planșei perechii din kit: 18,6 × 22,1 cm, linia verde (pământul) la 12,84 cm de sus.
   Piesele au mărimea reală din colile de forme: de aceea „pe măsură” se poate verifica. */
(function () {
  'use strict';
  var A = window.APP, C = A.C, I = A.I, $ = A.$, $$ = A.$$, esc = A.esc, SCR = A.SCR, PC = A.PC, FIG = A.FIG;
  var W = 18.6, H = 22.1, G = 12.84;
  var NAMES = { g: 'girafa', l: 'liliacul', s: 'suricata' };
  var WALLC = ['#FFD9A0', '#FFB8D2', '#A9D3FF', '#B7EBC9', '#D5C4FF', '#FFF0A0', '#F2C58E', '#C99A6A'];
  var PENS = [{ c: '#1F2433', w: 2.5, n: 'negru' }, { c: '#8B5A2B', w: 7, n: 'maro gros, pentru tuneluri' }, { c: '#F2B930', w: 3, n: 'galben' }, { c: '#4F8BF3', w: 3, n: 'albastru' }, { c: '#4FBE83', w: 3, n: 'verde' }, { c: '#F15C50', w: 3, n: 'roșu' }];
  var ROOF = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" d="M2.5 13L12 4.5l9.5 8.5H2.5z"/><path fill="none" stroke="currentColor" stroke-width="2.4" d="M6 13v6.5h12V13"/></svg>';
  var BEAM = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M3 6.5h18M6.5 6.5V20M17.5 6.5V20"/></svg>';
  var CATS = [
    { k: 'cl', t: 'Clientul', i: I.card }, { k: 'usa', t: 'Uși', i: I.door }, { k: 'fer', t: 'Ferestre', i: I.window },
    { k: 'obl', t: 'Obloane', i: I.shutter }, { k: 'acop', t: 'Acoperișuri', i: ROOF }, { k: 'stalp', t: 'Stâlpi și grinzi', i: BEAM },
    { k: 'wall', t: 'Pereți', i: I.rooms }, { k: 'forma', t: 'Forme', i: I.shapes }, { k: 'nat', t: 'Natură', i: I.tree }, { k: 'pen', t: 'Carioca', i: I.pen }
  ];
  var LAB = { g: ['Scara', 'Lumina', 'Nivelul', 'Umbra'], l: ['Scara', 'Lumina', 'Nivelul', 'Spațiul'], s: ['Scara', 'Lumina', 'Nivelul', 'Spațiul'] };
  var TILE = { g: ['g_marime', 'g_zi', 'g_sus', 'g_umbra'], l: ['l_marime', 'l_noapte', 'l_sus', 'l_multi'], s: ['s_marime', 's_zi', 's_jos', 's_familie'] };
  var KEYS = ['scara', 'lumina', 'nivel', 'spatiu'];

  /* ---------- geometrie ---------- */
  function dims(it) {
    if (it.t === 'wall') return { w: it.w, h: it.h };
    if (it.t === 'fig') { var F = FIG[it.id]; return { w: F.h * F.ar, h: F.h }; }
    var P = PC[it.id]; return P ? { w: P.w, h: P.h } : { w: 1, h: 1 };
  }
  function box(it) {
    var d = dims(it), cx = it.x + d.w / 2, cy = it.y + d.h / 2, q = ((it.r || 0) % 180 + 180) % 180 === 90;
    var ew = q ? d.h : d.w, eh = q ? d.w : d.h;
    return { x0: cx - ew / 2, y0: cy - eh / 2, x1: cx + ew / 2, y1: cy + eh / 2, w: ew, h: eh, cx: cx, cy: cy };
  }
  function cat(it) { return it.t === 'p' ? (PC[it.id] || {}).cat : it.t; }
  function fresh() { return { client: A.st().client || null, items: [], strokes: [] }; }
  function house() { var st = A.st(); if (!st.house || !st.house.items) st.house = fresh(); if (!st.house.client) st.house.client = st.client; return st.house; }
  A.house = house;

  /* ---------- analiza casei (pentru verificare și pentru explicație) ---------- */
  function strokeInfo(s) {
    var p = s.p, len = 0, below = 0, cross = false, above = false, under = false;
    for (var i = 0; i < p.length; i += 2) {
      var y = p[i + 1] / 10; if (y > G + 0.2) under = true; if (y <= G + 0.2) above = true;
      if (i >= 2) { var d = Math.hypot(p[i] - p[i - 2], p[i + 1] - p[i - 1]) / 10; len += d; if (y > G + 0.2) below += d; }
    }
    cross = above && under;
    return { len: len, below: below, cross: cross };
  }
  function analyze(h, cl) {
    var it = h.items, B = it.map(box), R = {}, f = {};
    var doors = [], wins = [], shut = [], beamsH = [], pillars = [], roofs = [], walls = [], trees = 0, porch = 0, under = 0, clientIn = false, struct = 0, onGround = 0, aboveG = 0, touch = false;
    it.forEach(function (x, i) {
      var b = B[i], k = cat(x);
      if (x.t === 'fig') { if (x.id === cl) clientIn = true; return; }
      if (k === 'usa') doors.push(b); else if (k === 'fer') wins.push(b); else if (k === 'obl') shut.push(b); else if (k === 'acop') roofs.push(b);
      else if (k === 'stalp') { if (x.id === 'x_pridvor') porch++; else if (b.w >= b.h) beamsH.push(b); else pillars.push(b); }
      else if (k === 'wall') walls.push(b);
      if (x.id === 'a61' || x.id === 'x_copac' || x.id === 'b43') trees++;
      if (k !== 'nat') { struct++; if (b.cy > G + 0.3) under++; if (b.y1 <= G + 0.35) aboveG++; if (Math.abs(b.y1 - G) <= 0.5 || (b.y0 < G && b.y1 > G)) touch = true; }
    });
    var strokes = (h.strokes || []).map(strokeInfo), drawnBelow = 0, crossing = 0;
    strokes.forEach(function (s) { drawnBelow += s.below; if (s.cross) crossing++; });
    var nearG = function (b) { return Math.abs(b.y1 - G) <= 1.0 || (b.y0 <= G + 0.6 && b.y1 >= G - 0.6); };
    if (cl === 'g') {
      var fit = doors.filter(function (b) { return b.h >= 6.6 && b.h <= 9.9 && Math.abs(b.y1 - G) <= 0.8; });
      R.scara = !doors.length ? 'none' : fit.length ? 'ok' : 'no';
      R.lumina = wins.some(function (b) { var hc = G - b.cy; return Math.max(b.w, b.h) >= 2 && hc >= 3.8 && hc <= 8; }) ? 'ok' : 'no';
      R.nivel = struct > 0 && aboveG / struct >= 0.7 && touch ? 'ok' : 'no';
      R.spatiu = porch || trees || (beamsH.length + roofs.length > 0 && pillars.length > 0) ? 'ok' : 'no';
    } else if (cl === 'l') {
      R.scara = doors.concat(wins).some(function (b) { return b.y1 <= G - 5; }) ? 'ok' : 'no';
      var nW = wins.filter(function (b) { return Math.max(b.w, b.h) > 1.3; }).length;
      R.lumina = shut.length >= 1 && nW <= 2 ? 'ok' : 'no';
      R.nivel = beamsH.some(function (b) { return b.y1 <= G - 5; }) ? 'ok' : 'no';
      R.spatiu = beamsH.some(function (b) { return b.w >= 5.5 && b.y1 <= G - 5; }) ? 'ok' : 'no';
    } else {
      var sf = doors.filter(function (b) { return b.h >= 2.2 && b.h <= 3.2; });
      R.scara = !doors.length ? 'none' : sf.length ? 'ok' : 'no';
      R.lumina = wins.some(function (b) { return Math.max(b.w, b.h) <= 2.05; }) ? 'ok' : 'no';
      R.nivel = under >= 2 || drawnBelow >= 4 || (under >= 1 && drawnBelow >= 2) ? 'ok' : 'no';
      var ent = doors.filter(nearG).length + crossing;
      R.spatiu = ent >= 3 ? 'ok' : 'no';
    }
    // ce se vede în casă (pentru „Am pus...”)
    f.usa_mare = doors.some(function (b) { return b.h >= 5; });
    f.usa_mica = doors.some(function (b) { return b.h < 3.3; });
    f.intrare_sus = doors.concat(wins).some(function (b) { return b.y1 <= G - 5; });
    f.ferestre_mari = wins.some(function (b) { return Math.max(b.w, b.h) >= 2.2; });
    f.fereastra_mica = wins.some(function (b) { return Math.max(b.w, b.h) <= 2.05; });
    f.obloane = shut.length > 0;
    f.pridvor = porch > 0 || (roofs.length + beamsH.length > 0 && pillars.length >= 2);
    f.copac = trees > 0;
    f.bara = beamsH.some(function (b) { return b.w >= 5.5; });
    f.camere_jos = under > 0;
    f.intrari = doors.filter(nearG).length + crossing >= 3;
    f.tuneluri = drawnBelow >= 2;
    f.acoperis = roofs.length > 0;
    f.tavan_inalt = walls.some(function (b) { return b.h >= 7.5; });
    return { r: R, f: f, clientIn: clientIn, n: it.length + (h.strokes || []).length };
  }
  A.analyzeHouse = analyze;

  /* ---------- desen pe pânză (imagine, miniatură, tipar) ---------- */
  var imgCache = {};
  function loadImg(src) { if (imgCache[src]) return imgCache[src]; var p = new Promise(function (res) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src; }); imgCache[src] = p; return p; }
  function srcOf(it) { return it.t === 'fig' ? FIG[it.id].src : it.t === 'p' ? A.src(it.id) : null; }
  function render(h, ppc) {
    return Promise.all(h.items.map(function (it) { var s = srcOf(it); return s ? loadImg(s) : Promise.resolve(null); })).then(function (ims) {
      var cw = Math.round(W * ppc), chh = Math.round(H * ppc), cv = document.createElement('canvas'); cv.width = cw; cv.height = chh;
      var x = cv.getContext('2d');
      x.fillStyle = '#EAF4FB'; x.fillRect(0, 0, cw, G * ppc);
      x.fillStyle = '#F2E4C9'; x.fillRect(0, G * ppc, cw, chh - G * ppc);
      x.strokeStyle = 'rgba(31,36,51,.07)'; x.lineWidth = Math.max(1, ppc / 40);
      for (var gx = 1; gx < W; gx++) { x.beginPath(); x.moveTo(gx * ppc, 0); x.lineTo(gx * ppc, chh); x.stroke(); }
      for (var gy = 1; gy < H; gy++) { x.beginPath(); x.moveTo(0, gy * ppc); x.lineTo(cw, gy * ppc); x.stroke(); }
      x.fillStyle = '#6DB54A'; x.fillRect(0, (G - 0.12) * ppc, cw, 0.24 * ppc);
      h.items.forEach(function (it, i) {
        var d = dims(it), w = d.w * ppc, hh = d.h * ppc;
        x.save(); x.translate((it.x + d.w / 2) * ppc, (it.y + d.h / 2) * ppc); x.rotate((it.r || 0) * Math.PI / 180); if (it.f) x.scale(-1, 1);
        if (it.t === 'wall') { x.fillStyle = it.c || WALLC[0]; x.strokeStyle = 'rgba(31,36,51,.6)'; x.lineWidth = Math.max(1.5, ppc / 18); x.beginPath(); if (it.o) x.ellipse(0, 0, w / 2, hh / 2, 0, 0, Math.PI * 2); else x.rect(-w / 2, -hh / 2, w, hh); x.fill(); x.stroke(); }
        else if (ims[i]) x.drawImage(ims[i], -w / 2, -hh / 2, w, hh);
        x.restore();
      });
      (h.strokes || []).forEach(function (s) {
        var p = s.p; if (p.length < 2) return; x.strokeStyle = s.c; x.lineWidth = s.w / 10 * ppc; x.lineCap = 'round'; x.lineJoin = 'round';
        x.beginPath(); x.moveTo(p[0] / 10 * ppc, p[1] / 10 * ppc); for (var j = 2; j < p.length; j += 2) x.lineTo(p[j] / 10 * ppc, p[j + 1] / 10 * ppc); if (p.length === 2) x.lineTo(p[0] / 10 * ppc + 0.1, p[1] / 10 * ppc); x.stroke();
      });
      return cv;
    });
  }
  A.renderHouse = render;
  var PH = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7#house';
  var thumb = { k: null, url: null, busy: null };
  function hKey(h) { return JSON.stringify([h.items, h.strokes]); }
  function makeThumb() {
    var h = A.st().house; if (!h || !h.items || !(h.items.length || (h.strokes || []).length)) return Promise.resolve(null);
    var k = hKey(h); if (thumb.k === k && thumb.url) return Promise.resolve(thumb.url);
    if (thumb.busy && thumb.bk === k) return thumb.busy;
    thumb.bk = k;
    thumb.busy = render(h, 24).then(function (cv) {
      var url = null; try { url = cv.toDataURL('image/png'); } catch (e) { url = null; }
      thumb.k = k; thumb.url = url; thumb.busy = null;
      if (url) $$('img[src$="#house"]').forEach(function (im) { im.src = url; });
      return url;
    });
    return thumb.busy;
  }
  A.houseThumb = function () {
    var h = A.st().house; if (!h || !h.items || !(h.items.length || (h.strokes || []).length)) return null;
    if (thumb.k === hKey(h) && thumb.url) return thumb.url;
    makeThumb(); return PH;
  };
  A.downloadHouse = function () {
    var h = A.st().house; if (!h) return;
    render(h, 100).then(function (cv) {
      var name = 'casa-mea-' + (NAMES[h.client] || 'pe-masura') + '.png';
      try {
        cv.toBlob(function (b) {
          var u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click();
          setTimeout(function () { URL.revokeObjectURL(u); a.parentNode && a.parentNode.removeChild(a); }, 1500);
          A.toast('Imaginea casei a fost salvată.');
        }, 'image/png');
      } catch (e) { A.toast('Browserul nu permite salvarea aici. Folosește Tipărește.'); }
    });
  };
  function printBlock(html) {
    var old = $('.printonly'); if (old) old.parentNode.removeChild(old);
    var d = document.createElement('div'); d.className = 'printonly'; d.innerHTML = html; document.body.appendChild(d);
    var ims = $$('img', d); var ready = Promise.all(ims.map(function (im) { return im.complete ? 1 : new Promise(function (r) { im.onload = im.onerror = r; }); }));
    ready.then(function () { setTimeout(function () { try { window.print(); } catch (e) {} }, 120); });
  }
  function foot() {
    var m = C.meta;
    return '<div class="pfoot"><img src="media/brand/cp_logo_negru.png" alt=""><p><b>' + esc(m.project) + '</b> · ' + esc(m.edition) + '<br>' + esc(m.activity) + ' · Atelier: ' + esc(m.contentAuthor) + '<br>E-learning: ' + esc(m.author) + ' · ' + esc(m.org) + '<br><small>' + esc(m.funding) + '</small></p></div>';
  }
  A.printHouse = function () {
    var h = A.st().house; if (!h) return;
    render(h, 60).then(function (cv) {
      var url; try { url = cv.toDataURL('image/png'); } catch (e) { A.toast('Tipărirea nu merge din fișier local.'); return; }
      printBlock('<div class="psheet"><h1>Casa pe măsură</h1><p class="pcl">Clientul meu: <b>' + esc(h.client ? C.clients[h.client].name : '') + '</b> · Arhitect: <b>' + esc(A.st().name || '..............................') + '</b></p><img class="phouse" src="' + url + '" alt="Casa construită">' + foot() + '</div>');
    });
  };
  A.printDiploma = function () {
    var st = A.st(), n = A.starsCount(), nm = ($('#dname') && $('#dname').value) || st.name || '';
    var go = function (url) {
      var stars = ''; for (var i = 0; i < 6; i++) stars += st.done[i] ? I.star : I.star0;
      printBlock('<div class="psheet pdip"><p class="pk">Atelierul „Casa pe măsură” · Arhitectura celor mici</p><h1>Diplomă de arhitect</h1><p class="pname">' + esc(nm || '..............................................') + '</p>' +
        '<p class="pcl">a gândit o casă pe măsură' + (st.client ? ' pentru <b>' + esc(NAMES[st.client]) + '</b>' : '') + ' și a câștigat ' + n + ' stele din 6.</p><div class="pstars">' + stars + '</div>' +
        (url ? '<img class="phouse sm" src="' + url + '" alt="Casa construită">' : '') + foot() + '</div>');
    };
    if (st.house && st.house.items && st.house.items.length) render(st.house, 30).then(function (cv) { var u = null; try { u = cv.toDataURL('image/png'); } catch (e) {} go(u); }); else go(null);
  };

  /* ---------- constructorul ---------- */
  SCR.builder = {
    noAuto: function () { return false; },
    html: function (s) {
      return '<h1 class="sr" id="t-' + s.id.replace('.', '-') + '">' + esc(A.plain(s.t)) + '</h1><div class="bld">' +
        '<div class="tools" role="toolbar" aria-label="Unelte">' +
        '<button class="ib sm tshort" type="button" data-t="home" aria-label="Strada atelierului">' + I.home + '</button>' +
        '<button class="ib sm tshort" type="button" data-t="voice" aria-label="Ascultă instrucțiunea">' + I.voice + '</button>' +
        '<button class="who" type="button" id="bWho"></button>' +
        '<span class="sep" aria-hidden="true"></span>' +
        '<button class="ib sm" type="button" data-t="rot" aria-label="Rotește piesa aleasă" disabled>' + I.rotate + '</button>' +
        '<button class="ib sm" type="button" data-t="flip" aria-label="Întoarce piesa în oglindă" disabled>' + I.flip + '</button>' +
        '<button class="ib sm" type="button" data-t="front" aria-label="Adu piesa în față" disabled>' + I.front + '</button>' +
        '<button class="ib sm" type="button" data-t="back" aria-label="Du piesa în spate" disabled>' + I.back + '</button>' +
        '<button class="ib sm" type="button" data-t="del" aria-label="Șterge piesa aleasă" disabled>' + I.trash + '</button>' +
        '<span class="sep" aria-hidden="true"></span>' +
        '<button class="ib sm" type="button" data-t="undo" aria-label="Anulează" disabled>' + I.undo + '</button>' +
        '<button class="ib sm" type="button" data-t="redo" aria-label="Refă" disabled>' + I.redo + '</button>' +
        '<span class="pens" hidden role="group" aria-label="Culoarea cariocii">' + PENS.map(function (p, i) { return '<button type="button" data-pen="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="Carioca ' + p.n + '" style="background:' + p.c + (p.w > 5 ? ';box-shadow:inset 0 0 0 4px #fff' : '') + '"></button>'; }).join('') +
        '<button class="ib sm" type="button" data-t="penoff" aria-label="Gata cu desenul">' + I.x + '</button></span>' +
        '<button class="btn pri done" type="button" data-t="done">' + I.check + '<span>Gata, verifică!</span></button></div>' +
        '<div class="bwrap"><div class="board" id="board" role="application" aria-roledescription="planșă" aria-label="Planșa casei. Sus e cerul, jos e pământul. Linia verde este pământul.">' +
        '<div class="earth" style="top:' + (G / H * 100) + '%"></div><div class="gl" style="top:calc(' + (G / H * 100) + '% - 3px);height:6px"></div>' +
        '<span class="lab" style="top:1%">cer</span><span class="lab" style="top:calc(' + (G / H * 100) + '% + 8px)">pământ</span>' +
        '<div class="snapline" style="top:' + (G / H * 100) + '%"></div><div class="pcs"></div>' +
        '<svg class="draw" viewBox="0 0 186 221" preserveAspectRatio="none" aria-hidden="true"></svg></div>' +
        '<p class="bhint" aria-live="polite"></p></div>' +
        '<div class="tray"><div class="cats" role="tablist" aria-label="Cutia cu piese">' + CATS.map(function (c, i) { return '<button type="button" role="tab" data-cat="' + c.k + '" aria-selected="' + (i === 0) + '">' + c.i + '<span>' + c.t + '</span></button>'; }).join('') + '</div>' +
        '<div class="items" role="tabpanel" aria-label="Piese"></div><div class="colors" hidden role="group" aria-label="Culoarea peretelui">' + WALLC.map(function (c) { return '<button type="button" data-col="' + c + '" style="background:' + c + '" aria-label="Culoare ' + c + '"></button>'; }).join('') + '</div></div></div>';
    },
    init: function (el, s) {
      var st = A.st(), appEl = document.getElementById('app'); appEl.classList.add('isbld');
      if (!st.client) {
        setTimeout(function () {
          A.modal('Alege întâi clientul', '<p style="font:800 var(--fs-b) var(--disp)">Pentru cine construiești casa?</p><div class="meet" style="grid-template-columns:repeat(3,1fr)">' + ['g', 'l', 's'].map(function (k) { return '<button class="client ' + k + '" type="button" data-cl="' + k + '"><span class="art" style="height:150px"><img src="' + FIG[k].src + '" alt=""></span><span class="nm">' + esc(C.clients[k].name) + '</span></button>'; }).join('') + '</div>', function (m, close) {
            $$('[data-cl]', m).forEach(function (b) { b.onclick = function () { st.client = b.dataset.cl; house().client = st.client; A.save(); close(); A.go('6.3'); }; });
          });
        }, 300);
      }
      var h = house(); if (st.client && h.client !== st.client) { if (!h.items.length) h.client = st.client; }
      var board = $('#board', el), pcs = $('.pcs', board), svg = $('svg.draw', board), bwrap = $('.bwrap', el), snap = $('.snapline', board), hint = $('.bhint', el);
      var items = $('.items', el), cols = $('.colors', el), pens = $('.pens', el);
      var sel = -1, scale = 30, drawing = false, pen = 0, hist = [], fut = [], said = st.said || (st.said = {}), curCat = 'cl';
      var cl = h.client || st.client || 'g';
      $('#bWho', el).innerHTML = '<img src="' + FIG[cl].src + '" alt="">' + esc(C.clients[cl].name) + '<span class="sr">: deschide cartonașul</span>';
      $('#bWho', el).onclick = showCard;
      function showCard() {
        A.modal('Cartonașul: ' + C.clients[cl].name, '<div class="cardmini">' + TILE[cl].map(function (t, i) { return '<div class="cm"><img src="' + A.src('semn_' + t) + '" alt=""><div><b>' + LAB[cl][i] + '</b><p>' + esc(((C.modules[5].screens.filter(function (x) { return x.type === 'mycard'; })[0] || {}).variants || {})[cl][i + 1]) + '</p></div></div>'; }).join('') + '</div>');
      }
      /* mărimea planșei */
      function fit() {
        var r = bwrap.getBoundingClientRect(), hh = r.height - (hint.offsetHeight || 0) - 6, bw = Math.max(120, Math.min(r.width, hh * W / H));
        board.style.width = bw + 'px'; board.style.height = (bw * H / W) + 'px'; scale = bw / W;
      }
      fit(); var ro = window.ResizeObserver ? new ResizeObserver(function () { fit(); }) : null; if (ro) ro.observe(bwrap); window.addEventListener('resize', fit);
      /* desenarea pieselor */
      function styleOf(it) {
        var d = dims(it);
        return 'left:' + (it.x / W * 100) + '%;top:' + (it.y / H * 100) + '%;width:' + (d.w / W * 100) + '%;height:' + (d.h / H * 100) + '%;transform:rotate(' + (it.r || 0) + 'deg)' + (it.f ? ' scaleX(-1)' : '') + ';' + (it.t === 'wall' ? 'background:' + (it.c || WALLC[0]) + ';' : '');
      }
      function nameOf(it) { return it.t === 'wall' ? (it.o ? 'cameră ovală' : 'perete') : it.t === 'fig' ? C.clients[it.id].name : (PC[it.id] || {}).n || 'piesă'; }
      function paint() {
        pcs.innerHTML = h.items.map(function (it, i) {
          return '<div class="pc' + (it.t === 'wall' ? ' wall' + (it.o ? ' oval' : '') : '') + (i === sel ? ' sel' : '') + '" data-i="' + i + '" tabindex="0" role="button" aria-label="' + esc(nameOf(it)) + (i === sel ? ', aleasă' : '') + '" style="' + styleOf(it) + '">' + (srcOf(it) ? '<img src="' + srcOf(it) + '" alt="" draggable="false">' : '') + (it.t === 'wall' ? '<span class="rs" aria-hidden="true">' + I.resize + '</span>' : '') + '</div>';
        }).join('');
        svg.innerHTML = (h.strokes || []).map(function (s) { return '<polyline points="' + pts(s.p) + '" fill="none" stroke="' + s.c + '" stroke-width="' + s.w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }).join('');
        tools();
      }
      function pts(p) { var o = []; for (var i = 0; i < p.length; i += 2) o.push(p[i] + ',' + p[i + 1]); if (p.length === 2) o.push((p[0] + 0.1) + ',' + p[1]); return o.join(' '); }
      function tools() {
        var has = sel >= 0 && h.items[sel];
        ['rot', 'flip', 'front', 'back', 'del'].forEach(function (k) { $('[data-t="' + k + '"]', el).disabled = !has; });
        $('[data-t="undo"]', el).disabled = !hist.length; $('[data-t="redo"]', el).disabled = !fut.length;
      }
      function snapshot() { hist.push(JSON.stringify({ items: h.items, strokes: h.strokes })); if (hist.length > 50) hist.shift(); fut = []; }
      function restore(js) { var o = JSON.parse(js); h.items = o.items; h.strokes = o.strokes; sel = -1; paint(); A.save(); }
      function changed() { A.save(); tools(); }
      function select(i, focus) {
        sel = i; $$('.pc', pcs).forEach(function (p) { var k = +p.dataset.i; p.classList.toggle('sel', k === i); p.setAttribute('aria-label', nameOf(h.items[k]) + (k === i ? ', aleasă' : '')); });
        tools(); if (focus && i >= 0) { var e = $('.pc[data-i="' + i + '"]', pcs); if (e) e.focus({ preventScroll: true }); }
      }
      function upd(i) { var e = $('.pc[data-i="' + i + '"]', pcs); if (e) e.setAttribute('style', styleOf(h.items[i])); }
      function clampSnap(it) {
        var b = box(it), dx = 0, dy = 0;
        if (b.cx < 0.3) dx = 0.3 - b.cx; if (b.cx > W - 0.3) dx = W - 0.3 - b.cx; if (b.cy < 0.3) dy = 0.3 - b.cy; if (b.cy > H - 0.3) dy = H - 0.3 - b.cy;
        it.x += dx; it.y += dy; b = box(it);
        var sn = false;
        if (Math.abs(b.y1 - G) < 0.35) { it.y += G - b.y1; sn = true; }
        else if (Math.abs(b.y0 - G) < 0.25 && cat(it) !== 'fig') { it.y += G - b.y0; sn = true; }
        snap.classList.toggle('on', sn);
        return sn;
      }
      /* adăugarea unei piese */
      function defaultPos(it) {
        var d = dims(it), k = cat(it), n = h.items.length, x = W / 2 - d.w / 2 + ((n % 5) - 2) * 0.4, y;
        var sb = null; h.items.forEach(function (o) { if (o.t === 'wall' && !o.o) { var b = box(o); sb = sb ? { x0: Math.min(sb.x0, b.x0), x1: Math.max(sb.x1, b.x1), y0: Math.min(sb.y0, b.y0) } : { x0: b.x0, x1: b.x1, y0: b.y0 }; } });
        var ofCat = function (c) { return h.items.filter(function (o) { return cat(o) === c; }).map(box); };
        var tall = k === 'usa' || k === 'fig' || (k === 'stalp' && d.h > d.w) || it.id === 'x_copac' || it.id === 'x_pridvor' || ['a73', 'b58', 'b43', 'b63', 'b34'].indexOf(it.id) >= 0;
        if (tall) y = G - d.h; else y = G - 4 - d.h / 2;
        if (k === 'usa') { var nd = ofCat('usa').length; x = sb ? (sb.x0 + sb.x1) / 2 - d.w / 2 + nd * (d.w + 0.4) : x; }
        else if (k === 'fer') { var nw = ofCat('fer').length; y = G - 5 - d.h / 2; if (sb) { y = Math.max(sb.y0 + 0.3, y); x = [sb.x0 + 0.5, sb.x1 - 0.5 - d.w, (sb.x0 + sb.x1) / 2 - d.w / 2][nw % 3]; } }
        else if (k === 'obl') { var ws = ofCat('fer'), ns = ofCat('obl').length; if (ws.length) { var lw = ws[ws.length - 1]; y = lw.y0; x = ns % 2 ? lw.x0 - d.w - 0.05 : lw.x1 + 0.05; } else y = G - 5 - d.h / 2; }
        else if (k === 'wall') y = it.o ? G + 1.6 + (n % 3) * 0.6 : G - d.h;
        else if (k === 'acop') { var top = sb ? sb.y0 : G - 7; y = top - d.h + 0.05; if (sb) x = (sb.x0 + sb.x1) / 2 - d.w / 2; }
        else if (k === 'stalp') { if (d.h > d.w && sb) x = sb.x0 - 3 - ofCat('stalp').length * 1.2; else if (d.w >= d.h) y = sb ? sb.y0 + 1.2 : G - 6.5; }
        else if (k === 'fig') { var fw = d.w; x = sb ? sb.x0 - fw - 0.5 : 2; if (x < 0.3) x = sb ? sb.x1 + 0.5 : 0.3; }
        if (it.id === 'x_soare' || it.id === 'x_luna' || it.id === 'a69') { y = 0.8; x = it.id === 'a69' ? 1 + (n % 3) : W - d.w - 1; }
        else if (k === 'nat' && tall) { x = sb ? Math.min(W - d.w - 0.3, sb.x1 + 0.6) : W - d.w - 1.2; }
        if (it.t === 'fig' && it.id === 'l') { y = sb ? sb.y0 + 0.4 : G - 7.5; x = sb ? (sb.x0 + sb.x1) / 2 - d.w / 2 : x; }
        if (it.t === 'fig' && it.id === 's' && h.items.some(function (o) { return o.t === 'wall' && o.o; })) { var ov = box(h.items.filter(function (o) { return o.t === 'wall' && o.o; })[0]); x = ov.cx - d.w / 2; y = ov.y1 - d.h - 0.2; }
        it.x = Math.max(0.1, Math.min(W - d.w - 0.1, x)); it.y = Math.max(0.1, y);
      }
      function add(it, at) {
        snapshot();
        if (at) { var d = dims(it); it.x = at[0] - d.w / 2; it.y = at[1] - d.h / 2; } else defaultPos(it);
        clampSnap(it); snap.classList.remove('on');
        h.items.push(it); sel = h.items.length - 1; paint(); A.sfx('pop');
        var e = $('.pc[data-i="' + sel + '"]', pcs); if (e) { e.classList.add('pop'); }
        changed(); tips();
        hint.textContent = 'Ai pus: ' + nameOf(it) + '. Trage piesa cu degetul unde vrei.';
      }
      function tips() {
        var hasClient = h.items.some(function (o) { return o.t === 'fig'; });
        if (!hasClient && h.items.length >= 4 && !said.tipc) { said.tipc = 1; A.clip('6.3:tip.client', { text: 'Nu uita: pune și clientul în casă. Îl găsești la Clientul.' }); }
      }
      /* cutia cu piese */
      function showCat(k) {
        curCat = k; $$('.cats [data-cat]', el).forEach(function (b) { b.setAttribute('aria-selected', b.dataset.cat === k ? 'true' : 'false'); });
        cols.hidden = k !== 'wall';
        if (k === 'pen') { setDraw(true); items.innerHTML = '<p class="pentip">Desenează pe planșă: tuneluri, scări, soarele sau luna. Alege culoarea de sus. Maro gros = tunel.</p>' + PENS.map(function (p, i) { return '<button class="it" type="button" data-pen="' + i + '" aria-pressed="' + (i === pen) + '"><span class="im"><svg viewBox="0 0 60 30" style="width:100%;height:30px"><path d="M4 22 C18 2, 30 30, 56 8" fill="none" stroke="' + p.c + '" stroke-width="' + (p.w * 1.4) + '" stroke-linecap="round"/></svg></span><small>' + esc(p.n) + '</small></button>'; }).join('') + '<button class="it" type="button" data-t2="clear"><span class="im">' + I.trash + '</span><small>șterge tot desenul</small></button>'; bindPens(items); if (!said.tipd) { said.tipd = 1; A.clip('6.3:tip.draw', { text: 'Cu carioca poți desena tuneluri, scări, soarele sau luna.' }); } return; }
        setDraw(false);
        var list = [];
        if (k === 'cl') list = [cl].concat(['g', 'l', 's'].filter(function (x) { return x !== cl; })).map(function (x, i) { return { t: 'fig', id: x, src: FIG[x].src, n: C.clients[x].name + (i === 0 ? ' (clientul tău)' : '') }; });
        else if (k === 'wall') list = [{ t: 'wall', w: 7, h: 5.4, o: 0, n: 'perete' }, { t: 'wall', w: 4, h: 7.6, o: 0, n: 'perete înalt' }, { t: 'wall', w: 9, h: 2.6, o: 0, n: 'perete lat' }, { t: 'wall', w: 4.6, h: 3, o: 1, n: 'cameră ovală' }, { t: 'wall', w: 3, h: 3, o: 1, n: 'cameră rotundă' }];
        else list = C.pieces.filter(function (p) { return p.cat === k; }).map(function (p) { return { t: 'p', id: p.id, src: A.src(p.id), n: p.n, sz: (k === 'usa' || k === 'stalp') ? String(Math.round(Math.max(p.w, p.h) * 10) / 10).replace('.', ',') + ' cm' : '' }; });
        items.innerHTML = list.map(function (x, i) {
          var im = x.t === 'wall' ? '<span style="display:block;width:' + Math.min(70, x.w * 7) + 'px;height:' + Math.min(54, x.h * 7) + 'px;background:' + (wallCol()) + ';border:2px solid rgba(31,36,51,.35);border-radius:' + (x.o ? '50%' : '3px') + '"></span>' : '<img src="' + x.src + '" alt="" draggable="false">';
          return '<button class="it" type="button" data-k="' + i + '">' + (x.sz ? '<span class="sz">' + x.sz + '</span>' : '') + '<span class="im">' + im + '</span><small><span class="sr">Adaugă: </span>' + esc(x.n) + '</small></button>';
        }).join('');
        $$('.it', items).forEach(function (b) {
          var x = list[+b.dataset.k];
          var mkIt = function () { return x.t === 'wall' ? { t: 'wall', w: x.w, h: x.h, o: x.o, c: wallCol(), x: 0, y: 0 } : x.t === 'fig' ? { t: 'fig', id: x.id, x: 0, y: 0, r: 0, f: 0 } : { t: 'p', id: x.id, x: 0, y: 0, r: 0, f: 0 }; };
          trayDrag(b, mkIt);
        });
        if (k === 'wall' && !said.tipw) { said.tipw = 1; A.clip('6.3:tip.walls', { text: 'Pereții și camerele sunt la Pereți. Le poți face mai mari sau mai mici.' }); }
      }
      var wcol = WALLC[0];
      function wallCol() { return wcol; }
      $$('[data-col]', cols).forEach(function (b) {
        b.onclick = function () {
          wcol = b.dataset.col; A.sfx('tap');
          if (sel >= 0 && h.items[sel] && h.items[sel].t === 'wall') { snapshot(); h.items[sel].c = wcol; upd(sel); changed(); }
          showCat('wall');
        };
      });
      $$('.cats [data-cat]', el).forEach(function (b) { b.onclick = function () { A.sfx('tap'); showCat(b.dataset.cat); }; });
      function trayDrag(b, mkIt) {
        var pid = null, sx, sy, moved = false, gh = null;
        b.addEventListener('pointerdown', function (e) { if (e.button) return; pid = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false; });
        b.addEventListener('pointermove', function (e) {
          if (pid !== e.pointerId) return;
          if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 12) {
            moved = true; try { b.setPointerCapture(pid); } catch (er) {}
            var it = mkIt(), d = dims(it); gh = document.createElement('div'); gh.className = 'ghost';
            gh.style.width = d.w * scale + 'px'; gh.style.height = d.h * scale + 'px';
            gh.innerHTML = srcOf(it) ? '<img src="' + srcOf(it) + '" alt="" style="width:100%;height:100%">' : '<div style="width:100%;height:100%;background:' + it.c + ';border:2px solid rgba(31,36,51,.35);border-radius:' + (it.o ? '50%' : '3px') + '"></div>';
            document.body.appendChild(gh); gh._it = it;
          }
          if (moved && gh) { gh.style.left = e.clientX + 'px'; gh.style.top = e.clientY + 'px'; }
        });
        var end = function (e) {
          if (pid !== e.pointerId) return; pid = null;
          if (moved && gh) {
            var r = board.getBoundingClientRect(), it = gh._it; gh.parentNode.removeChild(gh); gh = null;
            if (e.type === 'pointerup' && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) add(it, [(e.clientX - r.left) / scale, (e.clientY - r.top) / scale]);
          } else if (e.type === 'pointerup') add(mkIt());
        };
        b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
        b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); add(mkIt()); var p = $('.pc.sel', pcs); if (p) p.focus({ preventScroll: true }); } });
        b.addEventListener('click', function (e) { if (e.detail === 0) { /* activare de la tastatură tratată mai sus */ } });
      }
      /* mutarea pe planșă */
      var drag = null;
      board.addEventListener('pointerdown', function (e) {
        if (drawing) return;
        var rs = e.target.closest('.rs'), p = e.target.closest('.pc');
        if (!p) { select(-1); hint.textContent = ''; return; }
        var i = +p.dataset.i, it = h.items[i]; select(i);
        e.preventDefault(); try { board.setPointerCapture(e.pointerId); } catch (er) {}
        drag = { id: e.pointerId, i: i, sx: e.clientX, sy: e.clientY, x: it.x, y: it.y, w: it.w, h: it.h, rs: !!rs, moved: false };
      });
      board.addEventListener('pointermove', function (e) {
        if (!drag || drag.id !== e.pointerId) return;
        var dx = (e.clientX - drag.sx) / scale, dy = (e.clientY - drag.sy) / scale, it = h.items[drag.i];
        if (!drag.moved && Math.hypot(dx, dy) * scale < 4) return;
        if (!drag.moved) { drag.moved = true; snapshot(); }
        if (drag.rs) { it.w = Math.max(1, Math.min(W, Math.round((drag.w + dx) * 10) / 10)); it.h = Math.max(1, Math.min(H, Math.round((drag.h + dy) * 10) / 10)); }
        else { it.x = drag.x + dx; it.y = drag.y + dy; clampSnap(it); }
        upd(drag.i);
      });
      var endDrag = function (e) {
        if (!drag || drag.id !== e.pointerId) return;
        var it = h.items[drag.i];
        if (drag.moved) { it.x = Math.round(it.x * 100) / 100; it.y = Math.round(it.y * 100) / 100; A.sfx('drop'); changed(); hint.textContent = Math.abs(box(it).y1 - G) < 0.01 ? nameOf(it) + ' stă pe linia verde.' : ''; }
        snap.classList.remove('on'); drag = null;
      };
      board.addEventListener('pointerup', endDrag); board.addEventListener('pointercancel', endDrag);
      /* tastatura */
      pcs.addEventListener('focusin', function (e) { var p = e.target.closest('.pc'); if (p) select(+p.dataset.i); });
      pcs.addEventListener('keydown', function (e) {
        var p = e.target.closest('.pc'); if (!p) return; var i = +p.dataset.i, it = h.items[i], st2 = e.shiftKey ? 1 : 0.2, mv = null;
        if (e.key === 'ArrowLeft') mv = [-st2, 0]; else if (e.key === 'ArrowRight') mv = [st2, 0]; else if (e.key === 'ArrowUp') mv = [0, -st2]; else if (e.key === 'ArrowDown') mv = [0, st2];
        if (mv) { e.preventDefault(); snapshot(); it.x += mv[0]; it.y += mv[1]; clampSnap(it); snap.classList.remove('on'); upd(i); changed(); var b = box(it); hint.textContent = nameOf(it) + (Math.abs(b.y1 - G) < 0.01 ? ' stă pe linia verde' : b.cy > G ? ' e sub pământ' : ' e deasupra pământului'); return; }
        var k = e.key.toLowerCase();
        if (k === 'r') { e.preventDefault(); act('rot'); } else if (k === 'f') { e.preventDefault(); act('flip'); }
        else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); act('del'); }
        else if (e.key === 'PageUp') { e.preventDefault(); act('front'); } else if (e.key === 'PageDown') { e.preventDefault(); act('back'); }
        else if ((k === '+' || k === '=' || k === '-') && it.t === 'wall') { e.preventDefault(); snapshot(); var dd = k === '-' ? -0.4 : 0.4; it.w = Math.max(1, it.w + dd); it.h = Math.max(1, it.h + dd); upd(i); changed(); }
        else if (e.key === 'Escape') { select(-1); }
      });
      /* desenul cu carioca */
      function setDraw(on) {
        drawing = on; board.classList.toggle('drawing', on); pens.hidden = !on; if (on) select(-1);
        hint.textContent = on ? 'Carioca e pornită: desenează cu degetul pe planșă.' : '';
      }
      function bindPens(root) {
        $$('[data-pen]', root).forEach(function (b) { b.onclick = function () { pen = +b.dataset.pen; A.sfx('tap'); $$('[data-pen]', el).forEach(function (x) { x.setAttribute('aria-pressed', +x.dataset.pen === pen ? 'true' : 'false'); }); }; });
        $$('[data-t2="clear"]', root).forEach(function (b) { b.onclick = function () { if (!(h.strokes || []).length) return; snapshot(); h.strokes = []; paint(); changed(); A.sfx('whoosh'); }; });
      }
      bindPens(pens);
      var stroke = null;
      svg.addEventListener('pointerdown', function (e) {
        if (!drawing) return; e.preventDefault(); try { svg.setPointerCapture(e.pointerId); } catch (er) {}
        var r = board.getBoundingClientRect(), x = Math.round((e.clientX - r.left) / r.width * 186), y = Math.round((e.clientY - r.top) / r.height * 221);
        snapshot(); h.strokes = h.strokes || []; stroke = { id: e.pointerId, s: { c: PENS[pen].c, w: PENS[pen].w, p: [x, y] } }; h.strokes.push(stroke.s);
        stroke.el = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); stroke.el.setAttribute('fill', 'none'); stroke.el.setAttribute('stroke', stroke.s.c); stroke.el.setAttribute('stroke-width', stroke.s.w); stroke.el.setAttribute('stroke-linecap', 'round'); stroke.el.setAttribute('stroke-linejoin', 'round'); stroke.el.setAttribute('points', pts(stroke.s.p)); svg.appendChild(stroke.el);
      });
      svg.addEventListener('pointermove', function (e) {
        if (!stroke || stroke.id !== e.pointerId) return;
        var r = board.getBoundingClientRect(), x = Math.round((e.clientX - r.left) / r.width * 186), y = Math.round((e.clientY - r.top) / r.height * 221), p = stroke.s.p;
        if (Math.hypot(x - p[p.length - 2], y - p[p.length - 1]) < 2) return;
        if (p.length > 600) return; p.push(x, y); stroke.el.setAttribute('points', pts(p));
      });
      var endStroke = function (e) { if (!stroke || stroke.id !== e.pointerId) return; stroke = null; changed(); };
      svg.addEventListener('pointerup', endStroke); svg.addEventListener('pointercancel', endStroke);
      /* butoanele de unelte */
      function act(k) {
        var it = h.items[sel];
        if (k === 'undo') { if (!hist.length) return; fut.push(JSON.stringify({ items: h.items, strokes: h.strokes })); restore(hist.pop()); A.sfx('tap'); return; }
        if (k === 'redo') { if (!fut.length) return; hist.push(JSON.stringify({ items: h.items, strokes: h.strokes })); restore(fut.pop()); A.sfx('tap'); return; }
        if (k === 'penoff') { showCat('cl'); return; }
        if (k === 'home') { A.go('0.2'); return; }
        if (k === 'voice') { A.playNarr(true); return; }
        if (k === 'done') return done();
        if (!it) return;
        snapshot();
        if (k === 'rot') { it.r = ((it.r || 0) + 90) % 360; clampSnap(it); snap.classList.remove('on'); upd(sel); A.sfx('snap'); }
        else if (k === 'flip') { it.f = it.f ? 0 : 1; upd(sel); A.sfx('snap'); }
        else if (k === 'front') { h.items.splice(sel, 1); h.items.push(it); sel = h.items.length - 1; paint(); select(sel, true); A.sfx('tap'); }
        else if (k === 'back') { h.items.splice(sel, 1); h.items.unshift(it); sel = 0; paint(); select(sel, true); A.sfx('tap'); }
        else if (k === 'del') { h.items.splice(sel, 1); sel = -1; paint(); A.sfx('whoosh'); hint.textContent = 'Piesa a fost ștearsă.'; }
        changed();
      }
      $$('[data-t]', $('.tools', el)).forEach(function (b) { b.onclick = function () { act(b.dataset.t); }; });
      function done() {
        var n = h.items.length + (h.strokes || []).length;
        if (n < 3) { A.toast('Mai adaugă câteva piese.'); A.sfx('no'); return; }
        A.exDone(true); A.save(); A.sfx('star'); A.go('6.4');
      }
      paint(); showCat('cl');
      if (h.items.length) A.exDone(true);
      return function () { appEl.classList.remove('isbld'); if (ro) ro.disconnect(); window.removeEventListener('resize', fit); makeThumb(); };
    }
  };

  /* ---------- verificarea (6.4) ---------- */
  function clipT(s, k) { var c = (s.clips || []).filter(function (x) { return x.k === k; })[0]; return c ? c.t : ''; }
  SCR.check = {
    html: function (s) {
      var st = A.st(), h = st.house, cl = (h && h.client) || st.client;
      if (!cl || !h || !h.items || !(h.items.length + (h.strokes || []).length)) {
        return '<div class="wrap">' + A.kick(s) + A.title(s) + '<p class="say" style="transform:none">Mai întâi construiește casa. Clientul vine apoi s-o vadă.</p><div class="acts"><button class="btn big pri" type="button" data-a="build">' + I.build + 'Construiește casa</button></div></div>';
      }
      return '<div class="wrap">' + A.kick(s) + A.title(s) + '<div class="check"><div class="col"><div class="thumb"><img src="' + (A.houseThumb() || PH) + '" alt="Casa construită de tine"></div>' +
        '<div class="visitor"><img src="' + FIG[cl].src + '" alt="' + esc(C.clients[cl].name) + '"></div></div>' +
        '<div class="col"><div class="rows">' + KEYS.map(function (k, i) { return '<div class="crow" data-k="' + k + '"><img class="tile" src="' + A.src('semn_' + TILE[cl][i]) + '" alt=""><div><b>' + LAB[cl][i] + '</b><p>…</p></div><span class="res" aria-hidden="true"></span></div>'; }).join('') + '</div>' +
        '<div class="stars4" aria-label="Stelele clientului"></div><p class="fbk" role="status" aria-live="polite"></p>' +
        '<div class="acts"><button class="btn" type="button" data-a="build">' + I.build + 'Mai lucrez la casă</button><button class="btn pri" type="button" data-a="next" disabled>' + I.next + 'Mai departe</button></div></div></div></div>';
    },
    init: function (el, s) {
      $$('[data-a]', el).forEach(function (b) { b.onclick = function () { if (b.dataset.a === 'build') A.go('6.3'); else A.next(); }; });
      var st = A.st(), h = st.house; if (!h || !$('.crow', el)) return;
      var cl = h.client || st.client, an = analyze(h, cl), R = an.r, ok = 0, rows = $$('.crow', el), vis = $('.visitor', el);
      makeThumb();
      var run = function () {
        var i = 0;
        var step = function () {
          if (i >= 4) return fin();
          var k = KEYS[i], res = R[k], row = rows[i], txt = s.rules[cl][k][res] || s.rules[cl][k].no;
          row.classList.add('on', res === 'ok' ? 'ok' : 'no'); $('p', row).textContent = '„' + txt + '”';
          $('.res', row).innerHTML = res === 'ok' ? '<span class="rok">' + I.check + '</span>' : '<span class="rno">' + I.ear + '</span>';
          $('.res', row).setAttribute('aria-label', res === 'ok' ? 'bine' : 'de lucrat');
          if (res === 'ok') { ok++; A.sfx('ok'); } else A.sfx('tap');
          paintStars();
          var key = cl + '.' + k + '.' + res; if (!A.VO.clips['6.4:' + key]) key = cl + '.' + k + '.no';
          A.clip('6.4:' + key, { talk: vis, text: txt }).then(function (fine) { if (fine === false && A.cur() !== '6.4') return; i++; A.later(step, 250); });
        };
        step();
      };
      function paintStars() { var o = ''; for (var j = 0; j < 4; j++) o += j < ok ? I.star : I.star0; $('.stars4', el).innerHTML = o; $('.stars4', el).setAttribute('aria-label', ok + ' stele din 4'); }
      function fin() {
        var keys = []; if (an.clientIn) keys.push('6.4:client.' + cl);
        keys.push(ok === 4 ? '6.4:all.' + cl : '6.4:some');
        var f = $('.fbk', el); f.className = 'fbk ' + (ok === 4 ? 'ok' : 'info');
        f.innerHTML = '<span class="mark">' + (ok === 4 ? I.check : I.ear) + '</span><span>' + esc(ok === 4 ? clipT(s, 'all.' + cl) : clipT(s, 'some')) + '</span>';
        if (ok === 4) { A.confetti(); A.sfx('star'); }
        A.interaction('m6_verificare_' + cl, 'performance', KEYS.map(function (k) { return k + ':' + R[k]; }).join(','), ok === 4 ? 'correct' : 'neutral', 'Verificarea casei de către client');
        A.first('6.4', 0, ok === 4);
        st.checked = { ok: ok, r: R }; A.exDone(true);
        $('[data-a="next"]', el).disabled = false;
        A.clips(keys, 200);
      }
      paintStars();
      A.whenNarr(run);
    }
  };

  /* ---------- explicația (6.5) ---------- */
  SCR.explain = {
    html: function (s) {
      var st = A.st(), cl = (st.house && st.house.client) || st.client || 'g';
      return '<div class="wrap">' + A.kick(s) + A.title(s) + '<div class="expl">' +
        '<div class="sent" aria-live="polite"><span>Am pus</span><span class="slot" data-slot="w">…</span><span>pentru că ' + esc(NAMES[cl]) + '</span><span class="slot" data-slot="y">…</span>' +
        '<button class="ib sm" type="button" data-a="play" aria-label="Ascultă propoziția" disabled>' + I.play + '</button></div>' +
        '<p class="hq" style="margin:0">Ce ai pus în casă?</p><div class="chips" role="group" aria-label="Ce ai pus">' + s.parts.what.map(function (p) { return '<button class="chip" type="button" data-w="' + p.k + '" aria-pressed="false">' + esc(p.t) + '</button>'; }).join('') + '</div>' +
        '<p class="hq" style="margin:0">De ce? Pentru că ' + esc(NAMES[cl]) + '…</p><div class="chips" role="group" aria-label="De ce">' + s.parts.why[cl].map(function (p) { return '<button class="chip" type="button" data-y="' + p.k + '" aria-pressed="false">' + esc(p.t) + '</button>'; }).join('') + '</div>' +
        '<ul class="saidlist" aria-label="Propozițiile tale"></ul></div></div>';
    },
    init: function (el, s) {
      var st = A.st(), cl = (st.house && st.house.client) || st.client || 'g', w = null, y = null, list = st.expl || (st.expl = []);
      var an = st.house ? analyze(st.house, cl) : { f: {} };
      $$('[data-w]', el).forEach(function (b) { if (an.f[b.dataset.w]) { b.classList.add('have'); b.setAttribute('aria-label', b.textContent + ' (este în casa ta)'); } });
      var W2 = {}, Y2 = {}; s.parts.what.forEach(function (p) { W2[p.k] = p.t; }); s.parts.why[cl].forEach(function (p) { Y2[p.k] = p.t; });
      function paint() {
        var sw = $('[data-slot="w"]', el), sy = $('[data-slot="y"]', el);
        sw.textContent = w ? W2[w] : '…'; sw.classList.toggle('f', !!w); sy.textContent = y ? Y2[y] + '.' : '…'; sy.classList.toggle('f', !!y);
        $$('[data-w]', el).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.w === w ? 'true' : 'false'); });
        $$('[data-y]', el).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.y === y ? 'true' : 'false'); });
        $('[data-a="play"]', el).disabled = !(w && y);
        $('.saidlist', el).innerHTML = list.map(function (x) { return '<li>' + I.check + 'Am pus ' + esc(x.t) + '</li>'; }).join('');
      }
      function speak() {
        if (!(w && y)) return;
        var txt = W2[w] + ' pentru că ' + NAMES[cl] + ' ' + Y2[y];
        A.clips(['6.5:am_pus', '6.5:w.' + w, '6.5:pentru_ca', '6.5:n.' + cl, '6.5:y.' + y], 40).then(function (fine) {
          if (!fine) return;
          if (!list.some(function (x) { return x.t === txt; })) { list.push({ t: txt }); if (list.length > 8) list.shift(); }
          A.interaction('m6_explicatie', 'fill-in', 'Am pus ' + txt, 'neutral', 'Explică o alegere');
          A.sfx('star'); A.exDone(true); A.save(); paint();
          A.clip('6.5:bravo', { text: 'Bravo, arhitectule! Ai explicat o alegere.' });
        });
      }
      $$('[data-w]', el).forEach(function (b) { b.onclick = function () { w = b.dataset.w; A.sfx('tap'); paint(); A.clip('6.5:w.' + w, { text: W2[w] }); if (y) A.later(speak, 900); }; });
      $$('[data-y]', el).forEach(function (b) { b.onclick = function () { y = b.dataset.y; A.sfx('tap'); paint(); A.clip('6.5:y.' + y, { text: Y2[y] }); if (w) A.later(speak, 1400); }; });
      $('[data-a="play"]', el).onclick = speak;
      paint(); if (list.length) A.exDone(true);
    }
  };
})();
