(function() {
'use strict';

function MediaPlayer() {
	this.audio = new Audio();
	this.current = undefined;
}

self.MediaPlayer = MediaPlayer;
MediaPlayer.prototype.constructor = MediaPlayer;

MediaPlayer.prototype.load = function(file) {
	var reader = new FileReader();
	reader.onload = function(e) {
		this.current = e.target.result;

		this.audio.src = this.current;
		this.play();
	}.bind(this);

	reader.readAsDataURL(file);
}

MediaPlayer.prototype.togglePause = function() {
	if (this.audio) {
		if (this.audio.paused) {
			this.play();
		} else {
			this.pause();
		}

		return this.audio.paused;
	}
	return null;
}

MediaPlayer.prototype.play = function() {
	if (this.audio) {
		this.audio.play();
	}
}

MediaPlayer.prototype.pause = function() {
	if (this.audio) {
		this.audio.pause();
	}
}

Object.defineProperty(MediaPlayer.prototype, 'isLoaded', {
	get: function() {
		return this.audio && (this.audio.src !== '');
	}
});

})();