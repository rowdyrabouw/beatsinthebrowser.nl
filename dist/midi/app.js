const btnMidi = document.querySelector("#initMidi");
btnMidi.addEventListener("click", () => {
  initMidi();
  btnMidi.classList.add("on");
});

const data = document.querySelector("#data");

const onMIDISuccess = (midiAccess) => {
  midiAccess.addEventListener("statechange", (event) => {
    document.querySelector('#device').innerHTML = ` (<span>${event.port.manufacturer} ${event.port.name}</span>)`;
    console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`);
  });

  const inputs = midiAccess.inputs;
  inputs.forEach((input) => {
    input.addEventListener("midimessage", handleInput);
  });
}

const handleInput = (input) => {
  const command = input.data[0];
  const note = input.data[1];
  const velocity = input.data[2];
  if (command !== 185 || (command === 185 && velocity > 0)) {
    data.innerHTML = `${command}, ${note}, ${velocity}`;
  }
  switch (command) {
    case 144: //noteOn
      document.querySelector(`[data-note="${note}"]`).classList.add("active");
      break;
    case 128: // noteOff
      document.querySelector(`[data-note="${note}"]`).classList.remove("active");
      break;
    case 176: // nobs
      if (note === 70 || note === 71) {
        const knob = document.querySelector(`[data-note="${note}"]`);
        knob.classList.add("active");
        setTimeout(() => {
          knob.classList.remove("active");
        }, 1000);
      }
      break;
    case 185: // pads
      const pad = document.querySelector(`[data-note="${note}"]`);
      pad.classList.add("active");
      setTimeout(() => {
        pad.classList.remove("active");
      }, 250);
      break;
  }
}

function onMIDIFailure() {
  console.log("Could not connect MIDI");
}

const initMidi = async () => {
  try {
    const midiAccess = await navigator.requestMIDIAccess();
    onMIDISuccess(midiAccess);
  } catch (err) {
    onMIDIFailure(err);
  }
};