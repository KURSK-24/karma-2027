// Вид как PDF Оксаны: ответы на вопросы -> обзор сферы -> благоприятные -> напряжённые -> компенсаторика
var PKEY = {'Юпитер': 'Jupiter', 'Сатурн': 'Saturn', 'Уран': 'Uranus', 'Нептун': 'Neptune', 'Плутон': 'Pluto'};
function esc(s) { return String(s).replace(/[.\s]+$/, ''); }
function periodCard(p, good, lib) {
  var L = lib[PKEY[p.ti.split(' ')[0]]][p.tone];
  var tag = p.tone === 'ok' ? '☺ Благоприятное влияние' : p.tone === 'bad' ? '☹ Напряжённое влияние' : '◐ Дуальное влияние';
  return '<div class="per"><h4>' + p.ti.replace(/ \(.*\)$/, '') + '</h4><div class="box"><span class="pill">' + tag + '</span>' +
    p.d.split('; ').map(function (d) { return '<span class="date">🗓 ' + d + '</span>'; }).join('') + '</div>' +
    L.txt.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
    '<h5>Возможные события:</h5><ul>' + L.ev.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
    '<h5>Рекомендации:</h5><ul>' + L.rec.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
}
render = function (r, label) {
  var h = '<div class="meta">' + label + '</div>';
  r.out.forEach(function (o) {
    var lib = LIBS[o.s.id];
    h += '<section class="sp"><div class="kick">ПРОГНОЗ ПО СФЕРЕ ✦</div><h2>' + o.s.t.toUpperCase() + ' В 2027 ГОДУ</h2>';
    h += '<h3>Ответы на ваши вопросы</h3>' + ANS[o.s.id](o.per).map(function (q) { return '<p class="q">«' + q[0] + '»</p><p>' + esc(q[1]) + '</p>'; }).join('');
    if (!lib) { h += '<p class="todo">Тексты периодов для этой сферы ещё пишутся</p></section>'; return; }
    h += '<h3>Что год приносит в этой сфере</h3>' + lib.over.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
    var g = o.per.filter(function (p) { return p.tone !== 'bad'; }), b = o.per.filter(function (p) { return p.tone === 'bad'; });
    if (g.length) h += '<h3>Благоприятные периоды</h3>' + g.map(function (p) { return periodCard(p, true, lib.lib); }).join('');
    if (b.length) h += '<h3>Напряжённые периоды</h3>' + b.map(function (p) { return periodCard(p, false, lib.lib); }).join('');
    h += '<h3>Компенсаторика: что делать</h3><ol class="komp">' + lib.komp.map(function (k) { return '<li><b>' + k[0] + '</b> ' + esc(k[1]) + '</li>'; }).join('') + '</ol>';
    h += '<div class="quote">Как все сферы связаны между собой именно у Вас, я разбираю лично в персональном прогнозе на 2027 год</div></section>';
  });
  document.getElementById('res').innerHTML = h;
};
