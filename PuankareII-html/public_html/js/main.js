
R1 = 330; //радиус основной окружности, окружности интерпретации (инверсии)
Ox1 = 350;//начало координат по х, центр окружности инверсии
Oy1 = 350;//начало координат по у
n = 7;//начальное значение количества углов многоугольника
r = 3;//начальное значение количества схождений многоугольников в вершинах
R2 = 0;//начальное значение радиуса окружности ортогональной окружности инверсии и пересекающей оси под нужными углами альфа и бетта
Ox2 = 0;//начальное значение центра ортогональной окружности по х
Oy2 = 0;//начальное значение координаты центра окружности инверсии по у

points = [];//создаём глобальный массив, где будут храниться все координаты точек
points["x"] = [];//координаты по икс
points["y"] = [];//координаты по игрек
points["last"] = [];//номер групповой операции (инверсии), по которой получена данная точка
//0 - инверсия относительно Ох;
//1 - инверсия относительно Оу;
//2 - инверсия относительно ортогональной окружности
points["color"] = [];//цвета точек
colors = ["#00ff00", "#ff0000"];


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
	calcCircule2();//вычисляем параметры окружности инверсии и рисуем её
	beginPoints();//вычисляем координаты начальных точек
	draw();//изображаем все начальные точки

	var curPoint = 3;//текущая точка, порождающая ещё две
	var newPoint = 5;//новая точка, порождаемая текущей
	for (var j = 0; j < 13; j++) {
	    var len = points["x"].length;
	    for (var i = curPoint; i < len; i++) {//перебираем все текущие точки
		switch (points["last"][curPoint]) {
		    //в зависимости от того, как была получена предыдущая точка
		    //выполняем другие две операции инверсии
		    case 0://точка получена инверсией относительно Ох
			invOy(curPoint, newPoint);
			drawPoint(newPoint);
			newPoint++;
			invCircle2(curPoint, newPoint);
			drawPoint(newPoint);
			newPoint++;
			break
		    case 1://относительно Оу
			invOx(curPoint, newPoint);
			newPoint++;
			drawPoint(newPoint);
			invCircle2(curPoint, newPoint);
			drawPoint(newPoint);
			newPoint++;
			break
		    case 2://относительно окружности
			invOx(curPoint, newPoint);
			drawPoint(newPoint);
			newPoint++;
			invOy(curPoint, newPoint);
			drawPoint(newPoint);
			newPoint++;
			break
		    default:
			break
		}
		del(curPoint);
		curPoint++;
	    }
	}
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
    ris.beginPath();
    ris.arc(Ox2, Oy2, R2, 0, Math.PI * 2, true);
    ris.stroke();
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
    ris.fillStyle = colors[points["color"][num]];
    ris.beginPath();
    ris.arc(points["x"][num], points["y"][num], 2, 0, Math.PI * 2, true);
    ris.closePath();
    ris.stroke();
    ris.fill();
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

    points["x"][0] = Ox1;//первая точка - начало координат
    points["y"][0] = Oy1;
    points["color"][0] = 0;
    points["x"][1] = Ox1;//вторая точка - точка пересечения оси Оу с окр. инверсии
    points["y"][1] = Oy2 - Math.sqrt(R2 * R2 - Math.pow(Ox1 - Ox2, 2));
    points["color"][1] = 1;

    //третья точка получается, как инверсия второй точки относительно оси Ох
    invOx(1, 2);

    //вычисляем координаты четвёртой точки
    //как инверсию начала координат (первой точки) относительно окружности группы
    invCircle2(0, 3);

    //пятая точка = инверсия третьей относительно окружности
    invCircle2(2, 4);

    return 0;
}

function invCircle2(i, j) {//инвертировать i-ю точку относительно окружности
    //и результат поместить в j-ю точку
    var R2p2 = R2 * R2;
    var x0 = points["x"][i];
    var y0 = points["y"][i];
    var a = x0 - Ox2;
    var b = y0 - Oy2;
    var m = a * a + b * b;
    points["x"][j] = Ox2 + R2p2 * a / m;
    points["y"][j] = Oy2 + R2p2 * b / m;
    points["last"][j] = 2;//делаем отметку, что точка получена инверсией
    points["color"][j] = points["color"][i];//цвет повторяем исходной точки
}

function invOx(i, j) {//инвертировать i-ю точку относительно оси Ох
    //и результат поместить в j-ю точку
    points["x"][j] = points["x"][i];
    points["y"][j] = 2 * Oy1 - points["y"][i];
    points["last"][j] = 0;//делаем отметку, что точка получена инверсией
    points["color"][j] = points["color"][i];//цвет повторяем исходной точки
}

function invOy(i, j) {//инвертировать i-ю точку относительно Оу
    //и результат поместить в j-ю точку
    points["x"][j] = 2 * Ox1 - points["x"][i];
    points["y"][j] = points["y"][i];
    points["last"][j] = 1;//делаем отметку, что точка получена инверсией
    points["color"][j] = points["color"][i];//цвет повторяем исходной точки
}

function del(num) {//освобождаем память занятую num-й точкой
    delete(points["x"][num]);
    delete(points["y"][num]);
    delete(points["last"][num]);
    delete(points["color"][num]);
}
