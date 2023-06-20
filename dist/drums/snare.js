const playSnare = () => {
  const lowTriangle = ctx.createOscillator();
  lowTriangle.type = "triangle";
  lowTriangle.frequency.value = 185;

  const highTriangle = ctx.createOscillator();
  highTriangle.type = "triangle";
  highTriangle.frequency.value = 349;

  const noise = whiteNoiseBufferSource();

  const lowWaveShaper = ctx.createWaveShaper();
  lowWaveShaper.curve = distortionCurve(5);

  const highWaveShaper = ctx.createWaveShaper();
  highWaveShaper.curve = distortionCurve(5);

  const lowTriangleGainNode = ctx.createGain();
  lowTriangleGainNode.gain.value = 1;
  lowTriangleGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

  const highTriangleGainNode = ctx.createGain();
  highTriangleGainNode.gain.value = 1;
  highTriangleGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

  const snareGainNode = ctx.createGain();
  snareGainNode.gain.value = 0.5;

  lowTriangle.connect(lowWaveShaper);
  lowWaveShaper.connect(lowTriangleGainNode);
  lowTriangleGainNode.connect(snareGainNode);
  snareGainNode.connect(ctx.destination);

  highTriangle.connect(highWaveShaper);
  highWaveShaper.connect(highTriangleGainNode);
  highTriangleGainNode.connect(snareGainNode);

  const noiseGainNode = ctx.createGain();
  noiseGainNode.gain.value = 1;
  noiseGainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 2000;

  noise.connect(noiseGainNode);
  noiseGainNode.connect(noiseFilter);
  noiseFilter.connect(snareGainNode);

  lowTriangle.start(ctx.currentTime);
  lowTriangle.stop(ctx.currentTime + 1);

  highTriangle.start(ctx.currentTime);
  highTriangle.stop(ctx.currentTime + 1);

  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 1);
};
