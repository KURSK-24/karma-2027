// Вид как PDF Оксаны за 1 990: соляр и 12 дней -> 7 сфер (ответы -> обзор -> благоприятные -> дуальные -> напряжённые -> компенсаторика)
var PKEY = {'Юпитер': 'Jupiter', 'Сатурн': 'Saturn', 'Уран': 'Uranus', 'Нептун': 'Neptune', 'Плутон': 'Pluto'};
function esc(s) { return String(s).replace(/[.\s]+$/, ''); }
function groups(list) {
  var g = {}, order = [];
  list.forEach(function (p) { var k = p.ti.split(' ')[0] + '|' + p.tone; if (!g[k]) { g[k] = []; order.push(k); } g[k].push(p); });
  return order.map(function (k) { return g[k]; });
}
function card(ps, lib) {
  var p0 = ps[0], L = lib[PKEY[p0.ti.split(' ')[0]]][p0.tone];
  var tag = p0.tone === 'ok' ? '☺ Благоприятное влияние' : p0.tone === 'bad' ? '☹ Напряжённое влияние' : '◐ Дуальное влияние';
  var titles = ps.map(function (p) { return p.ti.replace(/ \(.*\)$/, ''); }), dates = [];
  ps.forEach(function (p) { p.d.split('; ').forEach(function (d) { if (dates.indexOf(d) < 0) dates.push(d); }); });
  return '<div class="per"><h4>' + titles.join('<br>') + '</h4><div class="box"><span class="pill">' + tag + '</span>' +
    dates.map(function (d) { return '<span class="date">🗓 ' + d + '</span>'; }).join('') + '</div>' +
    L.txt.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
    '<h5>Возможные события:</h5><ul>' + L.ev.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
    '<h5>Рекомендации:</h5><ul>' + L.rec.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
}
render = function (r, label) {
  var h = '<div class="meta">' + label + '</div>';
  h += '<section class="sp"><div class="kick">ВАШ ГОД ✦</div><h2>КАК ИСПОЛЬЗОВАТЬ СОЛЯР, ЧТОБЫ ОН ПОМОГАЛ В ЖИЗНИ</h2>' + SOLAR.intro.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
    '<h3>Как запустить соляр: 12 дней (по желанию)</h3><p>Считайте от своего дня рождения: день рождения это день 1, следующий день это день 2 и так далее</p>' +
    SOLAR.days.map(function (d) { return '<details class="day"><summary><b>День ' + d[0] + '</b> · ' + d[1] + '</summary><p>' + esc(d[2]) + '</p></details>'; }).join('') + '</section>';
  r.out.forEach(function (o) {
    var lib = LIBS[o.s.id];
    h += '<section class="sp"><div class="kick">ПРОГНОЗ ПО СФЕРЕ ✦</div><h2>' + o.s.t.toUpperCase() + ' В 2027 ГОДУ</h2>';
    h += '<h3>Ответы на ваши вопросы</h3><p class="lead2">Почему так, вы увидите ниже: в периодах года ↓</p>' + ANS[o.s.id](o.per).map(function (q) { return '<p class="q">«' + q[0] + '»</p><p>' + esc(q[1]) + '</p>'; }).join('');
    h += '<h3>Что год приносит в этой сфере</h3>' + lib.over.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    [['ok', 'Благоприятные периоды'], ['du', 'Дуальные периоды: и шанс, и проверка'], ['bad', 'Напряжённые периоды']].forEach(function (x) {
      var ps = o.per.filter(function (p) { return p.tone === x[0]; });
      if (ps.length) h += '<h3>' + x[1] + '</h3>' + groups(ps).map(function (g) { return card(g, lib.lib); }).join('');
    });
    if (!o.per.length) h += '<p>В 2027 медленные планеты эту сферу не затрагивают: спокойный год, без резких поворотов</p>';
    h += '<h3>Компенсаторика: что делать</h3><ol class="komp">' + lib.komp.map(function (k) { return '<li><b>' + k[0] + '</b> ' + esc(k[1]) + '</li>'; }).join('') + '</ol>';
    h += '</section>';
  });
  h += '<div class="quote">Как все сферы связаны между собой именно у Вас, я разбираю лично в персональном прогнозе на 2027 год</div>';
  document.getElementById('res').innerHTML = h;
};
(function () {
  var q = new URLSearchParams(location.search);
  if (q.get('d')) { document.getElementById('d').value = q.get('d'); document.getElementById('t').value = q.get('t') || ''; document.getElementById('c').value = q.get('c') || ''; setTimeout(function () { document.getElementById('go').click(); }, 100); }
})();
