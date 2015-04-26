/* global AudioContext */
(function() {
'use strict';

    /**
     * Initializes the analysert
     * @param {MediaPlayer} mediaPlayer An instance of a mediaPlayer
     */
    function Analyser(mediaPlayer, width, height, resolution, radius) {
        // If AudioContext isnt support then this object isn't needed
        if (!AudioContext) { return; }

        this.mediaPlayer = mediaPlayer;

        this.resolution = resolution;

        this.radius = radius || 100;

        this.type = 0;

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'visualiser';
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvasContext = this.canvas.getContext('2d');
        this.canvasContext.fillStyle = 'rgba(221,94,0,0.9)';

        this.frequencyData = NaN;

        this.mediaPlayer.onLoad.add(this._onLoad, this);
        this.renderFrame();
    }

    window.Analyser = Analyser;
    Analyser.prototype.constructor = Analyser;

    Analyser.prototype._onLoad = function() {
        this.frequencyData = new Uint8Array(this.mediaPlayer.analyser.frequencyBinCount);

    };

    Analyser.prototype.renderFrame = function() {
        requestAnimationFrame(this.renderFrame.bind(this));

        if (!this.frequencyData) { return; }

        this.mediaPlayer.analyser.getByteFrequencyData(this.frequencyData);

        var ctx = this.canvasContext;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        switch (this.type) {
            case 0:
                this._circular(ctx);
                break;
            case 1:
                this._linear(ctx);
                break;
            default:
                this._linear(ctx);
                break;
        }
    };

    Analyser.prototype._linear = function(ctx) {
        var middleX = ctx.canvas.width / 2;
        var middleY = ctx.canvas.height / 2;
        var height, x, y;

        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height);

        var oldHeight, i;
        // Skip the 10 first as there will most likely be an ugly gap
        for (i = this.frequencyData.length - 1; i >= 2; i -= (1 / this.resolution)) {
            height = (ctx.canvas.height / 255) * this.frequencyData[i];
            oldHeight = oldHeight || height;
            height = (height + oldHeight * 3) / 4;

            x = middleX - (ctx.canvas.width / this.frequencyData.length) * i * (1 / this.resolution) / 2;
            y = (ctx.canvas.height - height);

            ctx.lineTo(x, y);

            oldHeight = height;
        }

        // Skip the 10 first as there will most likely be an ugly gap
        for (i = 2; i < this.frequencyData.length; i += (1 / this.resolution)) {
            height = (ctx.canvas.height / 255) * this.frequencyData[i];
            oldHeight = oldHeight || height;
            height = (height + oldHeight * 3) / 4;

            x = middleX + (ctx.canvas.width / this.frequencyData.length) * i * (1 / this.resolution) / 2;
            y = (ctx.canvas.height - height);

            ctx.lineTo(x, y);

            oldHeight = height;
        }

        ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        ctx.lineTo(0, ctx.canvas.height);
        ctx.closePath();

        ctx.fill();
    };

    Analyser.prototype._circular = function(ctx) {
        var middleX = ctx.canvas.width / 2;
        var middleY = ctx.canvas.height * 0.9;
        var oldHeight, height, rotation = Math.PI / 2, step = (Math.PI) / this.frequencyData.length, i, x, y, offsetX, offsetY;


        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height);

        // Skip the 10 first as there will most likely be an ugly gap
        for (i = this.frequencyData.length - 1; i >= 2; i--) {
            height = (ctx.canvas.height / 255) * this.frequencyData[i] / 2;
            oldHeight = oldHeight || height;
            height = (height + oldHeight * 3) / 4;

            y = (ctx.canvas.height - height);

            offsetX = Math.cos(rotation) * this.radius;
            offsetY = Math.sin(rotation) * this.radius;

            if (i === this.frequencyData.length - 1) {
                ctx.moveTo(middleX + offsetX + Math.cos(rotation) * height, middleY + offsetY + Math.sin(rotation) * height);
            } else {
                ctx.lineTo(middleX + offsetX + Math.cos(rotation) * height, middleY + offsetY + Math.sin(rotation) * height);
            }

            rotation += step;
            oldHeight = height;
        }
        // Skip the 10 first as there will most likely be an ugly gap
        for (i = 2; i < this.frequencyData.length; i++) {
            height = (ctx.canvas.height / 255) * this.frequencyData[i] / 2;
            oldHeight = oldHeight || height;
            height = (height + oldHeight * 3) / 4;

            y = (ctx.canvas.height - height);

            offsetX = Math.cos(rotation) * this.radius;
            offsetY = Math.sin(rotation) * this.radius;

            if (i === 0) {
                ctx.moveTo(middleX + offsetX + Math.cos(rotation) * height, middleY + offsetY + Math.sin(rotation) * height);
            } else {
                ctx.lineTo(middleX + offsetX + Math.cos(rotation) * height, middleY + offsetY + Math.sin(rotation) * height);
            }

            rotation += step;
            oldHeight = height;
        }

        ctx.closePath();

        ctx.fill();

    };

})();
