//функция выводит точку с заданным номером на экран
function drawPoint(num) {
	ris.fillStyle = colors[al[0]["color"][num]];
	ris.strokeStyle = colors[al[0]["color"][num]];
	if (details) ris.fillText(num.toString(), al[0]["x"][num] + 2, al[0]["y"][num] - 2);
	ris.beginPath();
	ris.arc(al[0]["x"][num], al[0]["y"][num], 1.5, 0, Math.PI * 2);
	ris.closePath();
	ris.stroke();
	ris.fill();
	return true;
}

//функция выводит на экран все точки
function drawAllPoints() {
	for (var i = 0; i < al[0]["x"].length; i++) {
		ris.fillStyle = colors[al[0]["color"][i]];
		ris.beginPath();
		ris.arc(al[0]["x"][i], al[0]["y"][i], 2, 0, Math.PI * 2, true);
		ris.closePath();
		ris.stroke();
		ris.fill();
	}
}

//перерисовываем все рёбра
function drawAllRibs(){
	for (var i = 0; i < al[1]["p1"].length; i++) {
		drawRib(i);
	}
}

//поворачиваем всю картинку на некоторый угол
function turnAllPoints(angle) {
	drawPuII();//очищаем поле
	//перебираем все вершины и поворачиваем их на заданный угол вокруг начала координат Ox1, Oy1
	for (var i = 0; i < al[0]["x"].length; i++) {
		//drawPoint(i);
		var Ax = al[0]["x"][i];
		var Ay = al[0]["y"][i];
		var x = Ax - Ox1;
		var y = Ay - Oy1;
		var R = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		if (x !== 0) alfa = Math.atan(y / x); else alfa = Math.sign(y) * Math.PI / 2; 
		if (Math.sign(x) === -1) koef = Math.PI; else koef = 0;
		var betta = koef + alfa + angle;
		al[0]["x"][i] = R * Math.cos(betta) + Ox1;
		al[0]["y"][i] = R * Math.sin(betta) + Oy1;
		drawPoint(i);//прорисовываем новое положение точки
		console.log(i);
	}
	drawAllRibs();//прорисовываем все грани
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
	//console.log((Bx-Ax)*Ox1 + (By-Ay)*Oy1 + (Ax-Bx)*Bx + (Ay-By)*By);
	if (details) ris.fillText(num.toString(), (Ax+Bx)/2 + 2, (Ay+By)/2 - 2);
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
	if ( Math.abs(a1) < 1e-10 ) {
		drawSimpleLine(al[1]["p1"][num], al[1]["p2"][num]);
		return;
	}
	var b1 = Ay - Aiy;
	if ( Math.abs(b1) < 1e-10 ) {
		drawSimpleLine(al[1]["p1"][num], al[1]["p2"][num]);
		return;
	}
	var c1 = -a1 * Cax - b1 * Cay;
	var a2 = Bx - Bix;
	var b2 = By - Biy;
	var koef = a2/a1 - b2/b1;
	var c2 = -a2 * Cbx - b2 * Cby;
	var Ox2 = (c1 * b2 / b1 - c2) / (a2 - a1 * b2 / b1);
	var Oy2 = (c1 * a2 / a1 - c2) / (b2 - b1 * a2 / a1);
	var R2 = Math.sqrt(Math.pow(Ax - Ox2, 2) + Math.pow(Ay - Oy2, 2));
	sig_x = Math.sign(Ax - Ox2);
	sig_y = Math.sign(Ay - Oy2);
	sig_betta = sig_x * sig_y;
	var alfa = 2 * Math.asin(Math.sqrt(Math.pow(Ax - Bx, 2) + Math.pow(Ay - By, 2)) / (2 * R2));
	//var alfa = 2 * Math.PI;
	var betta = sig_y * 2 * Math.asin(Math.sqrt(Math.pow(Ax - Ox2 - R2, 2) + Math.pow(Ay - Oy2, 2)) / (2 * R2));

	//рисуем дугу
	ris.beginPath();
	ris.arc(Ox2, Oy2, R2, betta, betta + alfa);
	ris.stroke();
	console.log(sig_betta);
}

//рисуем интерпретацию и оси координат
function drawPuII() {
	//очищаем поле
	ris.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
	
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

/*
 * Делает два последовательных отражения для заданной точки i,
 * сначала в окружности, потом в прямой, что равносильно сдвигу точки в Л2.
 */
function movePointToCenter(i) {
	invInCircleMirror(i, i);
	invInLineMirror(i, i);
	drawPoint(i);
}

//Рисует простой евклидов отрезок
function drawSimpleLine(i, j){
	ris.moveTo(al[0]["x"][i], al[0]["y"][i]);
	ris.lineTo(al[0]["x"][j], al[0]["y"][j]);
	ris.stroke();
}
