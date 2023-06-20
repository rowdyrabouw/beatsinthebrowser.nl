const distortionCurve = (amount) => {
  const numberOfSamples = 44100;
  const curve = new Float32Array(numberOfSamples);
  const deg = Math.PI / 180;
  for (let i = 0; i < numberOfSamples; ++i) {
    const x = (i * 2) / numberOfSamples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
};

const generateWhiteNoiseBuffer = (numberOfSamples) => {
  const buffer = ctx.createBuffer(1, numberOfSamples, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < numberOfSamples; ++i) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

const whiteNoiseBuffer = generateWhiteNoiseBuffer(ctx.sampleRate);

const whiteNoiseBufferSource = () => {
  const bufferSource = ctx.createBufferSource();
  bufferSource.buffer = whiteNoiseBuffer;
  bufferSource.loop = true;
  bufferSource.loopEnd = ctx.sampleRate;
  return bufferSource;
};

const playKick = () => {
  ctx.resume();

  const triangle = ctx.createOscillator();
  triangle.type = "triangle";
  triangle.frequency.value = 220;
  triangle.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.1);

  const noise = whiteNoiseBufferSource();

  const waveShaper = ctx.createWaveShaper();
  waveShaper.curve = distortionCurve(5);

  const triangleGainNode = ctx.createGain();
  triangleGainNode.gain.value = 1;
  triangleGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

  triangle.connect(waveShaper);
  waveShaper.connect(triangleGainNode);
  triangleGainNode.connect(ctx.destination);

  const noiseGainNode = ctx.createGain();
  noiseGainNode.gain.value = 1;
  noiseGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 120;

  noise.connect(noiseGainNode);
  noiseGainNode.connect(noiseFilter);
  noiseFilter.connect(ctx.destination);

  triangle.start(ctx.currentTime);
  triangle.stop(ctx.currentTime + 1);

  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 1);
};
