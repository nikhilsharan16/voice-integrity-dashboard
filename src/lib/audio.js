// Decodes an uploaded audio file into a downsampled amplitude envelope
// so the waveform shown is the ACTUAL uploaded clip, not a fake animation.
export async function getAudioPeaks(file, buckets = 36) {
  const arrayBuffer = await file.arrayBuffer();
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContextCtor();
  try {
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
    const raw = audioBuffer.getChannelData(0);
    const blockSize = Math.max(1, Math.floor(raw.length / buckets));
    const peaks = [];
    for (let i = 0; i < buckets; i++) {
      const start = i * blockSize;
      let max = 0;
      for (let j = 0; j < blockSize; j++) {
        const v = Math.abs(raw[start + j] || 0);
        if (v > max) max = v;
      }
      peaks.push(max);
    }
    return { peaks, duration: audioBuffer.duration };
  } finally {
    audioCtx.close();
  }
}
