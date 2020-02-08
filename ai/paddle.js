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
        this._nextBall = true;

        /*
        The paddle's view distance is how far it can see in either direction.
        0 means it can't see, 100 means it can see the entire game.
        */
        this._viewDistance = 50;

        /*
        The paddle's body awareness is how well it realizes the size of its own body.
        0 means that the paddle thinks it is a point on the x plane;
        100 means that the paddle is perfectly aware of its body size;
        in between values as they increase start to predict body size with more accuracy.
        */
        this._bodyAwareness = 50;

        /*
        The paddle's trajectory prediction is how it predicts where to go based on trajectory.
        0 means that it only knows the current gamestate with no reference of time;
        100 means that the paddle is tracking the balls trajectory over time perfectly;
        in between values as they increase get better at predicting trajectory.
        */
        this._trajectoryPrediction = 50;
        this._b1Traj = new TrajCont(this._trajectoryPrediction);
        this._b2Traj = new TrajCont(this._trajectoryPrediction);
    }

    /**
     * Mandatory draw method; called by the GameEngine to draw the entity.
     * @param {*} ctx The canvas' 2D context.
     */
    draw(ctx) {

        // Draw paddle
        if (this._hit.isDone()) {
            this._still.drawFrame(this._game._clockTick, ctx, this._x, 360, true);
        } else {
            this._hit.drawFrame(this._game._clockTick, ctx, this._x, 360, true);
        }

        // Draw view distance
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(5, 255, 5, 0.69)';
        ctx.beginPath();
        ctx.moveTo(0, 360 - (360 * (this._viewDistance / 100)));
        ctx.lineTo(720, 360 - (360 * (this._viewDistance / 100)));
        ctx.stroke();
        ctx.moveTo(0, 360 + (360 * (this._viewDistance / 100)));
        ctx.lineTo(720, 360 + (360 * (this._viewDistance / 100)));
        ctx.stroke();

        // Draw body awareness
        ctx.lineWidth = (this._horzHit * 2) * (this._bodyAwareness / 100);
        ctx.strokeStyle = 'rgba(250, 255, 5, 0.69)';
        ctx.beginPath();
        ctx.moveTo(this._x, 360 - this._vertHit);
        ctx.lineTo(this._x, 360 + this._vertHit);
        ctx.stroke();

        // Draw trajectory
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255, 76, 243, 0.69)';
        ctx.beginPath();
        let t1 = this._b1Traj.cont;
        for (let i = 0; i < t1.length - 1; i++) {
            ctx.moveTo(t1[i].x, t1[i].y);
            ctx.lineTo(t1[i + 1].x, t1[i + 1].y);
        }
        ctx.stroke();
        ctx.strokeStyle = 'rgba(5, 255, 242, 0.69)';
        ctx.beginPath();
        let t2 = this._b2Traj.cont;
        for (let i = 0; i < t2.length - 1; i++) {
            ctx.moveTo(t2[i].x, t2[i].y);
            ctx.lineTo(t2[i + 1].x, t2[i + 1].y);
        }
        ctx.stroke();
    }

    /**
     * Mandatory update method; called by the GameEngine to update the entity.
     */
    update() {
        // Update fields
        let viewVal = document.getElementById('view').value;
        if (isNaN(viewVal) || viewVal < 0 || viewVal > 100) {
            viewVal = 50;
        }
        this._viewDistance = Math.floor(viewVal);
        let bodyVal = document.getElementById('body').value;
        if (isNaN(bodyVal) || bodyVal < 0 || bodyVal > 100) {
            bodyVal = 50;
        }
        this._bodyAwareness = Math.floor(bodyVal);
        let trajVal = document.getElementById('trajectory').value;
        if (isNaN(trajVal) || trajVal < 0 || trajVal > 100) {
            trajVal = 50;
        }
        this._trajectoryPrediction = Math.floor(trajVal);
        this._b1Traj.setSize(Math.floor(trajVal));
        this._b2Traj.setSize(Math.floor(trajVal));

        let ballOne = this._game._entities[1];
        let ballTwo = this._game._entities[2];
        let viewTop = 360 - (360 * (this._viewDistance / 100));
        let viewBottom = 360 + (360 * (this._viewDistance / 100));
        let b1Pos = {x: 360, y: -Infinity};
        let b2Pos = {x: 360, y: Infinity};

        if (ballOne._y >= viewTop) {
            this._b1Traj.add({x: ballOne._x, y: ballOne._y});
            b1Pos = {x: ballOne._x, y: ballOne._y}
        }
        if (ballTwo._y <= viewBottom) {
            this._b2Traj.add({x: ballTwo._x, y: ballTwo._y});
            b2Pos = {x: ballTwo._x, y: ballTwo._y}
        }


        // AI CODE STARTS HERE
        if (this._trajectoryPrediction <= 1) {
            if (Math.abs(360 - b1Pos.y) < Math.abs(b2Pos.y - 360)) {
                this.move(b1Pos.x);
            } else {
                this.move(b2Pos.x);
            }
        } else {
            if (this._nextBall) { // Ball 1
                let cont = this._b1Traj.cont;
                if (cont.length >= 2) {
                    let xV = cont[cont.length - 1].x - cont[cont.length - 2].x;
                    let yV = (cont[cont.length - 1].y - cont[cont.length - 2].y);
                    let scale = this._trajectoryPrediction;
                    while (yV * scale + cont[cont.length - 1].y < 0 + ballOne._vertHit
                    || yV * scale + cont[cont.length - 1].y > 360 - this._vertHit - ballOne._vertHit) {
                        scale--;
                    }
                    let predX = xV * scale + cont[cont.length - 1].x;
                    if (predX > 720 - ballOne._horzHit) {
                        predX = 720 - ballOne._horzHit - (predX % (720 - ballOne._horzHit));
                    }
                    if (predX < 0 + ballOne._horzHit) {
                        predX = 0 + ballOne._horzHit + (Math.abs(predX) % (720 - ballOne._horzHit));
                    }
                    this.move(predX);
                }
            } else { // Ball 2
                let cont = this._b2Traj.cont;
                if (cont.length >= 2) {
                    let xV = cont[cont.length - 1].x - cont[cont.length - 2].x;
                    let yV = (cont[cont.length - 1].y - cont[cont.length - 2].y);
                    let scale = this._trajectoryPrediction;
                    while (yV * scale + cont[cont.length - 1].y > 720 - ballTwo._vertHit
                    || yV * scale + cont[cont.length - 1].y < 360 + this._vertHit - ballTwo._vertHit) {
                        scale--;
                    }
                    let predX = xV * scale + cont[cont.length - 1].x;
                    if (predX > 720 - ballTwo._horzHit) {
                        predX = 720 - ballTwo._horzHit - (predX % (720 - ballTwo._horzHit));
                    }
                    if (predX < 0 + ballTwo._horzHit) {
                        predX = 0 + ballTwo._horzHit + (Math.abs(predX) % (720 - ballTwo._horzHit));
                    }
                    this.move(predX);
                }
            }
        }
        // AI CODE ENDS HERE



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

    move(x) {
        if (Math.abs(this._x - x) > (this._horzHit + this._game._entities[1]._horzHit) * (this._bodyAwareness/ 100) - 10) {
            if (this._x < x) {
                this.press(true);
                this.release(false);
            } else {
                this.press(false);
                this.release(true);
            }
        } else {
            this.release(true);
            this.release(false);
            if (this._bodyAwareness >= 50 && Math.abs(this._x - 360) > Math.abs(x - 360)) {
                if (this._x - 360 > 0) {
                    this.press(false);
                } else {
                    this.press(true);
                }
            }
        }
    }

    // truthy for right, else for left
    press(dir) {
        if (dir) {
            this._game._right = true;
            this._game._rightAccelStep = 0;
        } else {
            this._game._left = true;
            this._game._leftAccelStep = 0;
        }
    }

    // truthy for right,  else for left
    release(dir) {
        if (dir) {
            this._game._right = false;
            this._game._rightAccelStep = 0;
        } else {
            this._game._left = false;
            this._game._leftAccelStep = 0;
        }
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