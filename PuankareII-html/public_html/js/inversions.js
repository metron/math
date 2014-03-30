/*
 * Инвертируем одну грань, относительно одного из рёбер.
 */
function invEdge(curE, ribNum, newE) {
	al[2][newE] = [];
	//устанавливаем зеркало в ребре ribNum данного многоугольника (данной грани) curE
	setCircleMirrorByTwoPoints(al[1]["p1"][al[2][curE][ribNum]], al[1]["p2"][al[2][curE][ribNum]]);
	
	firstP = newP;//запоминаем первую вершину
	for (var p = n - 1; p >= 0; p--) {//перебираем начала рёбер текущей грани от нулевой до крайней
		i = al[2][curE][p];//получаем номер очередного ребра
		invInCircleMirror(al[1]["p1"][i], newP);//инверсия точки ребра
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

//инвертировать i-ю точку относительно оси Ох
//и результат поместить в j-ю точку
function invOx(i, j) {
	al[0]["x"][j] = al[0]["x"][i];
	al[0]["y"][j] = 2 * Oy1 - al[0]["y"][i];
	al[0]["last"][j] = 0;//делаем отметку, что точка получена инверсией
	al[0]["color"][j] = al[0]["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}

//инвертировать i-ю точку относительно Оу
//и результат поместить в j-ю точку
function invOy(i, j) {
	al[0]["x"][j] = 2 * Ox1 - al[0]["x"][i];
	al[0]["y"][j] = al[0]["y"][i];
	//al[0]["last"][j] = 1;//делаем отметку, что точка получена инверсией
	al[0]["color"][j] = al[0]["color"][i];//цвет повторяем исходной точки
	//if (drawPoint(j)) newP++;//пытаемся нарисовать точку, если в этом месте ещё ничего не нарисовано
}