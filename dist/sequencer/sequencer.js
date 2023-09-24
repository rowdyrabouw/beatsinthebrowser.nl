let index = 0;
let isRecording = false;
const steps = 16;
const bpm = 0;

const recorder = new Tone.Recorder();
const pannerLow = new Tone.Panner(0).toDestination();
const pannerHigh = new Tone.Panner(0).toDestination();
const pitchShift = new Tone.PitchShift({
  pitch: 0,
  windowSize: 0.000001,
  delayTime: 0,
  feedback: 0
}
).toDestination();

Tone.Transport.bpm.value = bpm;
document.querySelector('#bpmText').innerHTML = bpm;

const voice = new Tone.Player('wav/turn-up-the-bass.wav').chain(pitchShift, recorder);
const voice2 = new Tone.Player('wav/let-the-music-take-control.wav').chain(pitchShift, recorder);
const kick = new Tone.Player('wav/909-kick.wav').chain(pannerLow, recorder);
const clap = new Tone.Player('wav/909-clap.wav').chain(pannerLow, recorder);
const closedHat = new Tone.Player('wav/909-closed-hat.wav').chain(pannerHigh, recorder);
const openHat = new Tone.Player('wav/909-open-hat.wav').chain(pannerHigh, recorder);

const repeat = (time) => {
  let step = index % steps;
  const voices = document.querySelector(`.voice label:nth-child(${step + 2}) input`);
  const muteVoices = document.querySelector('.voice [data-mute]');
  const kicks = document.querySelector(`.kick label:nth-child(${step + 2}) input`);
  const muteKicks = document.querySelector('.kick [data-mute]');
  let claps = document.querySelector(`.clap label:nth-child(${step + 2}) input`);
  let muteClaps = document.querySelector('.clap [data-mute]');
  let closedHats = document.querySelector(`.closed-hats label:nth-child(${step + 2}) input`);
  let muteClosedHats = document.querySelector('.closed-hats [data-mute]');
  let openHats = document.querySelector(`.open-hats label:nth-child(${step + 2}) input`);
  let muteOpenHats = document.querySelector('.open-hats [data-mute]');

  voices.classList.add('active');
  kicks.classList.add('active');
  claps.classList.add('active');
  closedHats.classList.add('active');
  openHats.classList.add('active');

  step = step === 0 ? steps : step;
  const voicePrev = document.querySelector(`.voice label:nth-child(${step + 1}) input`);
  const kicksPrev = document.querySelector(`.kick label:nth-child(${step + 1}) input`);
  const clapsPrev = document.querySelector(`.clap label:nth-child(${step + 1}) input`);
  const closedHatsPrev = document.querySelector(`.closed-hats label:nth-child(${step + 1}) input`);
  const openHatsPrev = document.querySelector(`.open-hats label:nth-child(${step + 1}) input`);

  voicePrev.classList.remove('active');
  kicksPrev.classList.remove('active');
  clapsPrev.classList.remove('active');
  closedHatsPrev.classList.remove('active');
  openHatsPrev.classList.remove('active');


  if (!muteVoices.checked && voices.checked) {
    voice.start(time);
  }

  if (!muteKicks.checked && kicks.checked) {
    kick.start(time);
  }

  if (!muteClaps.checked && claps.checked) {
    clap.start(time);
  }

  if (!muteClosedHats.checked && closedHats.checked) {
    closedHat.start(time);
  }

  if (!muteOpenHats.checked && openHats.checked) {
    openHat.start(time);
  }

  index++;
}

const btnRecord = document.querySelector('#record');
btnRecord.addEventListener('click', async () => {
  if (!isRecording) {
    btnRecord.classList.add('active');
    isRecording = true;
    const existingAudio = document.querySelector('#recordings audio');
    if (existingAudio) { existingAudio.remove(); }
    await recorder.start();
  }
  else {
    btnRecord.classList.remove('active');
    isRecording = false;
    const recording = await recorder.stop();
    const url = URL.createObjectURL(recording);
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = url;
    document.querySelector('#recordings').append(audio);
  }
});

const initSequencer = () => {
  Tone.Transport.scheduleRepeat((time) => {
    repeat(time);
  }, `${steps}n`);
}

const btnInit = document.querySelector('#init');
btnInit.addEventListener('click', () => {
  initSequencer();
  btnInit.classList.add("on");
  btnInit.disabled = true;
})

const btnMidi = document.querySelector("#initMidi");
btnMidi.addEventListener("click", () => {
  initMidi();
  btnMidi.classList.add("on");
  btnMidi.disabled = true;
});

document.querySelector('#start').addEventListener('click', () => {
  Tone.Transport.start();
})

document.querySelector('#stop').addEventListener('click', () => {
  Tone.Transport.stop();
})

document.querySelector('#pan-low').addEventListener('input', (event) => {
  pannerLow.pan.rampTo(+event.target.value, 0.1);
})

document.querySelector('#pan-high').addEventListener('input', (event) => {
  pannerHigh.pan.rampTo(+event.target.value, 0.1);
})

document.querySelector('#pitch').addEventListener('input', (event) => {
  pitchShift.pitch = parseFloat(event.target.value);
  pitchShift.windowSize = event.target.value == 0 ? 0.000001 : 0.01;
})

document.querySelector('#bpm').addEventListener('input', (event) => {
  document.querySelector('#bpmText').innerHTML = event.target.value;
  Tone.Transport.bpm.rampTo(+event.target.value, 0.1)
})

const mutes = document.querySelectorAll("[data-mute]");

const checkAllMutes = () => {
  for (let mute of mutes) {
    mute.checked = true;
  }
}

const unCheckAllMutes = () => {
  for (let mute of mutes) {
    mute.checked = false;
  }
}

const processMIDIMessage = (midiMessage, deviceId) => {
  // deviceId
  // 1523779451 = Fire
  // 1142489333 = LPD
  // -760933288 = MPK
  const note = midiMessage[1];
  const velocity = midiMessage[2];
  if (velocity > 0 && deviceId == 1523779451) {
    // Fire
    if (note >= 54 && note <= 117) {
      document.querySelector(`[data-note="${note}"]`).click();
    }
    else {
      switch (note) {
        case 36: // mute kick
          document.querySelector('[data-mute=kick]').click();
          break;
        case 37: // mute clap
          document.querySelector('[data-mute=clap]').click();
          break;
        case 38: // mute closet hi-hat
          document.querySelector('[data-mute="closed-hat"]').click();
          break;
        case 39: // mute open hi-hat
          document.querySelector('[data-mute="open-hat"]').click();
          break;
        case 51: //start
          document.querySelector('#start').click();
          break;
        case 52: //stop
          document.querySelector('#stop').click();
          break;
        case 53: //record
          document.querySelector('#record').click();
          break;
      }
    }
  }
  else if (velocity > 0 && (deviceId == 1142489333 || deviceId == -760933288)) {
    // LPD or MPK
    if (note === 39) {
      voice2.start();
    }
    else if (note >= 36 && note <= 43) {
      document.querySelector(`[data-note="${note}"]`).click();
    }
    else if (note >= 70 && note <= 73) {
      const knob = document.querySelector(`[data-note="k${note}"]`);
      knob.classList.add("active");
      setTimeout(() => {
        knob.classList.remove("active");
      }, 500);
    }

    const calculatePanValue = (velocity) => {
      let value;
      if (velocity < 64) {
        value = (velocity - 64) * 1 / 63;
      }
      if (velocity === 64) {
        value = 0;
      }
      if (velocity > 64) {
        value = velocity * 1 / 64 - 1;
      }
      return value;
    }

    const calculatePitchValue = (velocity) => {
      let value;
      if (velocity < 64) {
        value = (velocity - 64) * 50 / 63;
      }
      if (velocity === 64) {
        value = 0;
      }
      if (velocity > 64) {
        value = velocity * 50 / 64 - 50;
      }
      return value;
    }

    switch (note) {
      case 70: // pan low
        const valueLow = calculatePanValue(velocity);
        document.querySelector('#pan-low').value = valueLow;
        pannerLow.pan.rampTo(+valueLow, 0.1);
        break;
      case 71: // pan high
        const valueHigh = calculatePanValue(velocity);
        document.querySelector('#pan-high').value = valueHigh;
        pannerHigh.pan.rampTo(+valueHigh, 0.1);
        break;
      case 72: // pitch
        const valuePitch = calculatePitchValue(velocity);
        document.querySelector('#pitch').value = valuePitch;
        pitchShift.pitch = parseFloat(valuePitch);
        pitchShift.windowSize = valuePitch == 0 ? 0.000001 : 0.01;
        break;
      case 73: // bpm
        const bpm = velocity * 200 / 127;
        document.querySelector('#bpm').value = bpm;
        document.querySelector('#bpmText').innerHTML = bpm.toFixed(0);
        Tone.Transport.bpm.rampTo(bpm, 0.1);
        break;
    }
  }
};

const webMidiEnabled = () => {
  WebMidi.inputs.forEach((input) => {
    // console.log(input.manufacturer, input.name);
    // console.log(input);
    document.querySelector("#device").innerHTML += ` (<span>${input.name}</span>)`;
  });
  WebMidi.inputs.forEach((input) =>
    input.addListener("midimessage", (e) => {
      processMIDIMessage(e.data, e.port._midiInput.id);
    }
    ));
};

const initMidi = async () => {
  WebMidi.enable()
    .then(webMidiEnabled)
    .catch((err) => alert(err));
};

