const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/background.png");
ASSET_MANAGER.queueDownload("./img/balls.png");
ASSET_MANAGER.queueDownload("./img/noise.png");
ASSET_MANAGER.queueDownload("./img/paddle.png");
ASSET_MANAGER.queueDownload("./img/menu.png");

ASSET_MANAGER.downloadAll(function () {
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');
    let gameEngine = new GameEngine(ctx);
    new Background(gameEngine);
    new BallOne(gameEngine);
    new BallTwo(gameEngine);
    new Paddle(gameEngine);
    new Noise(gameEngine);
    new Menu(gameEngine);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
