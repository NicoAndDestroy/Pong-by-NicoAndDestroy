let anchoCanvas, altoCanvas;

let jugadorX = 15;
let jugadorY;
let anchoRaqueta = 10;
let altoRaqueta = 100;

let computadoraX;
let computadoraY;

let pelotaX, pelotaY;
let diametroPelota = 20;
let velocidadPelotaX = 5;
let velocidadPelotaY = 5;
let anguloPelota = 0;

let jugadorScore = 0;
let computadoraScore = 0;

let fondo;
let barraJugador;
let barraComputadora;
let bola;
let sonidoRebote;
let sonidoGol;
let sonidoInicio;
let sonidoPong;

function preload() {
    fondo = loadImage('images/fondo1.png');
    barraJugador = loadImage('assets/barra1.png');
    barraComputadora = loadImage('assets/barra2.png');
    bola = loadImage('assets/bola.png');
    sonidoRebote = loadSound('sounds/rebote.wav');
    sonidoInicio = loadSound('sounds/Empezar.wav');
    sonidoPong = loadSound('sounds/pong.wav');
    sonidoGol = loadSound('sounds/gol.wav');
}

function setup() {
    // Canvas inicial adaptado al tamaño de la ventana
    anchoCanvas = windowWidth * 0.9; // 90% del ancho de la pantalla
    altoCanvas = windowHeight * 0.8; // 80% del alto de la pantalla
    createCanvas(anchoCanvas, altoCanvas);

    jugadorY = height / 2 - altoRaqueta / 2;
    computadoraX = width - 25;
    computadoraY = height / 2 - altoRaqueta / 2;

    resetPelota();
    sonidoInicio.play();
}

function draw() {
    background(fondo);
    dibujarRaquetas();
    dibujarPelota();
    mostrarPuntaje();
    moverPelota();
    moverComputadora();
    verificarColisiones();
}

function windowResized() {
    // Recalcular el tamaño del canvas al cambiar el tamaño de la ventana
    anchoCanvas = windowWidth * 0.9;
    altoCanvas = windowHeight * 0.8;
    resizeCanvas(anchoCanvas, altoCanvas);

    // Ajustar posiciones relativas
    jugadorY = height / 2 - altoRaqueta / 2;
    computadoraX = width - 25;
    computadoraY = height / 2 - altoRaqueta / 2;
    resetPelota();
}

function dibujarRaquetas() {
    image(barraJugador, jugadorX, jugadorY, anchoRaqueta, altoRaqueta);
    image(barraComputadora, computadoraX, computadoraY, anchoRaqueta, altoRaqueta);
}

function dibujarPelota() {
    push();
    translate(pelotaX, pelotaY);
    rotate(anguloPelota);
    imageMode(CENTER);
    image(bola, 0, 0, diametroPelota, diametroPelota);
    pop();
}

function mostrarPuntaje() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(color("#2B3FD6"));
    text(jugadorScore, width / 4, 50);
    text(computadoraScore, 3 * width / 4, 50);
}

function moverPelota() {
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    let velocidadTotal = sqrt(velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY);
    anguloPelota += velocidadTotal * 0.05;

    if (pelotaY - diametroPelota / 2 < 0 || pelotaY + diametroPelota / 2 > height) {
        velocidadPelotaY *= -1;
        sonidoRebote.play();
    }
}

function moverComputadora() {
    if (pelotaY > computadoraY + altoRaqueta / 2) {
        computadoraY += 4;
    } else if (pelotaY < computadoraY + altoRaqueta / 2) {
        computadoraY -= 4;
    }
    computadoraY = constrain(computadoraY, 0, height - altoRaqueta);
}

function verificarColisiones() {
    if (pelotaX - diametroPelota / 2 < jugadorX + anchoRaqueta &&
        pelotaY > jugadorY && pelotaY < jugadorY + altoRaqueta) {
        let puntoImpacto = pelotaY - (jugadorY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3;
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX = abs(velocidadPelotaX);
        sonidoPong.play();
    }

    if (pelotaX + diametroPelota / 2 > computadoraX &&
        pelotaY > computadoraY && pelotaY < computadoraY + altoRaqueta) {
        let puntoImpacto = pelotaY - (computadoraY + altoRaqueta / 2);
        let factorAngulo = (puntoImpacto / (altoRaqueta / 2)) * PI / 3;
        velocidadPelotaY = 10 * sin(factorAngulo);
        velocidadPelotaX = -abs(velocidadPelotaX);
        sonidoPong.play();
    }

    if (pelotaX < 0) {
        computadoraScore++;
        sonidoGol.play();
        narrarMarcador();
        resetPelota();
    } else if (pelotaX > width) {
        jugadorScore++;
        sonidoGol.play();
        narrarMarcador();
        resetPelota();
    }
}

function narrarMarcador() {
    let narrador = new SpeechSynthesisUtterance(`El marcador es ${jugadorScore} a ${computadoraScore}`);
    window.speechSynthesis.speak(narrador);
}

function resetPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    velocidadPelotaX = 5 * (Math.random() > 0.5 ? 1 : -1);
    velocidadPelotaY = 5 * (Math.random() > 0.5 ? 1 : -1);
    anguloPelota = 0;
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        jugadorY -= 50;
    } else if (keyCode === DOWN_ARROW) {
        jugadorY += 50;
    } else if (key === '+') {
        velocidadPelotaX *= 1.2;
        velocidadPelotaY *= 1.2;
    } else if (key === '-') {
        velocidadPelotaX *= 0.8;
        velocidadPelotaY *= 0.8;
    }
    jugadorY = constrain(jugadorY, 0, height - altoRaqueta);
}