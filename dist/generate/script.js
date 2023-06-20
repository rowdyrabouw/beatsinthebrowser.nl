const play = () => {
  const ctx = new AudioContext();
  const osc = new OscillatorNode(ctx, {
    frequency: 440,
    type: "sine",
  });

  osc.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
};
