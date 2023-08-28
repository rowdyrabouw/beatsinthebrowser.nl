const checkPads = (data, type) => {
  const drumData = data.find(({ drum }) => drum === type);
  const drums = document.querySelectorAll(`.${drumData.drum} input:not([data-mute])`);
  drums.forEach((drum, index) => {
    drum.checked = drumData.pattern[index];
  });
}

const loadPattern = (json) => {
  fetch(`json/${json}`).then(response => response.json()).then(data => {
    const bpm = data.find(({ bpm }) => bpm > 0).bpm;
    document.querySelector('#bpm').value = bpm;
    document.querySelector('#bpmText').innerHTML = bpm;
    Tone.Transport.bpm.value = bpm;
    checkPads(data, 'kick');
    checkPads(data, 'snare');
    checkPads(data, 'clap');
    checkPads(data, 'closed-hats');
    checkPads(data, 'open-hats');
    checkPads(data, 'toms');
  });
}

loadPattern('empty.json');