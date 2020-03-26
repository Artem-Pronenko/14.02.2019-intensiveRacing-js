const score = document.querySelector('.score'),       // запись в переменные
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div');                // в переменную car создать div
car.classList.add('car');              // добавить класс 'car'

start.addEventListener('click', startGame);           // вешаю событие клика, и записываю назваия функции
document.addEventListener('keydown', startRun);       // событие нажатия на кнопку
document.addEventListener('keyup', stopRun);          // событие отпускания кнопки
let out_speed = document.getElementById('out_speed');

const keys = {               // создаем объект (для хранения коллекции значений)
	ArrowUp: false,            // имя свойства 'ArrowUp' значения 'false'
	ArrowDown: false,          // если ArrowDown = true - машина остановится
	ArrowRight: false,
	ArrowLeft: false
};
let lvl = 1;

const setting = {         // объект с настройками
	start: false,
	score: 0,
	speed: 3,
	traffic: 3,
	speed2: 1
};

function getQuantityElements(heightElement) {             // вычеслить сколько элементов влезет в экран
	return Math.ceil(gameArea.offsetHeight / heightElement);    // возращаю вычисленное значение
}

function startGame() {                    // запуск функции startGame
	start.classList.add('hide');            // добавить клас "hide" (дисплей нон)
	gameArea.innerHTML = '';                // очистить при старте
	for (let i = 0; i < getQuantityElements(100) + 1; i++) {
		const line = document.createElement('div');       // записываю в переменную созданый div | создаю линии
		line.classList.add('line');                    // присваиваю созданому 'div' клас 'line'
		line.style.top = (i * 100) + 'px';              // даю стили для line - top = i * 100
		line.y = i * 100;                       // двигаю линии по оси y
		gameArea.appendChild(line);                // дочерний элемент для gameArea (линии)
	}

	for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
		const enemy = document.createElement('div');                                     // создаю div для машины машину
		enemy.classList.add('enemy');                                                    // даю клас
		let enemyImg = Math.floor(Math.random() * 4) + 1;
		enemy.y = -100 * setting.traffic * (i + 1);                                      // растояние между машинами
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';   // рандомно располагаю машины
		enemy.style.top = enemy.y + 'px';
		enemy.style.background = `transparent url(./img/enemy${enemyImg}.png) center / cover no-repeat`; // другая машина
		gameArea.appendChild(enemy);                                                     // распологаю машины на дороге
	}
	out_speed.style.color = "green";       // СБРОС ДЛЯ НАЧАЛА ИГРЫ
	score.style.fontSize = "18";
	score.style.background = "#000"
	score.style.zIndex = "100";
	out_speed.style.top = "34";
	out_speed.style.fontSize = "18";
	lvl = 1;
	setting.score = 0;
	setting.speed = 5;
	setting.start = true;                   // при запуске startGame присвоять 'start' - true
	gameArea.appendChild(car);              // создать div в 'gameArea' при старте игры
	car.style.left = '125px';               // стили для машины
	car.style.top = 'auto';                 // сбросить для машины top на auto
	car.style.bottom = '10px';              // изначальная озиция
	setting.x = car.offsetLeft;             // в 'setting' добавить 'offsetLeft' движение в лево
	setting.y = car.offsetTop;
	score.style.top = 'auto';
	requestAnimationFrame(playGame);        // запуск функции 'requestAnimationFrame' анимируем - функцию 'playGame'
}

function playGame() {
	if (setting.start) {                       // пока settig.start === true запускать 'playGame' (автоматическая проверка)
		setting.score++;                         // скорость машины
		setting.speed2++;
		if (setting.speed2 == 500) {             // когда скорость == 500
			setting.speed = setting.speed + lvl;
			lvl++;                                 // увеличить lvl на 1
			setting.speed2 = 0;                    // сбросить скорость до 0
		}
		if (lvl >= 0 && lvl <= 3) {              // УСЛОВИЯ ДЛЯ ЦВЕТА УРОВНЯ
			out_speed.style.color = "green";
		} else if (lvl >= 4 && lvl <= 6) {
			out_speed.style.color = "yellow";
		} else if (lvl >= 7 && lvl <= 10) {
			out_speed.style.color = "red";
		}

		score.innerHTML = `SCORE: ${setting.score}`;
		out_speed.innerHTML = `LVL: ${lvl}`;

		moveRoad();                       // запуск функции moveRoad
		moveEnemy();                      // запуск функции moveEnemy
		if (keys.ArrowLeft && setting.x > 0) {    // если ArrowRight нажата уменьшать x на 1 и setting.x должа быть больше 0
			setting.x -= setting.speed;             // setting.x присвоять setting.speed | speed - 3
		}
		if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {    // не будет выходить за левый край
			setting.x += setting.speed;                // увеличиваю setting.x в зависимости от setting.speed
		}
		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
			setting.y += setting.speed;
		}
		if (keys.ArrowUp && setting.y > 0) {
			setting.y -= setting.speed;
		}
		car.style.left = setting.x + 'px';    // класу car > добавлять setting.x в px
		car.style.top = setting.y + 'px';
		requestAnimationFrame(playGame);      // рекурсия (функция запускает сама себя)

	}
}


function startRun(event) {      // принятие параметра (объект - event)
	event.preventDefault();       // отключения дефолтного поведения браузер (скролл по клавише и т.д.)
	//console.log(event.key);     // отслеживаем на какую кнопку произведен клик
	keys[event.key] = true;       // получаем кнопку по которй кликнули, и присваиваем 'true'

}

function stopRun(event) {
	event.preventDefault();       // отключения дефолтного поведения браузер (скролл по клавише и т.д.)
	keys[event.key] = false;      // при отпускании кнопки - присвоять 'false'
}

const moveRoad = () => {             // описываю функцию вижения дороги
	let lines = document.querySelectorAll('.line');       // нахожу все линии, заншу в переменную
	lines.forEach(function (line) {               // перебираю все линии
		line.y += setting.speed;                  // к line.y прибавляю setting.speed
		line.style.top = line.y + 'px';           // меняю стиль
		if (line.y >= document.documentElement.clientHeight) {   // если line.y больше или равно высоте клиента
			line.y = -100;                                         // смещаю line.y на -100
		}
	});
};

function moveEnemy() {                // описываю функцию вижения дороги

	let enemy = document.querySelectorAll('.enemy');        // получаю все машины
	enemy.forEach(function (item) {                           // перебираю все машины
		let carRect = car.getBoundingClientRect();            // получаю свойства размера и позиции carRect
		let carEnemy = item.getBoundingClientRect();          // получаю свойства размера и позиции carEnemy
		if (carRect.top <= carEnemy.bottom &&                 // условия столкновений
			carRect.right >= carEnemy.left &&
			carRect.left <= carEnemy.right &&
			carRect.bottom >= carEnemy.top) {
			setting.start = false;                              // выключить игру если условия === true
			start.classList.remove('hide');                     // добавляю кнопку рестарта
			out_speed.style.fontSize = "50";                    // НАСТРОЙКИ
			out_speed.style.top = "50%";
			score.style.top = "40%";
			score.style.background = "none";
			score.style.zIndex = "1000";
			score.style.fontSize = "50";

		}

		item.y += setting.speed / 2;                          //  присваиваю скорость и делю на 2
		item.style.top = item.y + 'px';                       // меняю высоту
		if (item.y >= document.documentElement.clientHeight) {   // если машиа уходит за край экрана.
			item.y = -100 * setting.traffic;                       // переношу ее наверх
			item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';    // рандомное появление машин
		}
	});
}