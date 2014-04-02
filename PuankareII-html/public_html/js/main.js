
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

mouse_x = 0; 
mouse_y = 0;
pageOx1 = 0;
pageOy1 = 0;

window.onload = function() {
	//определяем центр интерпретации, относительно страницы
	pageOx1 = Ox1 + $("#disk")[0].offsetLeft;
	pageOy1 = Oy1 + $("#disk")[0].offsetTop;
	
	$("#disk").on("mousedown", function(e){
		mouse_x = e.pageX;
		mouse_y = e.pageY;
		console.log("down");
		$("#disk").on("mousemove", function(e){
			console.log(e.clientX, e.clientY);
		});
	});

	$("#disk").on("mouseup", function(e){
		console.log("up");
		$("#disk").off("mousemove");
	});
	
	//создаём объект canvas
	drawingCanvas = document.getElementById('disk');
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

        for (var i = 0; i < al[2][0].length; i++) {
            invEdge(0, i, newEdge);//отражаем нулевую грань, в i-м ребре => создаём и рисуем новую грань
            newEdge++;
        }
		console.log("End");
	});
};

//вычисляем и рисуем ортогональную окружность
function calcCircule2() {
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
		movePointToCenter(j);
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
	
	turnAllPoints(13 * Math.PI / 180);

	return true;
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
