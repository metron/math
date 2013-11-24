
Okr=[];
Okr["x"] = [];
Okr["y"] = [];
Okr["R"] = [];
Okr["angle1"] = [];
Okr["angle2"] = [];

Okr["x"][0] = 350;//начало координат по х, центр окружности инверсии
Okr["y"][0] = 350;//начало координат по у
Okr["R"][0] = 330; //радиус основной окружности, окружности интерпретации (инверсии)
n = 7;//начальное значение количества углов многоугольника
r = 3;//начальное значение количества схождений многоугольников в вершинах

Okr["x"][1] = 0;//начальное значение центра ортогональной окружности по х
Okr["y"][1] = 0;//начальное значение координаты центра окружности инверсии по у

P = [];//создаём глобальный массив, где будут храниться все координаты точек
P["x"] = [];//координаты по икс
P["y"] = [];//координаты по игрек
P["last"] = [];//номер групповой операции (инверсии), по которой получена данная точка
//0 - инверсия относительно Ох;
//1 - инверсия относительно Оу;
//2 - инверсия относительно ортогональной окружности
P["color"] = [];//цвета точек
colors = ["#ff0000", "#00ff00", "#0000ff"];

curP = 0;//текущая точка, порождающая ещё две
newP = 1;//новая точка, порождаемая текущей

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
		calcCircule2(1);//вычисляем параметры окружности инверсии и рисуем её
		beginPoints();//вычисляем координаты начальных точек
		//draw();//изображаем все начальные точки
		L2line(0, 2, 2);

		for (var j = 0; j < s; j++) {
			var len = newP;
			while (curP < len) {//перебираем все текущие точки
				switch (P["last"][curP]) {
					//в зависимости от того, как была получена предыдущая точка
					//выполняем другие две операции инверсии
					case 0://точка получена инверсией относительно Ох, тогда делаем
						invOy(curP, newP);
						invCircle2(curP, newP);
						break
					case 1://относительно Оу, тогда делаем
						invOx(curP, newP);
						invCircle2(curP, newP);
						break
					case 2://относительно окружности, тогда делаем
						invOx(curP, newP);
						invOy(curP, newP);
						break
					default:
						break
				}
				del(curP);
				curP++;
			}
		}
		console.log(curP);
		console.log(newP);
	});
};

function drawPuII() {//рисуем интерпретацию и оси координат

	// Рисуем окружность (плоскость Лобачевского).
	ris.strokeStyle = "#000";
	ris.fillStyle = "#f0f0f0";
	ris.beginPath();
	ris.arc(Okr["x"][0], Okr["y"][0], Okr["R"][0], 0, Math.PI * 2, true);
	ris.closePath();
	ris.stroke();
	ris.fill();

	//рисуем оси координат
	ris.moveTo(Okr["x"][0], Okr["y"][0] - Okr["R"][0]);
	ris.lineTo(Okr["x"][0], Okr["y"][0] + Okr["R"][0]);
	ris.moveTo(Okr["x"][0] - Okr["R"][0], Okr["y"][0]);
	ris.lineTo(Okr["x"][0] + Okr["R"][0], Okr["y"][0]);
	ris.stroke();
}

function L2line(i, j, o) {//вычисляем и рисуем прямую, по двум точкам
	//параметры новой окружности кладём в элемент "o"
	invCircle(j, 0, newP);
	var x5 = (P["x"][newP] + P["x"][j]) / 2;
	var y5 = (P["y"][newP] + P["y"][j]) / 2;
	var x6 = (P["x"][i] + P["x"][j]) / 2;
	var y6 = (P["y"][i] + P["y"][j]) / 2;
	var a1 = x6 - P["x"][j];
	var a2 = x5 - P["x"][j];
	var b1 = y6 - P["y"][j];
	var b2 = y5 - P["y"][j];
	var c1 = (-a1)*x6 - b1*y6;
	var c2 = (-a2)*x5 - b2*y5;
	var b2_b1 = b2/b1;
	var a2_a1 = a2/a1;
	Okr["x"][o] = (c1*b2_b1 - c2)/(a2 - a1*b2_b1);
	Okr["y"][o] = (c1*a2_a1 - c2)/(b2 - b1*a2_a1);
	Okr["R"][o] = Math.sqrt(Math.pow(Okr["x"][o] - P["x"][j], 2) + Math.pow(Okr["y"][o] - P["y"][j], 2));
	
	ris.beginPath();
	ris.arc(Okr["x"][o], Okr["y"][o], Okr["R"][o], 0, Math.PI * 2, true);
	ris.stroke();
}

function calcCircule2(num) {//вычисляем и рисуем ортогональную окружность
	a = Math.sin(Math.PI / r);//вычисляем синус альфа
	b = Math.cos(Math.PI / n);//вычисляем косинус бетта
	Okr["R"][num] = Okr["R"][0] / Math.sqrt(b * b - a * a);//вычисляем радиус окружности ортогональной окружности инверсии и пересекающей оси под нужными углами альфа и бетта
	Okr["x"][num] = Okr["x"][0] + Okr["R"][num] * b;//вычисляем центр ортогональной окружности по х
	Okr["y"][num] = Okr["y"][0] + Okr["R"][num] * Math.cos(Math.PI / r);//вычисляем центр ортогональной окружности по у

	//рисуем ортогональную окружность

	ris.beginPath();
	ris.arc(Okr["x"][num], Okr["y"][num], Okr["R"][num], 0, Math.PI * 2, true);
	ris.stroke();
}

function draw() {//функция выводит на экран все точки
	var len = P["x"].length;
	for (var i = 0; i < len; i++) {
		ris.fillStyle = colors[P["color"][i]];
		ris.beginPath();
		ris.arc(P["x"][i], P["y"][i], 2, 0, Math.PI * 2, true);
		ris.closePath();
		ris.stroke();
		ris.fill();
	}
}

function drawPoint(num) {//функция выводит очередную точку на экран
	var color = ris.getImageData(P["x"][num], P["y"][num], 1, 1).data;
	var colorStr = color[0].toString() + color[1].toString() + color[2].toString();
	if (colorStr === "25500" ||
			colorStr === "02550" ||
			colorStr === "00255") {
		ris.fillStyle = "#000000";
		ris.fillText(curP.toString() + "-" + num.toString(), P["x"][num] + 2, P["y"][num] + 10);
		return false;
	} else {
		ris.fillStyle = colors[P["color"][num]];
		ris.fillText(curP.toString() + "-" + num.toString(), P["x"][num] + 2, P["y"][num] - 2);
		ris.strokeStyle = colors[P["color"][num]];
		ris.beginPath();
		ris.arc(P["x"][num], P["y"][num], 1.5, 0, Math.PI * 2, true);
		ris.closePath();
		ris.stroke();
		ris.fill();
		return true;
	}
}

function beginPoints() {//вычисляет координаты первых 5 точек разбиения
	//сначала сбрасываем значения
	P = [];//создаём глобальный массив, где будут храниться все координаты точек
	P["x"] = [];//координаты по икс
	P["y"] = [];//координаты по игрек
	P["last"] = [];//номер групповой операции (инверсии), по которой получена данная точка
	//0 - инверсия относительно Ох;
	//1 - инверсия относительно Оу;
	//2 - инверсия относительно ортогональной окружности
	P["color"] = [];//цвета точек

	if ($("#allpoints").prop("checked")) {//если надо считать все точки
		//начальные значения
		curP = 1;
		newP = 0;
		
		//первая точка - начало координат
		/*P["x"][newP] = Okr["x"][0];
		P["y"][newP] = Okr["y"][0];
		P["color"][newP] = 0;
		drawPoint(newP); newP++;*/
		//вторая точка - точка пересечения оси Оу с окр. инверсии
		P["x"][newP] = Okr["x"][0];
		P["y"][newP] = Okr["y"][1] - Math.sqrt(Math.pow(Okr["R"][1], 2) - Math.pow(Okr["x"][0] - Okr["x"][1], 2));
		P["color"][newP] = 1;
		drawPoint(newP); newP++;
		//третья точка - точка пересечения оси Оx с окр. инверсии
		P["x"][newP] = Okr["x"][1] - Math.sqrt(Math.pow(Okr["R"][1], 2) - Math.pow(Okr["y"][0] - Okr["y"][1], 2));
		P["y"][newP] = Okr["y"][0];
		P["color"][newP] = 2;
		drawPoint(newP); newP++;

		//делаем первичную инверсию
		invOy(curP, newP);
		drawPoint(newP); newP++; curP++;
		//invCircle2(4, 5);
		//drawPoint(5);
		
		//начальные значения для перебора точек
		//curP = 3;//текущая точка, порождающая ещё две
		//newP = 6;//новая точка, порождаемая текущей

	} else {//иначе считаем только вершины многоугольников
		//первая точка - точка пересечения окружности инверсии и оси Ох (эта точка порождает вершины многоугольников)
		P["x"][0] = Okr["x"][1] - Math.sqrt(Okr["R"][1]*Okr["R"][1] - Math.pow(Okr["y"][0] - Okr["y"][1], 2));
		P["y"][0] = Okr["y"][0];
		P["color"][0] = 2;
		drawPoint(0);

		//делаем первичную инверсию
		invOy(0, 1);

		//начальные значения для перебора точек
		curP = 1;//текущая точка, порождающая ещё две
		newP = 2;//новая точка, порождаемая текущей
	}

	return 0;
}

function invCircle(i, o, j) {//инвертировать i-ю точку относительно окружности "o"
	//и результат поместить в j-ю точку
	var a = P["x"][i] - Okr["x"][o];
	var b = P["y"][i] - Okr["y"][o];
	var m = a * a + b * b;
	P["x"][j] = Okr["x"][o] + Okr["R"][o]*Okr["R"][o] * a / m;
	P["y"][j] = Okr["y"][o] + Okr["R"][o]*Okr["R"][o] * b / m;
	P["last"][j] = 2;//делаем отметку, что точка получена инверсией
	P["color"][j] = P["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function invCircle2(i, j) {//инвертировать i-ю точку относительно окружности
	//и результат поместить в j-ю точку
	var a = P["x"][i] - Okr["x"][1];
	var b = P["y"][i] - Okr["y"][1];
	var m = a * a + b * b;
	P["x"][j] = Okr["x"][1] + Okr["R"][1]*Okr["R"][1] * a / m;
	P["y"][j] = Okr["y"][1] + Okr["R"][1]*Okr["R"][1] * b / m;
	P["last"][j] = 2;//делаем отметку, что точка получена инверсией
	P["color"][j] = P["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function invOx(i, j) {//инвертировать i-ю точку относительно оси Ох
	//и результат поместить в j-ю точку
	P["x"][j] = P["x"][i];
	P["y"][j] = 2 * Okr["y"][0] - P["y"][i];
	P["last"][j] = 0;//делаем отметку, что точка получена инверсией
	P["color"][j] = P["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function invOy(i, j) {//инвертировать i-ю точку относительно Оу
	//и результат поместить в j-ю точку
	P["x"][j] = 2 * Okr["x"][0] - P["x"][i];
	P["y"][j] = P["y"][i];
	P["last"][j] = 1;//делаем отметку, что точка получена инверсией
	P["color"][j] = P["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

function del(num) {//освобождаем память занятую num-й точкой
	delete(P["x"][num]);
	delete(P["y"][num]);
	delete(P["last"][num]);
	delete(P["color"][num]);
}
