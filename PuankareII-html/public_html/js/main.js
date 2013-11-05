
R1 = 330; //радиус основной окружности, окружности интерпретации (инверсии)
Ox1 = 350;//начало координат по х, центр окружности инверсии
Oy1 = 350;//начало координат по у
n = 7;//начальное значение количества углов многоугольника
r = 3;//начальное значение количества схождений многоугольников в вершинах
R2 = 0;//начальное значение радиуса окружности ортогональной окружности инверсии и пересекающей оси под нужными углами альфа и бетта
R2p2 = 0;
Ox2 = 0;//начальное значение центра ортогональной окружности по х
Oy2 = 0;//начальное значение координаты центра окружности инверсии по у
//rep

points = [];//создаём глобальный массив, где будут храниться все координаты точек
points["x"] = [];//координаты по икс
points["y"] = [];//координаты по игрек
points["last"] = [];//номер групповой операции (инверсии), по которой получена данная точка
//0 - инверсия относительно Ох;
//1 - инверсия относительно Оу;
//2 - инверсия относительно ортогональной окружности
points["color"] = [];//цвета точек
colors = ["#ff0000", "#00ff00", "#0000ff"];

curPoint = 3;//текущая точка, порождающая ещё две
newPoint = 6;//новая точка, порождаемая текущей

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
		calcCircule2();//вычисляем параметры окружности инверсии и рисуем её
		beginPoints();//вычисляем координаты начальных точек
		draw();//изображаем все начальные точки

		curPoint = 3;//текущая точка, порождающая ещё две
		newPoint = 6;//новая точка, порождаемая текущей
		for (var j = 0; j < s; j++) {
			var len = newPoint;
			while (curPoint < len) {//перебираем все текущие точки
				switch (points["last"][curPoint]) {
					//в зависимости от того, как была получена предыдущая точка
					//выполняем другие две операции инверсии
					case 0://точка получена инверсией относительно Ох, тогда делаем
						invOy(curPoint, newPoint);
						invCircle2(curPoint, newPoint);
						break
					case 1://относительно Оу, тогда делаем
						invOx(curPoint, newPoint);
						invCircle2(curPoint, newPoint);
						break
					case 2://относительно окружности, тогда делаем
						invOx(curPoint, newPoint);
						invOy(curPoint, newPoint);
						break
					default:
						break
				}
				del(curPoint);
				curPoint++;
			}
		}
		console.log(curPoint);
		console.log(newPoint);
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

function calcCircule2() {//вычисляем и рисуем ортогональную окружность
	a = Math.sin(Math.PI / r);//вычисляем синус альфа
	b = Math.cos(Math.PI / n);//вычисляем косинус бетта
	R2 = R1 / Math.sqrt(b * b - a * a);//вычисляем радиус окружности ортогональной окружности инверсии и пересекающей оси под нужными углами альфа и бетта
	Ox2 = Ox1 + R2 * b;//вычисляем центр ортогональной окружности по х
	Oy2 = Oy1 + R2 * Math.cos(Math.PI / r);//вычисляем центр ортогональной окружности по у

	//рисуем ортогональную окружность
	/*
	 ris.beginPath();
	 ris.arc(Ox2, Oy2, R2, 0, Math.PI * 2, true);
	 ris.stroke();
	 */
	R2p2 = R2 * R2;//для ускорения расчётов вычисляем квадрат радиуса
}

function draw() {//функция выводит на экран все точки
	var len = points["x"].length;
	for (var i = 0; i < len; i++) {
		ris.fillStyle = colors[points["color"][i]];
		ris.beginPath();
		ris.arc(points["x"][i], points["y"][i], 2, 0, Math.PI * 2, true);
		ris.closePath();
		ris.stroke();
		ris.fill();
	}
}

function drawPoint(num) {//функция выводит очередную точку на экран
	var color = ris.getImageData(points["x"][num], points["y"][num], 1, 1).data;
	var colorStr = color[0].toString() + color[1].toString() + color[2].toString();
	if (colorStr === "25500" ||
			colorStr === "02550" ||
			colorStr === "00255") {
		return false;
	} else {
		ris.fillStyle = colors[points["color"][num]];
		ris.strokeStyle = colors[points["color"][num]];
		ris.beginPath();
		ris.arc(points["x"][num], points["y"][num], 1.5, 0, Math.PI * 2, true);
		ris.closePath();
		ris.stroke();
		ris.fill();
		return true;
	}
}

function beginPoints() {//вычисляет координаты первых 5 точек разбиения
	//сначала сбрасываем значения
	points = [];//создаём глобальный массив, где будут храниться все координаты точек
	points["x"] = [];//координаты по икс
	points["y"] = [];//координаты по игрек
	points["last"] = [];//номер групповой операции (инверсии), по которой получена данная точка
	//0 - инверсия относительно Ох;
	//1 - инверсия относительно Оу;
	//2 - инверсия относительно ортогональной окружности
	points["color"] = [];//цвета точек
	//первая точка - начало координат
	points["x"][0] = Ox1;
	points["y"][0] = Oy1;
	points["color"][0] = 0;
	//вторая точка - точка пересечения оси Оу с окр. инверсии
	points["x"][1] = Ox1;
	points["y"][1] = Oy2 - Math.sqrt(R2 * R2 - Math.pow(Ox1 - Ox2, 2));
	points["color"][1] = 1;
	//третья точка - точка пересечения оси Оx с окр. инверсии
	points["x"][2] = Ox2 - Math.sqrt(R2 * R2 - Math.pow(Oy1 - Oy2, 2));
	points["y"][2] = Oy1;
	points["color"][2] = 2;

	//делаем первичную инверсию
	invCircle2(0, 3);
	invOx(1, 4);
	invOy(2, 5);

	return 0;
}

function invCircle2(i, j) {//инвертировать i-ю точку относительно окружности
	//и результат поместить в j-ю точку
	var a = points["x"][i] - Ox2;
	var b = points["y"][i] - Oy2;
	var m = a * a + b * b;
	points["x"][j] = Ox2 + R2p2 * a / m;
	points["y"][j] = Oy2 + R2p2 * b / m;
	points["last"][j] = 2;//делаем отметку, что точка получена инверсией
	points["color"][j] = points["color"][i];//цвет повторяем исходной точки
    if (drawPoint(j)) newPoint++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function invOx(i, j) {//инвертировать i-ю точку относительно оси Ох
	//и результат поместить в j-ю точку
	points["x"][j] = points["x"][i];
	points["y"][j] = 2 * Oy1 - points["y"][i];
	points["last"][j] = 0;//делаем отметку, что точка получена инверсией
	points["color"][j] = points["color"][i];//цвет повторяем исходной точки
    if (drawPoint(j)) newPoint++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function invOy(i, j) {//инвертировать i-ю точку относительно Оу
	//и результат поместить в j-ю точку
	points["x"][j] = 2 * Ox1 - points["x"][i];
	points["y"][j] = points["y"][i];
	points["last"][j] = 1;//делаем отметку, что точка получена инверсией
	points["color"][j] = points["color"][i];//цвет повторяем исходной точки
    if (drawPoint(j)) newPoint++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function del(num) {//освобождаем память занятую num-й точкой
	delete(points["x"][num]);
	delete(points["y"][num]);
	delete(points["last"][num]);
	delete(points["color"][num]);
}
