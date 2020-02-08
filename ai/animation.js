// Gordon McCreary (January 2020)

/**
 * The Animation class is designed to represent 1 animation. For example, you
 * should declare seperate Animations for jumping, walking right, walking left,
 * etc. 
 */
class Animation {

    /**
     * @param {Image} spriteSheet The sprite sheet Image that you wish to
     *      animate, preferably a PNG.
     * @param {number} frameWidth The width of an individual sprite in the
     *      sprite sheet. Sprite sheets must have uniform width of sprites.
     *      Throws an exception if the spriteSheet width is not an exact
     *      multiple of frameWidth.
     * @param {number} frameHeight The height of an individual sprite in the
     *      sprite sheet. Sprite sheets must have uniform height of sprites.
     *      Throws an exception if the spriteSheet height is not an exact
     *      multiple of frameHeight.
     * @param {object} firstFrame This parameter will determine which frame of
     *      the sprite sheet your animation begins on. This requires that you
     *      pass a point object formatted as follows:
     *          {x: 0, y: 0}
     *      This example will begin the animation at the top-left frame. As x
     *      increases by 1 it will move 1 frame to the right. As y increases it
     *      will move 1 frame down. Throws an exception if coordinates are out
     *      of bounds.
     * @param {object} lastFrame This parameter will determine which frame of
     *      the sprite sheet your animation ends on (inclusive). This requires
     *      that you pass a point object; see firstFrame documentation for
     *      formatting. The frames are in row-major order, so if lastFrame
     *      follows firstFrame they will animate in that sequence. If lastFrame
     *      comes before firstFrame then the animation will play from
     *      firstFrame until the final frame of the sprite sheet, then from the
     *      initial frame of the sprite sheet until lastFrame. If lastFrame has
     *      the same coordinates as firstFrame, a still image will be drawn.
     *      Throws an exception if coordinates are out of bounds.
     * @param {number} fps The frame rate that you would like your animation to
     *      play at. A frame rate of 0 will produce a still image. A negative
     *      fps means that the animation will play in reverse at the absolute
     *      value of the frame rate.
     * @param {*} loop Pass true if you would like the animation to loop.
     * @param {*} scale The scaling ratio that you would like your animation to
     *      be drawn with. Throws an exception if scale isn't positive.
     */
    constructor(spriteSheet, frameWidth, frameHeight, firstFrame, lastFrame, fps, loop, scale) {

        // Check width.
        let i = 0;
        while (i < spriteSheet.width) {
            i += frameWidth;
            if (i > spriteSheet.width) {
                throw "Sprite sheet width is not an exact multiple of the frame width!";
            }
        }

        // Check height.
        i = 0;
        while (i < spriteSheet.height) {
            i += frameHeight;
            if (i > spriteSheet.height) {
                throw "Sprite sheet height is not an exact multiple of the frame height!";
            }
        }

        // Check firstFrame.
        if (firstFrame.x < 0
        || firstFrame.y < 0
        || firstFrame.x >= spriteSheet.width / frameWidth
        || firstFrame.y >= spriteSheet.height / frameHeight) {
            throw "Parameter firstFrame out of bounds!";
        }

        // Check lastFrame.
        if (lastFrame.x < 0
        || lastFrame.y < 0
        || lastFrame.x >= spriteSheet.width / frameWidth
        || lastFrame.y >= spriteSheet.height / frameHeight) {
            throw "Parameter lastFrame out of bounds!";
        }

        // Check scale.
        if (scale <= 0) {
            throw "Scale must be positive!";
        }
        
        // Assign fields.
        this._spriteSheet = spriteSheet;
        this._frameWidth = frameWidth;
        this._frameHeight = frameHeight;
        this._sheetWidth = this._spriteSheet.width / this._frameWidth;
        this._sheetHeight = this._spriteSheet.height / this._frameHeight;
        this._firstFrame = firstFrame;
        this._lastFrame = lastFrame;
        this._frameDuration = Infinity;
        if (fps !== 0) {
            this._frameDuration = (1 / Math.abs(fps));
        }
        this._reverse = (fps < 0) ? true : false;
        this._loop = loop;
        this._scale = scale;
        this._totalFrames = 0;

        // Calculate total frames using row-major order.
        if (this._firstFrame.y < this._lastFrame.y
        || (this._firstFrame.y === this._lastFrame.y && this._firstFrame.x <= this._lastFrame.x)) {
            this._totalFrames += ((this._lastFrame.y * this._sheetWidth) + this._lastFrame.x + 1);
            this._totalFrames -= ((this._firstFrame.y * this._sheetWidth) + this._firstFrame.x);
        } else {
            this._totalFrames += ((this._lastFrame.y * this._sheetWidth) + this._lastFrame.x + 1);
            this._totalFrames += (this._sheetHeight  * this._sheetWidth);
            this._totalFrames -= ((this._firstFrame.y * this._sheetWidth) + this._firstFrame.x);
        }

        this._elapsedTime = 0;
        this._totalTime = this._frameDuration * this._totalFrames;
    }

    /**
     * Draws the sprite to the canvas.
     * @param {*} tick The game's clock tick.
     * @param {*} ctx The canvas' 2D context.
     * @param {*} posX The x pixel coordinate that you want the sprite to be
     *      drawn on the canvas.
     * @param {*} posY The y pixel coordinate that you want the sprite to be
     *      drawn on the canvas.
     * @param {*} center Pass true if you'd like the sprite to be drawn
     *      centered on the posX & posY coordinates.
     */
    drawFrame(tick, ctx, posX, posY, center) {
        let that = this;
        let drawX = posX;
        let drawY = posY;
        if (center === true) {
            drawX -= ((that._frameWidth * that._scale) / 2);
            drawY -= ((that._frameHeight * that._scale) / 2);
        }

        // Check if still image.
        let cF;
        if (this._frameDuration === Infinity) {
            cF = this._firstFrame;
        } else {
            cF = this.currentFrame();
        }  

        // Draw image.
        ctx.drawImage(this._spriteSheet,
            cF.x * this._frameWidth, cF.y * this._frameHeight,  // Sprite's top-left position on sprite sheet.
            this._frameWidth, this._frameHeight, // Size of source sprite.
            drawX, drawY, // Position to draw sprite on the canvas.
            this._frameWidth * this._scale, this._frameHeight * this._scale); // Size to draw sprite on canvas.
        
        // Update time.
        this._elapsedTime += tick;
        if (this.isDone()) {
            if (that._loop === true) that._elapsedTime = 0;
        }
    }

    /**
    * @return {object} Returns the current frame in a point object formatted as {x: 0, y: 0}.
    */
    currentFrame() {
        let frameNum = Math.floor(this._elapsedTime / this._frameDuration);

        // Calculate row major index of current frame.
        let rmFF = ((this._firstFrame.y * this._sheetWidth) + this._firstFrame.x);
        let rmLF = ((this._lastFrame.y * this._sheetWidth) + this._lastFrame.x);
        let rmCF;
        if (this._firstFrame.y < this._lastFrame.y
        || (this._firstFrame.y === this._lastFrame.y && this._firstFrame.x <= this._lastFrame.x)) {
            if (this._reverse) {
                rmCF = rmLF - frameNum;
            } else {
                rmCF = rmFF + frameNum;
            }
        } else {
            if (this._reverse) {
                rmCF = rmLF - frameNum;
                if (rmCF < 0) {
                    rmCF = ((this._sheetWidth * this._sheetHeight) - rmCF);
                }
            } else {
                rmCF = rmFF + frameNum;
                if (rmCF >= this._sheetWidth * this._sheetHeight) {
                    rmCF -= (this._sheetWidth * this._sheetHeight);
                }
            }
        }

        // Translate row major index to xy indices.
        let x = (rmCF % this._sheetWidth);
        let y = Math.floor(rmCF / this._sheetWidth);

        return {x: x, y: y};
    }

    /**
     * @return {boolean} Returns true if the animation is done, false otherwise.
     */
    isDone () {
        return (this._elapsedTime >= this._totalTime);
    }

    /**
     * Resets the animation to 0.
     */
    resetAnimation() {
        this._elapsedTime = 0;
    }
}