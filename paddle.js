var PADDLE_TOP_SPEED = 0;

/**
 * The MainCharacter class is how the user interacts with the game world.
 */
class Paddle {

    /**
     * @param {GameEngine} game The game engine that this entity exists in.
     */
    constructor(game) {
        this._game = game;
        this._game._entities.push(this);
        this._still = new Animation(ASSET_MANAGER.getAsset("./img/paddle.png"), 32, 32, {x: 0, y: 0}, {x: 0, y: 0}, 0, true, 3);
        this._hit = new Animation(ASSET_MANAGER.getAsset("./img/paddle.png"), 32, 32, {x: 1, y: 0}, {x: 5, y: 0}, 20, false, 3);
        this._hit._elapsedTime = this._hit._totalTime;
        this._x = 360;
        this._horzHit = 42;
        this._vertHit = 30;
        this._xVelocity = 0;
        this._removeFromWorld = false;
        this._leftAccelSteps = 0;
        this._rightAccelSteps = 0;
    }

    /**
     * Mandatory draw method; called by the GameEngine to draw the entity.
     * @param {*} ctx The canvas' 2D context.
     */
    draw(ctx) {
        if (this._hit.isDone()) {
            this._still.drawFrame(this._game._clockTick, ctx, this._x, 360, true);
        } else {
            this._hit.drawFrame(this._game._clockTick, ctx, this._x, 360, true);
        }
    }

    /**
     * Mandatory update method; called by the GameEngine to update the entity.
     */
    update() {

        // Update position
        this._x += this._xVelocity;
        while (this._x - this._horzHit < 0) {
            this._x++;
        }
        while (this._x + this._horzHit > 720) {
            this._x--;
        }

        if (this._game._left) {
            if (this.calculateSpeed() < PADDLE_TOP_SPEED && this._game._leftAccelStep === 0) this._xVelocity -= 1;
        } else {
            if (this._xVelocity < 0 && this._game._leftAccelStep === 0) {
                this._xVelocity += 1;
            }
        }
        if (this._game._right) {
            if (this.calculateSpeed() < PADDLE_TOP_SPEED && this._game._rightAccelStep === 0) this._xVelocity += 1;
        } else {
            if (this._xVelocity > 0 && this._game._rightAccelStep === 0) {
                this._xVelocity -= 1;
            }
        }

        this._game.leftAccelStep = (this._game.leftAccelStep + 1) % 4;
        this._game.rightAccelStep = (this._game.rightAccelStep + 1) % 4;
    }

    /**
     * @returns {num} Returns the current speed of the main character.
     */
    calculateSpeed() {
        return Math.abs(this._xVelocity);
    }

    freeze() {
        PADDLE_TOP_SPEED = 0;
        this._xVelocity = 0;
    }

    reset() {
        this._x = 360;
    }
    
    start() {
        PADDLE_TOP_SPEED = 12;
    }

    get removeFromWorld() {return this._removeFromWorld;}
}