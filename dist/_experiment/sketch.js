let loopBeat;
let bassSynth;
let cymbalSynth;

let counter;

const btnStart = document.querySelector('#start');
btnStart.addEventListener('click', () => {
  Tone.Transport.start();
})

const btnStop = document.querySelector('#stop');
btnStop.addEventListener('click', () => {
  Tone.Transport.stop();
})

function setup() {
  counter = 0;
  bassSynth = new Tone.MembraneSynth().toDestination();
  cymbalSynth = new Tone.MetalSynth().toDestination();

  loopBeat = new Tone.Loop(song, '16n');
  Tone.Transport.bpm.value = 140;
  loopBeat.start(0);
}

function song(time) {

  if (counter % 4 === 0) {
    bassSynth.triggerAttackRelease("F#1", "8n", time, 0.9);
  }
  if (counter % 4 !== 1) {
    if (counter === 3 || counter === 12) {
      cymbalSynth.envelope.decay = 0.5;
    }
    else {
      cymbalSynth.envelope.decay = 0.05;
    }
    cymbalSynth.triggerAttackRelease("g3", "32n", time, 0.2);
  }

  counter = (counter + 1) % 16;
}
