// PDF «Все сферы» по структуре прогноза Оксаны (Галина 2027): соляр -> фон по Асценденту -> Солнце соляра -> сферы из соляра -> проверки -> компенсаторика -> периоды по датам
var PL10 = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
var PN_R = {Sun: 'Солнце', Moon: 'Луна', Mercury: 'Меркурий', Venus: 'Венера', Mars: 'Марс', Jupiter: 'Юпитер', Saturn: 'Сатурн', Uranus: 'Уран', Neptune: 'Нептун', Pluto: 'Плутон'};
var SIGN_IN = ['Овне', 'Тельце', 'Близнецах', 'Раке', 'Льве', 'Деве', 'Весах', 'Скорпионе', 'Стрельце', 'Козероге', 'Водолее', 'Рыбах'];
var HTHEME = {1: 'вас самих: внешности, самочувствия и личных решений', 2: 'личных денег и доходов', 3: 'общения, учёбы, документов и коротких поездок', 4: 'дома, семьи и недвижимости', 5: 'любви, детей и творчества', 6: 'работы, режима и здоровья', 7: 'партнёрства и брака', 8: 'общих денег, кредитов и глубоких перемен', 9: 'дальних поездок, учёбы и расширения горизонтов', 10: 'карьеры, статуса и больших целей', 11: 'друзей, сообществ и планов на будущее', 12: 'отдыха, уединения и внутренней работы'};
var PMEAN = {Sun: 'здесь главная тема года, сюда уйдёт больше всего сил и внимания', Moon: 'тема живая и переменчивая, многое здесь будет меняться по ходу года и задевать эмоции', Mercury: 'много разговоров, переписки, документов и решений', Venus: 'приятные события, удовольствие, деньги и тёплые встречи', Mars: 'активность и инициатива, но и спешка, споры, желание всё сделать быстро', Jupiter: 'рост, удача и расширение возможностей', Saturn: 'ответственность и проверка: результат медленный, но прочный', Uranus: 'неожиданные перемены и новый формат, который раньше не пробовали', Neptune: 'вдохновение и интуиция, но и неясность: здесь важно всё перепроверять', Pluto: 'глубокая перестройка: что-то уходит, чтобы освободить место новому'};
var oldRender = render;
function solar(Y, M, D, hh, mi, city) {
  var utc = localToUtc(Y, M, D, hh, mi, city[3]), nat = new Date(utc), sunLon = lonOf('Sun', nat);
  var yr = M >= 7 ? 2026 : 2027; // берём соляр, который покрывает большую часть 2027 года
  var sr = A.SearchSunLongitude(sunLon, new Date(Date.UTC(yr, M - 1, D) - 5 * 864e5), 15).date;
  var C = placidus(sr, city[1], city[2]), P = {};
  PL10.forEach(function (b) { P[b] = topoLon(b, sr, city[1], city[2]); });
  return {date: sr, C: C, P: P, H: function (l) { return houseOfCusps(C, l); }, asc: sgn(C[0])};
}
function fmtDT(d, zone) { return new Intl.DateTimeFormat('ru-RU', {timeZone: zone, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}).format(d).replace(',', ' ·'); }
function P_(t) { return '<p>' + esc(t) + '</p>'; }
render = function (r, label) {
  var Q = new URLSearchParams(location.search);
  if ((Q.get('sp') || 'all') !== 'all') return oldRender(r, label);
  var NM = Q.get('name') || '', a = document.getElementById('d').value.split('-'), t = document.getElementById('t').value.split(':');
  var cn = document.getElementById('c').value.trim().toLowerCase().replace(/ё/g, 'е'), city = null;
  CITIES.forEach(function (c) { if (!city && c[0].toLowerCase().replace(/ё/g, 'е') === cn) city = c; });
  if (Q.get('pdf')) document.body.classList.add('pdf');
  var S = solar(+a[0], +a[1], +a[2], +t[0], +t[1], city), sunH = S.H(S.P.Sun), satH = S.H(S.P.Saturn);
  var h = '<div class="cover"><div class="kick">ПЕРСОНАЛЬНЫЙ ПРОГНОЗ ✦</div><div class="cn">' + NM.toUpperCase() + '</div><div class="ct">Ваш 2027 год: соляр и все сферы</div><div class="meta">' + label.split(' · дома')[0] + '</div><div class="pillc">Оксана Смирнова · астролог</div></div>';
  h += '<div class="meta">' + label + '</div>';
  // 1. соляр и 12 дней
  h += '<section class="sp"><div class="kick">ВАШ СОЛЯР ✦</div><h2>СОЛЯР ' + fmtDT(S.date, city[3]) + '</h2><p class="lead2">Соляр начинает действовать в день рождения и действует 365 дней, до следующего дня рождения</p><h3>Как использовать соляр, чтобы он помогал в жизни</h3>' + SOLAR.intro.map(P_).join('') +
    '<h3>Как запустить соляр: 12 дней (по желанию)</h3>' + SOLAR.days.map(function (d) { return '<details class="day"><summary><b>День ' + d[0] + '</b> · ' + d[1] + '</summary><p>' + esc(d[2]) + '</p></details>'; }).join('') + '</section>';
  // 2. общий фон по Асценденту соляра (тексты Оксаны)
  h += '<section class="sp"><div class="kick">ОБЩИЙ ФОН ✦</div><h2>ОБЩИЙ ФОН И НАСТРОЕНИЕ ГОДА</h2><h3>Асцендент соляра в ' + SIGN_IN[S.asc] + '</h3>' + (ASC_TXT[S.asc] || []).map(P_).join('') + '</section>';
  // 3. Солнце соляра
  h += '<section class="sp"><div class="kick">ГЛАВНОЕ ✦</div><h2>САМЫЕ ЯРКИЕ СОБЫТИЯ ГОДА</h2><p>Положение солярного Солнца показывает сферу, в которой могут происходить самые заметные для Вас события года. К ней придётся возвращаться, вкладывать силы, принимать решения. Даже если изначально Вы собирались заниматься совсем другими делами, обстоятельства могут регулярно переключать Ваше внимание именно сюда</p>' +
    '<h3>Солнце соляра в ' + sunH + ' доме</h3><p>В Вашем случае на первый план выходит тема ' + HTHEME[sunH] + '. Здесь будет больше всего событий, решений и перемен</p>' + '</section>';
  // 4. сферы: выжимка из соляра + ответы на вопросы
  h += '<section class="sp"><div class="kick">ПО СФЕРАМ ✦</div><h2>ЧТО СОЛЯР ПОКАЗЫВАЕТ ПО КАЖДОЙ СФЕРЕ</h2>';
  var EMO = {money: '💰', work: '💼', love: '❤️', home: '🏡', kids: '🧸', health: '🌿', travel: '✈️'};
  r.out.forEach(function (o, oi) {
    var inS = PL10.filter(function (b) { return o.s.h.indexOf(S.H(S.P[b])) >= 0; });
    h += '<div class="sf ' + (oi % 2 ? 'sf-dark' : 'sf-light') + '"><div class="sfh">' + EMO[o.s.id] + ' ' + o.s.t.toUpperCase() + '</div>';
    if (inS.length) h += inS.map(function (b) { var hh = S.H(S.P[b]); return '<p><b>' + PN_R[b] + ' в ' + hh + ' доме соляра</b> (' + HTHEME[hh] + '): ' + PMEAN[b] + '</p>'; }).join('');
    else h += '<p>Планет соляра в этой сфере нет. Сфера в 2027 спокойная, без главных событий года, а её оттенки покажут периоды ниже</p>';
    h += ANS[o.s.id](o.per).map(function (q) { return '<p class="q">💬 «' + q[0] + '»</p><p>' + esc(q[1]) + '</p>'; }).join('') + '</div>';
  });
  h += '</section>';
  // 5. главные проверки года
  h += '<section class="sp"><div class="kick">ПРОВЕРКИ ✦</div><h2>ГЛАВНЫЕ ПРОВЕРКИ ГОДА</h2><h3>Сатурн в ' + satH + ' доме соляра</h3><p>Главная проверка года проходит через тему ' + HTHEME[satH] + '. Здесь придётся взять ответственность, потерпеть и выстроить порядок. Результат будет медленным, но прочным</p></section>';
  // 6. компенсаторика Оксаны по планетам в домах соляра
  h += '<section class="sp"><div class="kick">ЧТО ДЕЛАТЬ ✦</div><h2>ГЛАВНАЯ АСТРОЛОГИЧЕСКАЯ КОМПЕНСАТОРИКА НА ГОД</h2><p>Эти действия стоит постепенно встроить в свой образ жизни и возвращаться к ним в течение года. Компенсаторика смягчает напряжённые проявления планет через осознанные действия. Это не гарантия отсутствия сложностей, но регулярные действия помогают нивелировать многие негативные события</p>';
  var n = 0;
  ['Saturn', 'Uranus', 'Neptune', 'Pluto', 'Mars'].forEach(function (b) {
    var hh = S.H(S.P[b]), pts = (KOMP_SOL[b] || {})[hh];
    if (pts && pts.length) h += '<h3>' + PN_R[b] + ' в ' + hh + ' доме соляра</h3><ol class="komp" start="' + (n + 1) + '">' + pts.map(function (x) { n++; return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>';
  });
  h += '</section>';
  // 7. периоды года одним списком по датам
  var all = [], seen = {};
  r.out.forEach(function (o) { o.per.forEach(function (p) { var k = p.ti + '|' + p.d; if (!seen[k]) { seen[k] = 1; all.push({p: p, lib: LIBS[o.s.id].lib}); } }); });
  all.sort(function (x, y) { return x.p.t - y.p.t; });
  [['ok', 'САМЫЕ БЛАГОПРИЯТНЫЕ ПЕРИОДЫ ГОДА'], ['du', 'ДУАЛЬНЫЕ ПЕРИОДЫ ГОДА'], ['bad', 'САМЫЕ НАПРЯЖЁННЫЕ ПЕРИОДЫ ГОДА']].forEach(function (x) {
    var ps = all.filter(function (e) { return e.p.tone === x[0]; });
    if (ps.length) h += '<section class="sp"><div class="kick">ПЕРИОДЫ ✦</div><h2>' + x[1] + '</h2>' + ps.map(function (e, i) { return '<div class="sf ' + (i % 2 ? 'sf-dark' : 'sf-light') + '">' + card([e.p], e.lib).replace('<h4>', '<h4>' + (i + 1) + '. ') + '</div>'; }).join('') + '</section>';
  });
  h += '<div class="quote">Как все сферы связаны между собой именно у Вас, я разбираю лично в персональном прогнозе на 2027 год</div>';
  document.getElementById('res').innerHTML = h;
};
