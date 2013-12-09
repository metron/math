
al = [];//массив вершин, рёбер, граней и т.д. для разбиения.
al[0] = [];//массив вершин
al[1] = [];//массив рёбер
al[2] = [];//массив граней

al[0]["x"] = [];//каждая вершина имеет координаты по икс и по игрек
al[0]["y"] = [];
al[0]["color"] = [];//цвета точек
colors = ["#ff0000", "#00ff00", "#0000ff"];

al[1]["p1"] = [];//каждое ребро задаётся двумя точками
al[1]["p2"] = [];

Ox1 = 350;//начало координат по х, центр окружности инверсии
Oy1 = 350;//начало координат по у
R1 = 330; //радиус основной окружности, окружности интерпретации (инверсии)

Ox2 = 0;//начальное значение центра ортогональной окружности по х
Oy2 = 0;//начальное значение координаты центра окружности инверсии по у
R2 = 0; //радиус окружности инверсии

//параметры зеркала (окружности)
Mx = 0;//координаты центра окружности
My = 0;
MR = 0;//и радиус

//параметры зеркала прямой проходящей через О1
MA = 0;//параметры прямой записанной в виде Ах+Ву+С=0
MB = 0;
MC = 0;

n = 7;//начальное значение количества углов многоугольника
r = 3;//начальное значение количества схождений многоугольников в вершинах

curP = 0;//текущая точка, порождающая ещё две
newP = 0;//новая точка, порождаемая текущей

newRib = 0; //индекс в массиве, куда сохранять новое ребро
newEdge = 0;//индекс в массиве, куда сохранять новую грань

details = true;//признак того, что нужно выводить центры граней и середину рёбер.

window.onload = function() {

	//создаём объект canvas
	drawingCanvas = document.getElementById('smile');
	if (drawingCanvas && drawingCanvas.getContext) {
		ris = drawingCanvas.getContext('2d');
	}
	drawPuII();//рисуем интерпретацию и оси координат

	//привязываем обработчик нажатия на кнопку "Нарисовать"
	$("#draw").on("click", function() {
		drawPuII();
		n = $("#n").val();//получаем значение количества углов многоугольника
		r = $("#r").val();//получаем значение количества схождений многоугольников в вершинах
		s = $("#s").val();//количество слоёв для расчётов
		if ($("#allpoints").prop("checked"))//признак, что надо выводить центры рёбер и граней
			details = true;
		else
			details = false;
		
		calcCircule2();//вычисляем параметры окружности инверсии и рисуем её
		beginPoints();//вычисляем координаты начальных точек
		
		invEdge(0, 0, newEdge);//отражаем нулевую грань, в нулевом ребре => создаём и рисуем новую грань
		newEdge++;
	});
};

function drawPuII() {//рисуем интерпретацию и оси координат

	// Рисуем окружность (плоскость Лобачевского).
	ris.strokeStyle = "#000";
	ris.fillStyle = "#f0f0f0";
	ris.beginPath();
	ris.arc(Ox1, Oy1, R1, 0, Math.PI * 2, true);
	ris.closePath();
	ris.stroke();
	ris.fill();

	//рисуем оси координат
	ris.moveTo(Ox1, Oy1 - R1);
	ris.lineTo(Ox1, Oy1 + R1);
	ris.moveTo(Ox1 - R1, Oy1);
	ris.lineTo(Ox1 + R1, Oy1);
	ris.stroke();
}

function L2line(i, j, o) {//вычисляем и рисуем прямую, по двум точкам
	//параметры новой окружности кладём в элемент "o"
	invCircle(j, 0, newP);
	var x5 = (al[0]["x"][newP] + al[0]["x"][j]) / 2;
	var y5 = (al[0]["y"][newP] + al[0]["y"][j]) / 2;
	var x6 = (al[0]["x"][i] + al[0]["x"][j]) / 2;
	var y6 = (al[0]["y"][i] + al[0]["y"][j]) / 2;
	var a1 = x6 - al[0]["x"][j];
	var a2 = x5 - al[0]["x"][j];
	var b1 = y6 - al[0]["y"][j];
	var b2 = y5 - al[0]["y"][j];
	var c1 = (-a1) * x6 - b1 * y6;
	var c2 = (-a2) * x5 - b2 * y5;
	var b2_b1 = b2 / b1;
	var a2_a1 = a2 / a1;
	Okr["x"][o] = (c1 * b2_b1 - c2) / (a2 - a1 * b2_b1);
	Okr["y"][o] = (c1 * a2_a1 - c2) / (b2 - b1 * a2_a1);
	Okr["R"][o] = Math.sqrt(Math.pow(Okr["x"][o] - al[0]["x"][j], 2) + Math.pow(Okr["y"][o] - al[0]["y"][j], 2));

	ris.beginPath();
	ris.arc(Okr["x"][o], Okr["y"][o], Okr["R"][o], 0, Math.PI * 2, true);
	ris.stroke();
}

function calcCircule2() {//вычисляем и рисуем ортогональную окружность
	a = Math.sin(Math.PI / r);//вычисляем синус альфа
	b = Math.cos(Math.PI / n);//вычисляем косинус бетта
	R2 = R1 / Math.sqrt(Math.pow(b, 2) - Math.pow(a, 2));//вычисляем радиус окружности ортогональной окружности инверсии и пересекающей оси под нужными углами альфа и бетта
	Ox2 = Ox1 + R2 * b;//вычисляем центр ортогональной окружности по х
	Oy2 = Oy1 + R2 * Math.cos(Math.PI / r);//вычисляем центр ортогональной окружности по у

	//рисуем ортогональную окружность
	if (details){
		ris.beginPath();
		ris.arc(Ox2, Oy2, R2, 0, Math.PI * 2, true);
		ris.stroke();
	}
}

function draw() {//функция выводит на экран все точки
	var len = al[0]["x"].length;
	for (var i = 0; i < len; i++) {
		ris.fillStyle = colors[al[0]["color"][i]];
		ris.beginPath();
		ris.arc(al[0]["x"][i], al[0]["y"][i], 2, 0, Math.PI * 2, true);
		ris.closePath();
		ris.stroke();
		ris.fill();
	}
}

function drawPoint(num) {//функция выводит очередную точку на экран
	ris.fillStyle = colors[al[0]["color"][num]];
	ris.strokeStyle = colors[al[0]["color"][num]];
	ris.beginPath();
	ris.arc(al[0]["x"][num], al[0]["y"][num], 1.5, 0, Math.PI * 2);
	ris.closePath();
	ris.stroke();
	ris.fill();
	return true;
}

function beginPoints() {//вычисляет координаты первых 5 точек разбиения
	//сначала сбрасываем значения
	al = [];//массив вершин, рёбер, граней и т.д. для разбиения.
	al[0] = [];//массив вершин
	al[1] = [];//массив рёбер
	al[2] = [];//массив граней

	al[0]["x"] = [];//каждая вершина имеет координаты по икс и по игрек
	al[0]["y"] = [];
	al[0]["color"] = [];//цвета точек

	al[1]["p1"] = [];//каждое ребро задаётся двумя точками
	al[1]["p2"] = [];

	//начальные значения
	curP = 2;
	newP = 0;
	newRib = 0;
	newEdge = 0;

	//нулевая точка - начало координат
	al[0]["x"][newP] = Ox1;
	al[0]["y"][newP] = Oy1;
	al[0]["color"][newP] = 0;
	if (details) drawPoint(newP);
	newP++;
	//первая точка - точка пересечения оси Оу с окр. инверсии
	al[0]["x"][newP] = Ox1;
	al[0]["y"][newP] = Oy2 - Math.sqrt(Math.pow(R2, 2) - Math.pow(Ox1 - Ox2, 2));
	al[0]["color"][newP] = 1;
	if (details) drawPoint(newP);
	newP++;
	//вторая точка - точка пересечения оси Оx с окр. инверсии
	al[0]["x"][newP] = Ox2 - Math.sqrt(Math.pow(R2, 2) - Math.pow(Oy1 - Oy2, 2));
	al[0]["y"][newP] = Oy1;
	al[0]["color"][newP] = 2;
	if (details) drawPoint(newP);
	newP++;
	//третья точка - отражение 2 относительно Оу
	invOy(2, newP);
	if (details) drawPoint(newP);
	newP++;

	//делаем первичную инверсию
	setCircleMirror(al[0]["x"][1], al[0]["y"][1]);
	setOrtogLineMirror(al[0]["x"][1], al[0]["y"][1]);

	//сдвигаем все точки так, чтобы центр многоугольника попал в центр интерпретации
	for (var j = 0; j < 4; j++) {
		moveToCenter(j);
	}

	//задаём первое ребро
	al[1]["p1"][newRib] = 2;
	al[1]["p2"][newRib] = 3;
	//рисуем это ребро
	drawRib(newRib);
	newRib++;

	//задаём новую грань
	makeEdge(newEdge);
	newEdge++;

	return true;
}

function invCircle(i, o, j) {//инвертировать i-ю точку относительно окружности "o"
	//и результат поместить в j-ю точку
	var a = al[0]["x"][i] - Okr["x"][o];
	var b = al[0]["y"][i] - Okr["y"][o];
	var m = a * a + b * b;
	al[0]["x"][j] = Okr["x"][o] + Okr["R"][o] * Okr["R"][o] * a / m;
	al[0]["y"][j] = Okr["y"][o] + Okr["R"][o] * Okr["R"][o] * b / m;
	al[0]["last"][j] = 2;//делаем отметку, что точка получена инверсией
	al[0]["color"][j] = al[0]["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function invCircle2(i, j) {//инвертировать i-ю точку относительно окружности
	//и результат поместить в j-ю точку
	var a = al[0]["x"][i] - Ox2;
	var b = al[0]["y"][i] - Oy2;
	var m = a * a + b * b;
	al[0]["x"][j] = Ox2 + R2 * R2 * a / m;
	al[0]["y"][j] = Oy2 + R2 * R2 * b / m;
	al[0]["last"][j] = 2;//делаем отметку, что точка получена инверсией
	al[0]["color"][j] = al[0]["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function invOx(i, j) {//инвертировать i-ю точку относительно оси Ох
	//и результат поместить в j-ю точку
	al[0]["x"][j] = al[0]["x"][i];
	al[0]["y"][j] = 2 * Oy1 - al[0]["y"][i];
	al[0]["last"][j] = 0;//делаем отметку, что точка получена инверсией
	al[0]["color"][j] = al[0]["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function invOy(i, j) {//инвертировать i-ю точку относительно Оу
	//и результат поместить в j-ю точку
	al[0]["x"][j] = 2 * Ox1 - al[0]["x"][i];
	al[0]["y"][j] = al[0]["y"][i];
	//al[0]["last"][j] = 1;//делаем отметку, что точка получена инверсией
	al[0]["color"][j] = al[0]["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function del(num) {//освобождаем память занятую num-й точкой
	delete(al[0]["x"][num]);
	delete(al[0]["y"][num]);
	delete(al[0]["last"][num]);
	delete(al[0]["color"][num]);
}

/*
 * Вычисляет параметры окружности, инверсия точки (Ax, Ay) относительно которой
 * попадает в центр окружности интерпретации
 */
function setCircleMirror(Ax, Ay) {
	var lyamda = Math.pow(R1, 2) / (Math.pow(Ox1 - Ax, 2) + Math.pow(Oy1 - Ay, 2));
	Mx = Ox1 + (Ax - Ox1) * lyamda;
	My = Oy1 + (Ay - Oy1) * lyamda;
	MR = R1 * Math.sqrt(lyamda - 1);
}

/*
 * Вычисляем параметры прямой, проходящей через центр окружности интерпретации,
 * ортогональной отрезку соединяющему точку (Ах, Ау) с центром окружности интерпретации
 */
function setOrtogLineMirror(Ax, Ay) {
	MA = Ox1 - Ax;
	MB = Oy1 - Ay;
	MC = -MA * Ox1 - MB * Oy1;
}

/*
 * Вычисляем параметры прямой, проходящей через центр окружности интерпретации и точку (Ах, Ау)
 */
function setLineMirror(Ax, Ay) {
	MA = Oy1 - Ay;
	MB = Ax - Ox1;
	MC = -MA * Ax - MB * Ay;
}

/*
 * Делает отражение (инверсию) относительно окружности
 */
function invInCircleMirror(i, j) {
	al[0]["color"][j] = al[0]["color"][i];
	var Ax = al[0]["x"][i];
	var Ay = al[0]["y"][i];
	var lyamda = Math.pow(MR, 2) / (Math.pow(Mx - Ax, 2) + Math.pow(My - Ay, 2));
	al[0]["x"][j] = Mx + (Ax - Mx) * lyamda;
	al[0]["y"][j] = My + (Ay - My) * lyamda;
}

/*
 * Делает отражение (инверсию) относительно евклидовой прямой,
 * т.е. прямой проходящей через центр интерпретации
 * см. Ю.В.Садовничий, В.В. Федорчук - Аналитическая геометрия (курс лекций с задачами) стр. 82
 */
function invInLineMirror(i, j) {
	al[0]["color"][j] = al[0]["color"][i];
	var Ax = al[0]["x"][i];
	var Ay = al[0]["y"][i];
	var t1 = -2 * (MA * Ax + MB * Ay + MC) / (Math.pow(MA, 2) + Math.pow(MB, 2));
	al[0]["x"][j] = Ax + t1 * MA;
	al[0]["y"][j] = Ay + t1 * MB;
}

/*
 * Делает два последовательных отражения для заданной точки i,
 * сначала в окружности, потом в прямой, что равносильно сдвигу точки в Л2.
 */
function moveToCenter(i) {
	invInCircleMirror(i, i);
	invInLineMirror(i, i);
	drawPoint(i);
}

/*
 * Рисует отрезок-дугу в интерпретации, соединяющий две заданные точки, по номеру ребра
 * формулы вычисления дуг и углов даны в задаче №5
 */
function drawRib(num) {
	var Ax = al[0]["x"][al[1]["p1"][num]];
	var Ay = al[0]["y"][al[1]["p1"][num]];
	var Bx = al[0]["x"][al[1]["p2"][num]];
	var By = al[0]["y"][al[1]["p2"][num]];
	var lyamdaA = Math.pow(R1, 2) / (Math.pow(Ox1 - Ax, 2) + Math.pow(Oy1 - Ay, 2));
	var Aix = Ox1 + (Ax - Ox1) * lyamdaA;
	var Aiy = Oy1 + (Ay - Oy1) * lyamdaA;
	var lyamdaB = Math.pow(R1, 2) / (Math.pow(Ox1 - Bx, 2) + Math.pow(Oy1 - By, 2));
	var Bix = Ox1 + (Bx - Ox1) * lyamdaB;
	var Biy = Oy1 + (By - Oy1) * lyamdaB;
	var Cax = (Ax + Aix) / 2;
	var Cay = (Ay + Aiy) / 2;
	var Cbx = (Bx + Bix) / 2;
	var Cby = (By + Biy) / 2;
	var a1 = Ax - Aix;
	var b1 = Ay - Aiy;
	var c1 = -a1 * Cax - b1 * Cay;
	var a2 = Bx - Bix;
	var b2 = By - Biy;
	var c2 = -a2 * Cbx - b2 * Cby;
	var Ox2 = (c1 * b2 / b1 - c2) / (a2 - a1 * b2 / b1);
	var Oy2 = (c1 * a2 / a1 - c2) / (b2 - b1 * a2 / a1);
	var R2 = Math.sqrt(Math.pow(Ax - Ox2, 2) + Math.pow(Ay - Oy2, 2));
	var alfa = 2 * Math.asin(Math.sqrt(Math.pow(Ax - Bx, 2) + Math.pow(Ay - By, 2)) / (2 * R2));
	var betta = Math.sign(Ay - Oy2) * 2 * Math.asin(Math.sqrt(Math.pow(Ax - Ox2 - R2, 2) + Math.pow(Ay - Oy2, 2)) / (2 * R2));

	//рисуем дугу
	ris.beginPath();
	ris.arc(Ox2, Oy2, R2, betta, betta + alfa);
	ris.stroke();
}

/*
 * Формируем нулевую грань многоугольника, путём размножения его вершин.
 */
function makeEdge() {
	al[2][newEdge] = [];
	for (i = 0; i < n - 2; i++) {
		//создаём новую точку, очередную вершину многоугольника
		setLineMirror(al[0]["x"][al[1]["p2"][i]], al[0]["y"][al[1]["p2"][i]]);
		//как инверсию первой вершины ребра, относитлеьно прямой проведённой через вторую вершину ребра и центр интерпретации
		invInLineMirror(al[1]["p1"][i], newP);
		
		//запоминаем ребро, как две точки
		al[1]["p1"][newRib] = al[1]["p2"][i];
		al[1]["p2"][newRib] = newP;

		//запоминаем очередное ребро в нулевой грани
		al[2][newEdge].push(i);

		//рисуем новое ребро
		drawRib(newRib);
		newRib++;
		//рисуем новую вершину
		drawPoint(newP);
		newP++;
	}
	
	//крайняя грань формируется из первой и крайней вершины
	al[1]["p1"][newRib] = newP - 1;
	al[1]["p2"][newRib] = al[1]["p1"][0];
	//запоминаем очередное ребро в нулевой грани
	al[2][newEdge].push(i);
	//запоминаем очередное ребро в нулевой грани
	al[2][newEdge].push(newRib);
	//рисуем крайнее ребро
	drawRib(newRib);
	newRib++;
}

/*
 * Формируем нулевую грань многоугольника, путём размножения его вершин.
 */
function invEdge(curE, ribNum, newE) {
	al[2][newE] = [];
	//устанавливаем зеркало в ребре ribNum данного многоугольника (данной грани) curE
	setCircleMirrorByTwoPoints(al[1]["p1"][al[2][curE][ribNum]], al[1]["p2"][al[2][curE][ribNum]]);
	
	firstP = newP;//запоминаем первую вершину
	for (var p = 0; p < n; p++) {//перебираем начала рёбер текущей грани от нулевой до крайней
		i = al[2][curE][p];//получаем номер очередного ребра
		invInCircleMirror(al[1]["p1"][i], newP);//инверсия первой точки ребра
		//рисуем новую вершину
		drawPoint(newP);
		newP++;
	}
	
	for (p = firstP + 1; p < newP; p++){//перебираем все вершины новой грани и запоминаем рёбра, как две вершины каждое ребро
		al[1]["p1"][newRib] = p - 1;
		al[1]["p2"][newRib] = p;
		
		//запоминаем очередное ребро в нулевой грани
		al[2][newE].push(newRib);

		//рисуем новое ребро
		drawRib(newRib);
		newRib++;
	}
	al[1]["p1"][newRib] = p - 1;
	al[1]["p2"][newRib] = firstP;

	//запоминаем очередное ребро в нулевой грани
	al[2][newE].push(newRib);

	//рисуем новое ребро
	drawRib(newRib);
	newRib++;
}

/*
 * Находим зеркало-дугу, по двум точкам.
 * Это можно сделать из задачи №5, как промежуточный результат, задачи рисования Л2 отрезка в интерпретации
 * Функция drawRib
 */
function setCircleMirrorByTwoPoints(p1, p2) {
	var Ax = al[0]["x"][p1];
	var Ay = al[0]["y"][p1];
	var Bx = al[0]["x"][p2];
	var By = al[0]["y"][p2];
	var lyamdaA = Math.pow(R1, 2) / (Math.pow(Ox1 - Ax, 2) + Math.pow(Oy1 - Ay, 2));
	var Aix = Ox1 + (Ax - Ox1) * lyamdaA;
	var Aiy = Oy1 + (Ay - Oy1) * lyamdaA;
	var lyamdaB = Math.pow(R1, 2) / (Math.pow(Ox1 - Bx, 2) + Math.pow(Oy1 - By, 2));
	var Bix = Ox1 + (Bx - Ox1) * lyamdaB;
	var Biy = Oy1 + (By - Oy1) * lyamdaB;
	var Cax = (Ax + Aix) / 2;
	var Cay = (Ay + Aiy) / 2;
	var Cbx = (Bx + Bix) / 2;
	var Cby = (By + Biy) / 2;
	var a1 = Ax - Aix;
	var b1 = Ay - Aiy;
	var c1 = -a1 * Cax - b1 * Cay;
	var a2 = Bx - Bix;
	var b2 = By - Biy;
	var c2 = -a2 * Cbx - b2 * Cby;
	Mx = (c1 * b2 / b1 - c2) / (a2 - a1 * b2 / b1);
	My = (c1 * a2 / a1 - c2) / (b2 - b1 * a2 / a1);
	MR = Math.sqrt(Math.pow(Ax - Mx, 2) + Math.pow(Ay - My, 2));
}