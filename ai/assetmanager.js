/**
 * The AssetManager class allows you to asynchronously download game assets
 * into cache. You can then access the assets from the cache upon request.
 */
class AssetManager {

    constructor() {
        this._successCount = 0;
        this._errorCount = 0;
        this._cache = [];
        this._downloadQueue = [];
    }

    /**
     * Adds an asset to the download queue.
     * @param {string} path The path of the asset you want to download
     *      represented by a string.
     */
    queueDownload(path) {
        this._downloadQueue.push(path);
    }

    /**
     * @return {boolean} Returns true if all the downloads have finished.
     */
    isDone() {
        return this._downloadQueue.length === this._successCount + this._errorCount;
    }

    /**
     * Downloads all of the assets in the download queue.
     * @param {Function} callback A callback function to be called when all
     *      downloads finish.
     */
    downloadAll(callback) {
        for (let i = 0; i < this._downloadQueue.length; i++) {
            let img = new Image();
            let that = this;

            let path = this._downloadQueue[i];

            img.addEventListener("load", function () {
                that._successCount++;
                if (that.isDone()) callback();
            });

            img.addEventListener("error", function () {
                that._errorCount++;
                if (that.isDone()) callback();
            });

            img.src = path;
            this._cache[path] = img;
        }
    }

    /**
     * @param {string} path The path that was used in queueDownload() to
     *      download the asset.
     * @return {*} Returns the asset from the cache.
     */
    getAsset(path) {
        return this._cache[path];
    }
}