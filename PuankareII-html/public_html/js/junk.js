//освобождаем память занятую num-й точкой
function del(num) {
	delete(al[0]["x"][num]);
	delete(al[0]["y"][num]);
	delete(al[0]["last"][num]);
	delete(al[0]["color"][num]);
}

//вычисляем и рисуем прямую, по двум точкам
function L2line(i, j, o) {
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

//инвертировать i-ю точку относительно окружности "o"
function invCircle(i, o, j) {
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

//инвертировать i-ю точку относительно окружности
function invCircle2(i, j) {
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