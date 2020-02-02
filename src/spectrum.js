export default function spectrum(audio, canvas) {
  const cctx = canvas.getContext('2d');
  const actx = new AudioContext();
  const analyser = actx.createAnalyser();
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.connect(actx.destination);
  analyser.getByteFrequencyData(dataArray);
  const source = actx.createMediaElementSource(audio);
  source.connect(analyser);
  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    cctx.clearRect(0, 0, canvas.width, canvas.height);
    cctx.lineWidth = 2;
    cctx.strokeStyle = 'rgb(0, 0, 0)';
    cctx.beginPath();
    const sliceWidth = canvas.width * 1.0 / bufferLength;
    for (let x = 0, i = 0; i < bufferLength; i++) {
      const y = (1 - dataArray[i] / 256.0) * canvas.height;
      (i === 0) ? cctx.moveTo(x, y) : cctx.lineTo(x, y);
      x += sliceWidth;
    }
    cctx.stroke();
    cctx.closePath();
  }
  draw();
}
