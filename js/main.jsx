(function() {
'use strict';

var mediaPlayer = new MediaPlayer();
var analyser = new Analyser(mediaPlayer, 500, 500, 0.5, 75);
window.analyser = analyser;

var $ = document.querySelector.bind(document);

var bg = $('.bg');
var artist = $('.artist');
var title = $('.title');
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
	artist.innerHTML = idTag.artist || 'Unkown Artist';
	title.innerHTML = idTag.title || 'Unkown Track';

	document.title = (idTag.title || 'Unkown Track') + ' - ' +(idTag.artist || 'Unkown Artist');

	if (idTag.picture) {
		loadAlbumArt(idTag.picture);
	} else if (idTag.album) {
		qwest
			.get('https://api.spotify.com/v1/search?q=' + [idTag.album, idTag.artist].join(' ') + '&type=album')
			.then(function(res) {
				console.log(res)
				if (res.albums.items.length > 0) {
					diskContainer.style['background-image'] = 'url(' + res.albums.items[0].images[0].url + ')';
					bg.style['background-image'] = 'url(' + res.albums.items[0].images[0].url + ')';
				} else {
					loadAlbumArt();
				}
			});
	}

}

function loadAlbumArt(image) {
	var dataUrl = 'images/bg.jpg';
	
	if (image) {
		var base64String = "";
		for (var i = 0; i < image.data.length; i++) {
		    base64String += String.fromCharCode(image.data[i]);
		}
		dataUrl = "data:" + image.format + ";base64," + window.btoa(base64String);
	}

	diskContainer.style['background-image'] = 'url(\"' + dataUrl + '\")';
	bg.style['background-image'] = 'url(\"' + dataUrl + '\")';

}

function play(file) {
	mediaPlayer.load(file);
}

var input = document.createElement('input');
input.type = 'file';
input.addEventListener('change', function(event) {
	var file = event.target.files[0];

	play(file);
});
function browseFile() {
	input.value = '';
	input.click();
}

function onAction() {
	if (mediaPlayer.isLoaded) {
		var result = mediaPlayer.togglePause();
	} else {
		browseFile();
	}
}

function onMute() {
	mediaPlayer.muted = !mediaPlayer.muted;
}

function onBrowse() {
	browseFile();
}

function onScrubChange(props) {
	mediaPlayer.audio.currentTime = mediaPlayer.audio.duration * props.value;
	renderApp();
}

function renderApp() {
	var time = new Date(mediaPlayer.audio.currentTime * 1000);
	var duration = new Date(mediaPlayer.audio.duration * 1000);
	var icon = !mediaPlayer.currentFile || mediaPlayer.audio.ended ? undefined : mediaPlayer.audio.paused;

	React.render((
		<div>
			<DiscComponent onAction={onAction} onMute={onMute} onBrowse={onBrowse} icon={icon} muted={mediaPlayer.muted || mediaPlayer.volume === 0}/>
			<ScrubContainer time={time} duration={duration} onChange={onScrubChange} />
		</div>
	), document.getElementById('playerControls'));
}

function renderFrame() {
	requestAnimationFrame(renderFrame);

	mediaPlayer.analyser.getByteFrequencyData()
}

mediaPlayer.onLoad.add(onLoad);
mediaPlayer.audio.addEventListener('volumechange', renderApp);
mediaPlayer.audio.addEventListener('timeupdate', renderApp);
mediaPlayer.audio.addEventListener('pause', renderApp);
mediaPlayer.audio.addEventListener('playing', renderApp);

document.body.addEventListener('dragover', onDragOver, false);
document.body.addEventListener('drop', onFileDrop, false);

renderApp();

diskContainer.insertBefore(analyser.canvas, document.getElementById('playerControls'));

})();
