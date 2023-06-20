const audio = document.querySelector('#audioPlayer');
const audioCurrent = document.querySelector('.current');
const audioDuration = document.querySelector('.duration');
const playButton = document.querySelector('.play-button');
let isPlaying = false;

const toggleAudio = (event) => {
  if (isPlaying) {
    audioCtx.suspend();
    audio.pause()
    isPlaying = false
    playButton.classList.remove('playing')
  } else {
    audioCtx.resume();
    audio.play()
    isPlaying = true
    playButton.classList.add('playing')
  }
}

audio.onloadedmetadata = () => {
  let minutes = Math.floor(audio.duration / 60)
  let seconds = Math.floor(audio.duration - minutes * 60)
  audioDuration.innerHTML = `${minutes}:${seconds}`
}

audio.addEventListener("timeupdate", function () {
  let minutes = Math.floor(audio.currentTime / 60)
  let seconds = Math.floor(audio.currentTime - minutes * 60)
  audioCurrent.innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`
});