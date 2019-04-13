/**
    An asset manager class to manage the assets loaded into the game. 
    Mostly only used for audio purposes for this game but small changes make it work great for images etc.
*/

function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
}

AssetManager.prototype.queueDownload = function (path) {
    console.log("Queueing " + path);
    this.downloadQueue.push(path);
};

AssetManager.prototype.isDone = function () {
    return this.downloadQueue.length === this.successCount + this.errorCount;
};

AssetManager.prototype.downloadBulk = function(paths, callback){
    for(let i = 0; i < paths.length; i++) {
        this.downloadQueue.push(paths[i])
    }
    this.downloadAll(callback)
};

AssetManager.prototype.downloadAll = function (callback) {
    for (var i = 0; i < this.downloadQueue.length; i++) {
        
        var path = this.downloadQueue[i];
        var asset = null

        if(path.includes('wav') || path.includes('.mp3')){
            console.log('adding new sound: ', path)
            asset = new Audio();

            asset.addEventListener('canplaythrough', function(){
               // console.log("Loaded " + this.src);
                that.successCount++;
                if(that.isDone()) callback();
            })


        }else{
            console.log('adding new image: ', path)
            asset = new Image()

            asset.addEventListener("load", function () {
                console.log("Loaded " + this.src);
                that.successCount++;
                if(that.isDone()) callback();
            });
        }
        
        //var img = new Image();
        var that = this;

        //var path = this.downloadQueue[i];
        //console.log(path);



        asset.addEventListener("error", function () {
            console.log("Error loading " + this.src);
            that.errorCount++;
            if (that.isDone()) callback();
        });

        asset.src = path;
        this.cache[path] = asset;
    }
}

AssetManager.prototype.getAsset = function (path) {
    return this.cache[path];
};

var AM = new AssetManager();