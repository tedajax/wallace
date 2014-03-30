declare var dcodeIO;

var game: Game;
var currTime: number;
var prevTime: number;

window.onload = initialize;

var FPSElement: HTMLElement;
var InfoElement: HTMLElement;
var FPS = 60;
var framesThisSecond = 0;
var lastTick;

var normalTimeScale = 1;
var slowedTimeScale = 0.25;
var timeScale = 1;

function sleep(time: number) {
    var start = performance.now();
    while (performance.now() < start + time);
}

function initialize() {
    //var canvas = <HTMLCanvasElement>document.getElementById('canvas');
    //canvas.addEventListener("contextmenu", (e: MouseEvent) => {
    //    if (e.button == 2) {
    //        e.preventDefault();
    //        return false;
    //    }
    //}, false);
    game = new Game();

    FPSElement = document.getElementById("fps");
    InfoElement = document.getElementById("info");

    game.initialize();

    lastTick = performance.now();
    framesThisSecond = 0;

    setTimeout(update, 1000 / FPS);
    requestAnimationFrame(render);
}

function update() {
    prevTime = (currTime != null) ? currTime : performance.now();
    currTime = performance.now();
    var dt = (currTime - prevTime) / 1000.0 * timeScale;
    game.update(dt);

    setTimeout(update, 1000 / FPS);
}

function render() {
    game.render();

    ++framesThisSecond;
    var now = performance.now();
    if (now - lastTick >= 1000) {
        FPSElement.textContent = "FPS: " + framesThisSecond;
        framesThisSecond = 0;
        lastTick = now;
    }

    //InfoElement.textContent = "Entities: " + game.gameObjects.entityCount;

    requestAnimationFrame(render);
}

function loadJsonFile(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();

    return JSON.parse(request.responseText);
}