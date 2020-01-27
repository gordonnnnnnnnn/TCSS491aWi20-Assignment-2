class Menu {
    constructor(game) {
        this._game = game;
        this._game._entities.push(this);
        this._menuState = 1;
        this._mainMenu = new Animation(ASSET_MANAGER.getAsset("./img/menu.png"), 720, 720, {x: 0, y: 0}, {x: 0, y: 0}, 0, true, 1);
        this._helpMenu = new Animation(ASSET_MANAGER.getAsset("./img/menu.png"), 720, 720, {x: 1, y: 0}, {x: 1, y: 0}, 0, true, 1);
        this._loseMenu = new Animation(ASSET_MANAGER.getAsset("./img/menu.png"), 720, 720, {x: 2, y: 0}, {x: 2, y: 0}, 0, true, 1);
    }

    draw(ctx) {
        if (this._menuState === 1) {
            this._mainMenu.drawFrame(this._game._clockTick, ctx, 0, 0, false);
        } else if (this._menuState === 2) {
            this._helpMenu.drawFrame(this._game._clockTick, ctx, 0, 0, false);
        } else if (this._menuState === 3) {
            this._loseMenu.drawFrame(this._game._clockTick, ctx, 0, 0, false);
        }
    }
    update() {
        for (let i = 0; i < this._game._clicks.length; i++) {
            if (this._menuState === 1) {
                if (this._game._clicks[i].x > 110
                && this._game._clicks[i].x < 330
                && this._game._clicks[i].y > 380
                && this._game._clicks[i].y < 510) {
                    this._menuState = 0;
                    this._game.newGame();
                    break;
                }
                if (this._game._clicks[i].x > 390
                && this._game._clicks[i].x < 610
                && this._game._clicks[i].y > 380
                && this._game._clicks[i].y < 510) {
                    this._menuState = 2;
                    break;
                }
            } else if (this._menuState === 2) {
                this._menuState = 1;
                break;
            } else if (this._menuState === 3) {
                if (this._game._clicks[i].x > 230
                && this._game._clicks[i].x < 490
                && this._game._clicks[i].y > 370
                && this._game._clicks[i].y < 520) {
                    this._menuState = 0;
                    this._game.newGame();
                    break;
                }
            }
        }
    }
}