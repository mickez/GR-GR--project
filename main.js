(function() {
'use strict';

var mediaPlayer = new MediaPlayer();
mediaPlayer.onLoad.add(onLoad);
mediaPlayer.onEnded.add(function() {
	setPausePlayIcon();
});

var $ = document.querySelector.bind(document);

var pauseBtn = $('.pausePlay');
var pausePlayIcon = $('.pausePlayIcon');
var bg = $('.bg');

var artist = $('.artist');
var title = $('.title');
var disk = $('.disk');
var diskContainer = $('.diskContainer');

function onFileDrop(event) {
	event.stopPropagation();
	event.preventDefault();

	var file = event.dataTransfer.files[0];

	play(file);
}

function onDragOver(event) {
	event.stopPropagation();
	event.preventDefault();	

	event.dataTransfer.dropEffect = 'copy';
}

function onLoad(idTag) {
	artist.innerHTML = idTag.artist;
	title.innerHTML = idTag.title;

	loadAlbumArt(idTag.picture);
}

function loadAlbumArt(image) {
	var base64String = "";
	for (var i = 0; i < image.data.length; i++) {
	    base64String += String.fromCharCode(image.data[i]);
	}
	var dataUrl = "data:" + image.format + ";base64," + window.btoa(base64String);

	diskContainer.style['background-image'] = 'url(\"' + dataUrl + '\")';
	bg.style['background-image'] = 'url(\"' + dataUrl + '\")';

}

function play(file) {
	mediaPlayer.load(file);
	setPausePlayIcon(false);
}

function setPausePlayIcon(status) {
	var className = pausePlayIcon.className;
	var newIcon = 'fa-folder-open';

	if (status !== undefined) {
		newIcon = status ? 'fa-play' : 'fa-pause';
	} 
	className = className.replace(/fa-pause|fa-play|fa-folder-open/g, newIcon);

	pausePlayIcon.className = className;
}

document.body.addEventListener('dragover', onDragOver, false);
document.body.addEventListener('drop', onFileDrop, false);

Rx.Observable
	.fromEvent(pauseBtn, 'click')
	.forEach(function() {
		if (mediaPlayer.isLoaded) {
			var result = mediaPlayer.togglePause();
			setPausePlayIcon(result);
		} else {
			var input = document.createElement('input');
			input.type = 'file';

			input.addEventListener('change', function(event) {
				var file = event.target.files[0];

				play(file);
			});

			input.click();
		}
	});

})();