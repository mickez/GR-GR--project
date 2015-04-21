(function() {
'use strict';

var mediaPlayer = new MediaPlayer();

var $ = document.querySelector.bind(document);
var pauseBtn = $('.pausePlay');
var pausePlayIcon = $('.pausePlayIcon');

function onFileDrop(event) {
	event.stopPropagation();
	event.preventDefault();

	var file = event.dataTransfer.files[0];

	mediaPlayer.load(file);

	setPausePlayIcon(false);
}

function onDragOver(event) {
	event.stopPropagation();
	event.preventDefault();	

	event.dataTransfer.dropEffect = 'copy';
}

function setPausePlayIcon(status) {
	var className = pausePlayIcon.className;
	var oldIcon = status ? 'fa-pause' : 'fa-play';
	var newIcon = status ? 'fa-play' : 'fa-pause';
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
				mediaPlayer.load(file);
				console.log(file);
				setPausePlayIcon(false);
			});

			input.click();
		}
	});

})();