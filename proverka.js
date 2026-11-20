// Проверка расчёта прогноза 2027 по правилам Оксаны (настройки 16.11, орбисы 17.11, куспиды 19.11)
var SPH = [
  {id: 'money', t: 'Деньги', h: [2, 8], main: 2},
  {id: 'work', t: 'Работа и бизнес', h: [10, 6], main: 10},
  {id: 'love', t: 'Отношения', h: [7, 5], main: 7},
  {id: 'home', t: 'Семья и жильё', h: [4], main: 4},
  {id: 'kids', t: 'Дети и творчество', h: [5], main: 5},
  {id: 'health', t: 'Здоровье и силы', h: [1, 6, 8], main: 6},
  {id: 'travel', t: 'Поездки и обучение', h: [3, 9], main: 9}
];
var PL = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
var PNR = {Sun: 'Солнце', Moon: 'Луна', Mercury: 'Меркурий', Venus: 'Венера', Mars: 'Марс', Jupiter: 'Юпитер', Saturn: 'Сатурн', Uranus: 'Уран', Neptune: 'Нептун', Pluto: 'Плутон'};
var PNG = {Sun: 'натальному Солнцу', Moon: 'натальной Луне', Mercury: 'натальному Меркурию', Venus: 'натальной Венере', Mars: 'натальному Марсу', Jupiter: 'натальному Юпитеру', Saturn: 'натальному Сатурну', Uranus: 'натальному Урану', Neptune: 'натальному Нептуну', Pluto: 'натальному Плутону'};
var ASY = {conj: '☌', sex: '⚹', sq: '□', tri: '△', opp: '☍'};
var ORB = {Jupiter: 3, Saturn: 2, Uranus: 1, Neptune: 1, Pluto: 1};
function rg(a, b) { return a === b ? dm(a) : dm(a) + ' - ' + dm(b); }
function calc(Y, M, D, hh, mi, city) {
  var utc = localToUtc(Y, M, D, hh, mi, city[3]), dt = new Date(utc), P = {};
  PL.forEach(function (b) { P[b] = topoLon(b, dt, city[1], city[2]); });
  var C = placidus(dt, city[1], city[2]);
  var H = function (l) { return houseOfCusps(C, l); };
  var out = [];
  SPH.forEach(function (s) {
    var targets = [];
    function add(k, why) { if (!targets.some(function (x) { return x[0] === k; })) targets.push([k, why]); }
    add(RULER[sgn(C[s.main - 1])], 'управитель ' + s.main + ' дома');
    s.h.forEach(function (h) { add(RULER[sgn(C[h - 1])], 'управитель ' + h + ' дома'); });
    PL.forEach(function (b) { if (s.h.indexOf(H(P[b])) >= 0) add(b, 'стоит в ' + H(P[b]) + ' доме'); });
    s.h.forEach(function (h) { add('CUSP' + h, 'куспид ' + h + ' дома'); });
    var per = [];
    ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].forEach(function (T) {
      targets.forEach(function (tg) {
        var isC = tg[0].indexOf('CUSP') === 0, tl = isC ? C[+tg[0].slice(4) - 1] : P[tg[0]], gr = {};
        windows(function (d) { var x = aspX(lonOf(T, d), tl, ORB[T]); return x ? x[0] : null; }).forEach(function (w) { (gr[w.key] = gr[w.key] || []).push(w); });
        Object.keys(gr).forEach(function (a) {
          if (isC && a !== 'conj') return; // правило Оксаны 19.11: к куспидам только соединения
          var ws = gr[a], tone = a === 'conj' ? 'du' : (a === 'sq' || a === 'opp' ? 'bad' : 'ok');
          per.push({tone: tone, t: ws[0].s, ws: ws.map(function (w) { return [w.s, w.e]; }), d: ws.map(function (w) { return rg(w.s, w.e); }).join('; '),
            ti: PNR[T] + ' ' + ASY[a] + ' ' + 'к ' + (isC ? 'куспиду ' + tg[0].slice(4) + ' дома' : PNG[tg[0]] + ' (' + tg[1] + ')')});
        });
      });
    });
    per.sort(function (a, b) { return a.t - b.t; });
    out.push({s: s, per: per});
  });
  return {P: P, C: C, H: H, out: out};
}
var TONE = {ok: ['Благоприятное', 'ok'], bad: ['Напряжённое', 'bad'], du: ['Дуальное', 'du']};
function render(r, label) {
  var h = '<div class="meta">' + label + '</div><details class="nat"><summary>Натальная карта: планеты и дома</summary><table>' +
    PL.map(function (b) { var l = r.P[b]; return '<tr><td>' + PNR[b] + '</td><td>' + Math.floor(l % 30) + '° ' + SIGNS[sgn(l)] + '</td><td>' + r.H(l) + ' дом</td></tr>'; }).join('') +
    r.C.map(function (c, i) { return '<tr><td>Куспид ' + (i + 1) + '</td><td>' + Math.floor(c % 30) + '° ' + SIGNS[sgn(c)] + '</td><td></td></tr>'; }).join('') + '</table></details>';
  r.out.forEach(function (o) {
    h += '<section class="sp"><h2>' + o.s.t + ' <small>(' + o.s.h.join(', ') + ' дом)</small></h2>';
    h += '<div class="qa">' + ANS[o.s.id](o.per).map(function (q) { return '<p class="q">💬 «' + q[0] + '»</p><p class="a">' + q[1].replace(/[\s.]+$/, '') + '</p>'; }).join('') + '</div><p class="ph">Периоды года, на которых основаны ответы:</p>';
    if (!o.per.length) h += '<p class="none">В 2027 медленные планеты эту сферу не затрагивают</p>';
    o.per.forEach(function (p) { h += '<div class="pr ' + p.tone + '"><b>' + TONE[p.tone][0] + '</b> · ' + p.d + '<br><span>' + p.ti + '</span></div>'; });
    h += '</section>';
  });
  document.getElementById('res').innerHTML = h;
}
(function () {
  var dl = document.getElementById('cities');
  dl.innerHTML = CITIES.map(function (c) { return '<option value="' + c[0] + '">'; }).join('');
  document.getElementById('go').onclick = function () {
    var d = document.getElementById('d').value, t = document.getElementById('t').value, cn = document.getElementById('c').value.trim().toLowerCase().replace(/ё/g, 'е');
    var err = document.getElementById('err'); err.textContent = '';
    if (!d || !t) { err.textContent = 'Нужны дата и точное время рождения'; return; }
    var city = null; CITIES.forEach(function (c) { if (!city && c[0].toLowerCase().replace(/ё/g, 'е') === cn) city = c; });
    if (!city) { err.textContent = 'Выберите город из подсказок'; return; }
    var a = d.split('-'), b = t.split(':');
    var r = calc(+a[0], +a[1], +a[2], +b[0], +b[1], city);
    render(r, a[2] + '.' + a[1] + '.' + a[0] + ' · ' + t + ' · ' + city[0] + ' · дома Плацидус, топоцентрика');
  };
})();
