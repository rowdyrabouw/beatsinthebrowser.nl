const oscillators = [];

let frequency = 440;
document.querySelector('#frequency').innerHTML = `${frequency} Hz`;

let wave = 'sine';

const ctx = new AudioContext();

const btnCtx = document.querySelector("#ctx");
btnCtx.addEventListener("click", () => {
  ctx.resume();
});

const btnMidi = document.querySelector("#initMidi");
btnMidi.addEventListener("click", () => {
  initMidi();
  btnMidi.classList.add("on");
});

ctx.onstatechange = () => {
  if (ctx.state === "running") {
    btnCtx.classList.add("on");
  } else {
    btnCtx.classList.remove("on");
  }
};
const pads = document.querySelectorAll(".pads [data-note]");
pads.forEach((pad) => {
  pad.addEventListener("click", () => {
    // console.info(pad.dataset.note);
    setWave(Number(pad.dataset.note));
  });
});


const keys = document.querySelectorAll(".keys [data-note]");
keys.forEach((key) => {
  key.addEventListener("mousedown", () => {
    noteOn(key.dataset.note, 100);
  });
  key.addEventListener("mouseup", () => {
    noteOff(key.dataset.note);
  });
});

const knob = document.querySelector("#knob");

knob.addEventListener("input", (event) => {
  setFrequency(event.target.value);
});

const onMIDISuccess = (midiAccess) => {
  midiAccess.addEventListener("statechange", (event) => {
    document.querySelector('#device').innerHTML = ` (<span>${event.port.manufacturer} ${event.port.name}</span>)`;
    console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`);
  });

  const inputs = midiAccess.inputs;
  inputs.forEach((input) => {
    // console.log(input);
    input.addEventListener("midimessage", handleInput);
  });
}

const setFrequency = (value) => {
  frequency = 4657 * value / 127;
  document.querySelector('#frequency').innerHTML = `${frequency.toFixed(0)} Hz`;
  document.querySelector('#knob').value = value;
}

const setWave = (value) => {
  switch (value) {
    case 20:
      wave = 'sine'
      break;
    case 21:
      wave = 'triangle'
      break;
    case 22:
      wave = 'square'
      break;
    case 23:
      wave = 'sawtooth'
      break;
  }
  // sine, square, triangle, sawtooth
  // wave = 4400 * value / 127;
  const pad = document.querySelector(`[data-note="${value}"]`);
  pad.classList.add("active");
  setTimeout(() => {
    pad.classList.remove("active");
  }, 250);

}


const midiToFrequency = (number) => {
  // console.log('midiToFrequency', number);
  // console.log('midiToFrequency', frequency);
  return (frequency / 32) * (2 ** ((number - 9) / 12));
}

const noteOn = (note, velocity) => {
  const oscillator = ctx.createOscillator();

  const oscillatorGain = ctx.createGain();
  oscillator.connect(oscillatorGain);
  oscillator.gain = oscillatorGain;

  const velocityGain = ctx.createGain();
  oscillatorGain.connect(velocityGain);
  velocityGain.connect(ctx.destination);

  const velocityGainAmount = (1 / 127) * velocity;
  velocityGain.gain.value = velocityGainAmount;

  document.querySelector('#velocity').innerHTML = `${(velocityGainAmount * 100).toFixed(0)} %`;

  oscillator.type = wave;
  oscillator.frequency.value = midiToFrequency(note);

  oscillators[note.toString()] = oscillator;

  oscillator.start();

  document.querySelector(`[data-note="${note}"]`).classList.add("active");
}

const noteOff = (note) => {
  const oscillator = oscillators[note.toString()];
  const oscillatorGain = oscillator.gain;

  oscillatorGain.gain.setValueAtTime(oscillatorGain.gain.value, ctx.currentTime);
  oscillatorGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03)

  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect();
  }, 50);

  delete oscillators[note.toString()]
  // console.log(oscillators);

  document.querySelector(`[data-note="${note}"]`).classList.remove("active");

}

const handleInput = (input) => {
  // console.info(input);
  const command = input.data[0];
  const note = input.data[1];
  const velocity = input.data[2];
  // console.log(command, note, velocity)
  switch (command) {
    case 144: //noteOn
      noteOn(note, velocity);
      break;
    case 128: // noteOff
      noteOff(note);
      break;
    case 176: // nobs
      if (note === 70) {
        // console.log('velocity', velocity);
        const knob = document.querySelector(`[data-note="${note}"]`);
        knob.classList.add("active");
        setTimeout(() => {
          knob.classList.remove("active");
        }, 1000);
        setFrequency(velocity);
      }
      break;
    case 185: // pads
      setWave(note);
      break;
  }
}

function onMIDIFailure() {
  console.log("Could not connect MIDI");
}

// if (navigator.requestMIDIAccess) {
//   navigator.requestMIDIAccess().then(succes, failure);
// }

const initMidi = async () => {
  try {
    const midiAccess = await navigator.requestMIDIAccess();
    onMIDISuccess(midiAccess);
  } catch (err) {
    onMIDIFailure(err);
  }
};