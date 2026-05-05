/* =========================================
   VARIABLES, IMÁGENES Y SONIDOS
   ========================================= */
var canvas, lienzo;
var score = 0;
var lastPress = null;
var gameover = false;
var pause = false;
var dir = 0;

var body = [];
var walls = [];
var food;

// Imágenes
var imgBody = new Image(); imgBody.src = "imgs/body.png";
var imgFruit = new Image(); imgFruit.src = "imgs/fruit.png";
var imgWall = new Image(); imgWall.src = "imgs/wall.png";

// Sonidos
var musica = document.getElementById("musicaFondo");
var sfxComida = document.getElementById("sonidoComida");
var sfxMuerte = document.getElementById("sonidoMuerte");

// Constantes
const DERECHA = 0; const IZQUIERDA = 1; const ARRIBA = 2; const ABAJO = 3;
const KEY_LEFT = 37; const KEY_UP = 38; const KEY_RIGHT = 39; const KEY_DOWN = 40; const KEY_ENTER = 13;

function Rectangle(pX, pY, pW, pH, pImagen) {
    this.x = pX;
    this.y = pY;
    this.w = pW;
    this.h = pH;
    this.imagen = pImagen;

    this.fill = function (pLienzo) {
        pLienzo.drawImage(this.imagen, this.x, this.y, this.w, this.h);
    };

    this.intersects = function (pObj) {
        return !(this.x > pObj.x + pObj.w || this.x + this.w < pObj.x ||
            this.y > pObj.y + pObj.h || this.y + this.h < pObj.y);
    };
}

function act() {
    if (!gameover && !pause) {
        if (musica.paused) musica.play();

        for (var k = body.length - 1; k > 0; k = k - 1) {
            body[k].x = body[k - 1].x;
            body[k].y = body[k - 1].y;
        }

        /* Cambiar dirección de la serpiente */
        if (lastPress == KEY_UP && dir != ABAJO) dir = ARRIBA;
        if (lastPress == KEY_DOWN && dir != ARRIBA) dir = ABAJO;
        if (lastPress == KEY_LEFT && dir != DERECHA) dir = IZQUIERDA;
        if (lastPress == KEY_RIGHT && dir != IZQUIERDA) dir = DERECHA;

        if (dir == DERECHA) body[0].x += 10;
        if (dir == IZQUIERDA) body[0].x -= 10;
        if (dir == ARRIBA) body[0].y -= 10;
        if (dir == ABAJO) body[0].y += 10;

        if (body[0].intersects(food)) {
            score++;
            body.push(new Rectangle(0, 0, 10, 10, imgBody));
            food.x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
            food.y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
            sfxComida.play();
        }

        for (var i = 0; i < walls.length; i++) {
            // Movimiento aleatorio de la pared (0 a 3)
            var dirWall = Math.floor(Math.random() * 4);

            if (dirWall == DERECHA) walls[i].x += 10;
            if (dirWall == IZQUIERDA) walls[i].x -= 10;
            if (dirWall == ARRIBA) walls[i].y -= 10;
            if (dirWall == ABAJO) walls[i].y += 10;

            // Mantener paredes dentro del escenario
            if (walls[i].x < 0) walls[i].x = 0;
            if (walls[i].x > canvas.width - 10) walls[i].x = canvas.width - 10;
            if (walls[i].y < 0) walls[i].y = 0;
            if (walls[i].y > canvas.height - 10) walls[i].y = canvas.height - 10;

            // Comprobar si esta pared choca con CUALQUIER parte del cuerpo
            for (var j = 0; j < body.length; j++) {
                if (walls[i].intersects(body[j])) {
                    gameover = true;
                }
            }
        }

        for (var k = 2; k < body.length; k++) {
            if (body[0].intersects(body[k])) gameover = true;
        }

        // Límites de pantalla para la cabeza de la serpiente
        if (body[0].x >= canvas.width || body[0].x < 0 ||
            body[0].y >= canvas.height || body[0].y < 0) {
            gameover = true;
        }

        if (gameover) {
            musica.pause();
            sfxMuerte.play();
        }
    }

    if (gameover && lastPress == KEY_ENTER) reset();
}
/* =========================================
   DIBUJO (PAINT)
   ========================================= */
function paint() {
    // Fondo Degradado exacto a la imagen
    var grad = lienzo.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "blue");
    grad.addColorStop(1, "black");
    lienzo.fillStyle = grad;
    lienzo.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar elementos
    for (var k = 0; k < body.length; k = k + 1) {
        body[k].fill(lienzo);
    }
    for (var k = 0; k < walls.length; k = k + 1) {
        walls[k].fill(lienzo);
    }
    food.fill(lienzo);

    // Texto de puntuación (Score: 0) en color Cyan/Verde Agua
    lienzo.fillStyle = "#0FF"; // Cyan más brillante para que resalte como en la imagen
    lienzo.font = "10px Arial";
    lienzo.textAlign = "left";
    lienzo.fillText("Score: " + score, 10, 15);

    if (gameover) {
        // Estilo GAME OVER según la captura (Verde agua, centrado)
        lienzo.fillStyle = "#7FFFD4";
        lienzo.font = "12px Arial";
        lienzo.textAlign = "center";
        // En la imagen el texto está ligeramente arriba del centro
        lienzo.fillText("GAME OVER", canvas.width / 2, (canvas.height / 2) - 10);
    }
}

function reset() {

    body = [
        new Rectangle(40, 40, 10, 10, imgBody),
        new Rectangle(30, 40, 10, 10, imgBody),
        new Rectangle(20, 40, 10, 10, imgBody)
    ];
    
    walls = [];

    for (var k = 0; k < 5; k = k + 1) {
        walls.push(new Rectangle(100 + k * 20, 100, 10, 10, imgWall));
    }
    
    food = new Rectangle(200, 150, 10, 10, imgFruit);
    score = 0;
    dir = DERECHA;
    gameover = false;
    lastPress = null;
}

function init() {
    canvas = document.getElementById("lienzo");
    lienzo = canvas.getContext("2d");
    reset();
    run();
}

function run() {
    setTimeout(run, 100);
    act();
    paint();
}

window.addEventListener("load", init, false);
document.addEventListener("keydown", function (e) { lastPress = e.keyCode; }, false);