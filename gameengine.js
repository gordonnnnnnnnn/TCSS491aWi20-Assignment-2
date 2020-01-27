/**
 * The GameEngine class is the heart our game. It maintains the render-update
 * loop and provides all entities with the resources they need to exist and
 * interact.
 */
class GameEngine {

    constructor(ctx) {
        this._entities = [];
        this._ctx = null;
        this._left = null;
        this._right = null;
        this._space = null;
        this._clicks = [];
        this._leftAccelStep = 0;
        this._rightAccelStep = 0;
    }

    /**
     * Initializes the game.
     * @param {*} ctx The HTML canvas' 2D context.
     */
    init(ctx) {
        this._ctx = ctx;
        this._surfaceWidth = this._ctx.canvas.width;
        this._surfaceHeight = this._ctx.canvas.height;
        this.startInput();
        this._timer = new Timer();
    }

    /**
     * Starts the render-update loop.
     */
    start() {
        let that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that._ctx.canvas);
        })();
    }

    /**
    * Initializes all event listeners for user input.
    */
    startInput() {
        let that = this;
        this._ctx.canvas.addEventListener("keydown", function (e) {
            let c = e.code;
            if (c === "KeyA" || c === "ArrowLeft") {
                that._left = true;
                that._leftAccelStep = 0;
            }
            if (c === "KeyD" || c === "ArrowRight") {
                that._right = true;
                that._rightAccelStep = 0;
            }
            if (c === "Space") {
                that._space = true;
            }
            e.preventDefault();
        }, false);
        this._ctx.canvas.addEventListener("keyup", function (e) {
            let c = e.code;
            if (c === "KeyA" || c === "ArrowLeft") {
                that._left = false;
                that._leftAccelStep = 0;
            }
            if (c === "KeyD" || c === "ArrowRight") {
                that._right = false;
                that._rightAccelStep = 0;
            }
            if (c === "Space") {
                that._space = false;
            }
            e.preventDefault();
        }, false);
        this._ctx.canvas.addEventListener("click", function (e) {
            let rect = that._ctx.canvas.getBoundingClientRect();
            let x = e.clientX - rect.left
            let y = e.clientY - rect.top
            that._clicks.push({x: x, y: y, type: "left"});
            e.preventDefault();
        }, false);
        this._ctx.canvas.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        }, false);
    }

    /**
    * Calls draw() on every entity in memory.
    */
    draw() {
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        this._ctx.save();
        for (let i = 0; i < this._entities.length; i++) {
            this._entities[i].draw(this._ctx);
        }
        this._ctx.restore();
    }

    /**
     * Calls update() on every entity while disposing of entities that aren't
     * needed anymore.
     */
    update() {

        // Update entities
        for (let i = 0; i < this._entities.length; i++) {
            if (!(this._entities[i].removeFromWorld)) this._entities[i].update();
        }

        // Remove unnecessary entities
        for (let i = 0; i < this._entities.length; i++) {
            if (this._entities[i].removeFromWorld) this._entities[i].splice(i, 1);
        }

        this._ctx.webkitImageSmoothingEnabled = false;
        this._ctx.mozImageSmoothingEnabled = false;
        this._ctx.imageSmoothingEnabled = false;
        this._clicks = [];
    }

    /**
    * Loops while calling update() and draw().
    */
    loop() {
        this._clockTick = this._timer.tick();
        this.update();
        this.draw();
    }

    gameOver() {
        let ball1 = this._entities[1];
        let ball2 = this._entities[2];
        let paddle = this._entities[3];
        ball1.freeze();
        ball2.freeze();
        paddle.freeze();
        this._entities[5]._menuState = 3;
    }

    newGame() {
        let ball1 = this._entities[1];
        let ball2 = this._entities[2];
        let paddle = this._entities[3];
        ball1.reset();
        ball2.reset();
        paddle.reset();
        ball1.start();
        ball2.start();
        paddle.start();
    }
}

// Used in start() to cap framerate.
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

class Background {
    constructor(game) {
        game._entities.push(this);
        this._game = game;
        this._pic = new Animation(ASSET_MANAGER.getAsset("./img/background.png"), 720, 720, {x: 0, y: 0}, {x: 0, y:0}, 0, true, 1)
    }

    draw(ctx){
        this._pic.drawFrame(this._game._clockTick, ctx, 0, 0, false);
    }
    update(){}
}

class Noise {
    constructor(game) {
        game._entities.push(this);
        this._game = game;
        this._pic = new Animation(ASSET_MANAGER.getAsset("./img/noise.png"), 720, 720, {x: 0, y: 0}, {x: 2, y:0}, 10, true, 1)
    }

    draw(ctx){
        this._pic.drawFrame(this._game._clockTick, ctx, 0, 0, false);
    }
    update(){}
}
