const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/background.png");
ASSET_MANAGER.queueDownload("./img/balls.png");
ASSET_MANAGER.queueDownload("./img/noise.png");
ASSET_MANAGER.queueDownload("./img/paddle.png");

ASSET_MANAGER.downloadAll(function () {
    var socket = io.connect("http://24.16.255.56:8888");

    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');
    let gameEngine = new GameEngine(ctx);
    new Background(gameEngine);
    new BallOne(gameEngine);
    new BallTwo(gameEngine);
    new Paddle(gameEngine);
    new Noise(gameEngine);
    gameEngine.newGame();
 
    gameEngine.init(ctx);
    gameEngine.start();

    socket.on("load", function (data) {
        gameEngine.setGameState(data);
    });
    document.getElementById("save").onclick = function () {
        socket.emit("save", gameEngine.getGameState());
    };
    document.getElementById("load").onclick = function () {
        socket.emit("load", {studentname: "Gordon McCreary", statename: "aiMode"});
    };
    
});
