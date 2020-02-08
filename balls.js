class BallOne {
    constructor(game) {
        this._game = game;
        this._game._entities.push(this);
        this._ball = new Animation(ASSET_MANAGER.getAsset("./img/balls.png"), 32, 32, {x: 0, y: 0}, {x: 3, y: 0}, 8, true, 3);
        this._x = 360;
        this._y = 300;
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._horzHit = 20;
        this._vertHit = 20;
        this._removeFromWorld = false;
    }

    draw(ctx) {
        this._ball.drawFrame(this._game._clockTick, ctx, this._x, this._y, true);
    }

    update() {
        this._x += this._xVelocity;
        this._y += this._yVelocity;
        if (this._x - this._horzHit < 0 || this._x + this._horzHit > 720) {
            this._xVelocity = -this._xVelocity;
        }
        if (this._y - this._vertHit < 0 || this.hit()) {
            if (this.hit()) {
                let iP = 360 - this._game._entities[3]._vertHit - this._vertHit;
                this._y = iP - (this._y - iP);
            }
            this._yVelocity = -this._yVelocity;
        }
        if (this._y > 360) {
            this._game.gameOver();
        }
    }

    hit() {
        let p = this._game._entities[3];
        let result = this._yVelocity > 0
            && this._x + this._horzHit >= p._x - p._horzHit
            && this._x - this._horzHit <= p._x + p._horzHit
            && this._y - this._vertHit <= 360 - p._vertHit
            && this._y + this._vertHit >= 360 - p._vertHit;
        if (result) {
            this._xVelocity += Math.floor(Math.random() * 10) - 5;
            if (Math.abs(this._xVelocity) > 15) {
                this._xVelocity = 0;
            }
            p._hit.resetAnimation();
        }
        return result;
    }
    
    freeze() {
        this._xVelocity = 0;
        this._yVelocity = 0;
    }

    reset() {
        this._x = 360;
        this._y = 300;
    }

    start() {
        this._yVelocity = 5;
    }
}

class BallTwo {
    constructor(game) {
        this._game = game;
        this._game._entities.push(this);
        this._ball = new Animation(ASSET_MANAGER.getAsset("./img/balls.png"), 32, 32, {x: 0, y: 1}, {x: 3, y: 1}, 8, true, 3);
        this._x = 360;
        this._y = 690;
        this._xVelocity = 0;
        this._yVelocity = 0;
        this._horzHit = 20;
        this._vertHit = 20;
        this._removeFromWorld = false;
    }

    draw(ctx) {
        this._ball.drawFrame(this._game._clockTick, ctx, this._x, this._y, true);
    }

    update() {
        this._x += this._xVelocity;
        this._y += this._yVelocity;
        if (this._x - this._horzHit < 0 || this._x + this._horzHit > 720) {
            this._xVelocity = -this._xVelocity;
        }
        if (this._y + this._vertHit > 720 || this.hit()) {
            if (this.hit()) {
                let iP = 360 + this._game._entities[3]._vertHit + this._vertHit;
                this._y = iP + (iP - this._y);
            }
            this._yVelocity = -this._yVelocity;
        }
        if (this._y < 360) {
            this._game.gameOver();
        }
    }

    hit() {
        let p = this._game._entities[3];
        let result = this._yVelocity < 0
            && this._x + this._horzHit >= p._x - p._vertHit
            && this._x - this._horzHit <= p._x + p._horzHit
            && this._y - this._vertHit <= 360 + p._vertHit
            && this._y + this._vertHit >= 360 + p._vertHit;
        if (result) {
            p._hit.resetAnimation();
            if (Math.abs(this._xVelocity) > 15) {
                this._xVelocity = 0;
            }
            this._xVelocity += Math.floor(Math.random() * 10) - 5;
        }
        return result;
    }

    freeze() {
        this._xVelocity = 0;
        this._yVelocity = 0;
    }

    reset() {
        this._x = 360;
        this._y = 690;
    }

    start() {
        this._yVelocity = -5;
    }
}