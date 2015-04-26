/* global AudioContext:false, signals:false, ID3:false, FileAPIReader:false */
(function() {
'use strict';

function MediaPlayer() {
	this.audio = new Audio();
	this.audio.addEventListener('ended', this._onEnded.bind(this));

	this.currentData = undefined;
	this.currentFile = undefined;
	this.currentTag = undefined;

	this.audioCtx = new AudioContext();
	this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);
	this.analyser = this.audioCtx.createAnalyser();

	this.audioSrc.connect(this.analyser);
	this.analyser.connect(this.audioCtx.destination);

	this.onLoad = new signals.Signal();
	this.onPlay = new signals.Signal();
	this.onPause = new signals.Signal();
	this.onEnded = new signals.Signal();
}

window.MediaPlayer = MediaPlayer;
MediaPlayer.prototype.constructor = MediaPlayer;

MediaPlayer.prototype.load = function(file) {
	this.currentFile = file;
	var reader = new FileReader();
	reader.onload = function(e) {
		this.currentData = e.target.result;

		this.audio.src = this.currentData;

		this.play();
	}.bind(this);

	reader.readAsDataURL(file);

	ID3.loadTags(file.name, function() {
	    this.currentTag = ID3.getAllTags(file.name);
	    this.onLoad.dispatch(this.currentTag);
	}.bind(this), {
	    dataReader: FileAPIReader(this.currentFile),
	    tags: ['title', 'artist', 'album', 'track', 'picture']
	});
};

MediaPlayer.prototype._onEnded = function() {
	this.onEnded.dispatch();
};

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
};

MediaPlayer.prototype.play = function() {
	if (this.audio) {
		this.audio.play();
		this.onPlay.dispatch();
	}
};

MediaPlayer.prototype.pause = function() {
	if (this.audio) {
		this.audio.pause();
		this.onPause.dispatch();
	}
};

Object.defineProperty(MediaPlayer.prototype, 'isLoaded', {
	get: function() {
		return this.audio && (this.audio.src !== '') && !this.audio.ended;
	}
});

Object.defineProperty(MediaPlayer.prototype, 'muted', {
	get: function() {
		return this.audio ? this.audio.muted : undefined;
	},
	set: function(value) {
		if (this.audio) {
			this.audio.muted = value;
		}
	}
});

})();