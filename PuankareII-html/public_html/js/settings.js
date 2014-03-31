
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

//модуль числа
function sign(x){
    if (x > 0) return 1;
    if (x < 0) return -1;
    return 0;
}