let index = 0;
const steps = 16;
const bpm = 0;

Tone.Transport.bpm.value = bpm;
document.querySelector('#bpmText').innerHTML = bpm;

const kick = new Tone.Player('wav/909-kick.wav').toDestination();
const snare = new Tone.Player('wav/909-snare.wav').toDestination();
const clap = new Tone.Player('wav/909-clap.wav').toDestination();
const closedHat = new Tone.Player('wav/909-closed-hat.wav').toDestination();
const openHat = new Tone.Player('wav/909-open-hat.wav').toDestination();
const tom = new Tone.Player('wav/909-tom.wav').toDestination();


function repeat(time) {
  let step = index % steps;
  let kicks = document.querySelector(`.kick label:nth-child(${step + 2}) input`);
  let muteKicks = document.querySelector('.kick [data-mute]');
  let snares = document.querySelector(`.snare label:nth-child(${step + 2}) input`);
  let muteSnares = document.querySelector('.snare [data-mute]');
  let claps = document.querySelector(`.clap label:nth-child(${step + 2}) input`);
  let muteClaps = document.querySelector('.clap [data-mute]');
  let closedHats = document.querySelector(`.closed-hats label:nth-child(${step + 2}) input`);
  let muteClosedHats = document.querySelector('.closed-hats [data-mute]');
  let openHats = document.querySelector(`.open-hats label:nth-child(${step + 2}) input`);
  let muteOpenHats = document.querySelector('.open-hats [data-mute]');
  let toms = document.querySelector(`.toms label:nth-child(${step + 2}) input`);
  let muteToms = document.querySelector('.toms [data-mute]');

  kicks.classList.add('active');
  snares.classList.add('active');
  claps.classList.add('active');
  closedHats.classList.add('active');
  openHats.classList.add('active');
  toms.classList.add('active');

  step = step === 0 ? steps : step;
  const kicksPrev = document.querySelector(`.kick label:nth-child(${step + 1}) input`);
  const snaresPrev = document.querySelector(`.snare label:nth-child(${step + 1}) input`);
  const clapsPrev = document.querySelector(`.clap label:nth-child(${step + 1}) input`);
  const closedHatsPrev = document.querySelector(`.closed-hats label:nth-child(${step + 1}) input`);
  const openHatsPrev = document.querySelector(`.open-hats label:nth-child(${step + 1}) input`);
  const tomsPrev = document.querySelector(`.toms label:nth-child(${step + 1}) input`);

  kicksPrev.classList.remove('active');
  snaresPrev.classList.remove('active');
  clapsPrev.classList.remove('active');
  closedHatsPrev.classList.remove('active');
  openHatsPrev.classList.remove('active');
  tomsPrev.classList.remove('active');

  if (!muteKicks.checked && kicks.checked) {
    kick.start(time);
  }

  if (!muteSnares.checked && snares.checked) {
    snare.start(time);
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

  if (!muteToms.checked && toms.checked) {
    tom.start(time);
  }
  index++;
}

function initSequencer() {
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
});

document.querySelector('#start').addEventListener('click', () => {
  Tone.Transport.start();
})

document.querySelector('#stop').addEventListener('click', () => {
  Tone.Transport.stop();
})

document.querySelector('#bpm').addEventListener('input', (event) => {
  document.querySelector('#bpmText').innerHTML = event.target.value;
  Tone.Transport.bpm.rampTo(+event.target.value, 0.1)
})

const solos = document.querySelectorAll("[data-solo]");
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

const unCheckAllSolos = (current) => {
  console.info(current);
  for (let solo of solos) {
    if (solo.dataset.solo !== current.dataset.solo) {
      solo.checked = false;
    }
  }
}

solos.forEach((solo) => {
  solo.addEventListener("click", (e) => {
    if (e.target.checked === true) {
      checkAllMutes();
    }
    else {
      unCheckAllMutes();
    }
    unCheckAllSolos(solo);
    document.querySelector(`[data-mute="${solo.dataset.solo}"]`).checked = false;
  });
});

const onMIDIFailure = () => {
  console.error("Could not access your MIDI devices.");
};

const processMIDIMessage = (midiMessage) => {
  const note = midiMessage.data[1];
  const velocity = midiMessage.data[2];
  if (velocity > 0) {
    switch (note) {
      case 16: // solo kick
        document.querySelector('[data-solo=kick]').click();
        break;
      case 17: // solo snare
        document.querySelector('[data-solo=snare]').click();
        break;
      case 18: // solo clap
        document.querySelector('[data-solo=clap]').click();
        break;
      case 19: // solo closet hi-hat
        document.querySelector('[data-solo="closed-hat"]').click();
        break;
      case 12: // solo open hi-hat
        document.querySelector('[data-solo="open-hat"]').click();
        break;
      case 13: // solo toms
        document.querySelector('[data-solo="tom"]').click();
        break;
      case 40: // mute kick
        document.querySelector('[data-mute=kick]').click();
        break;
      case 41: // mute snare
        document.querySelector('[data-mute=snare]').click();
        break;
      case 42: // mute clap
        document.querySelector('[data-mute=clap]').click();
        break;
      case 43: // mute closet hi-hat
        document.querySelector('[data-mute="closed-hat"]').click();
        break;
      case 36: // mute open hi-hat
        document.querySelector('[data-mute="open-hat"]').click();
        break;
      case 37: // mute toms
        document.querySelector('[data-mute="tom"]').click();
        break;
      case 70: // bpm
        const bpm = velocity * 200 / 127;
        document.querySelector('#bpm').value = bpm;
        document.querySelector('#bpmText').innerHTML = bpm.toFixed(0);
        Tone.Transport.bpm.rampTo(bpm, 0.1);
        break;
    }
  }
};

const onMIDISuccess = (midiAccess) => {
  midiAccess.addEventListener("statechange", (event) => {
    btnMidi.classList.add("on");
    btnMidi.disabled = true;
    document.querySelector("#device").innerHTML = ` (<span>${event.port.manufacturer} ${event.port.name}</span>)`;
    console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`);
  });

  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = processMIDIMessage;
  }
};

const initMidi = async () => {
  try {
    const midiAccess = await navigator.requestMIDIAccess();
    onMIDISuccess(midiAccess);
  } catch (err) {
    onMIDIFailure(err);
  }
};

