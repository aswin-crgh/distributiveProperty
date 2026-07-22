// Web-Audio synth — distinct per-beat cues for each interaction/animation, plus a
// soft "magnetic" sound for the merge/de-merge loop. Lazily created on first gesture.
const AudioKit = (() => {
  let ctx = null, master = null, lp = null;
  // C-major pentatonic ramp (pleasant, no dissonance as steps stack)
  const P = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.5, 1567.98];

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.5;
      lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 7200;
      master.connect(lp); lp.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function note(freq, t0, dur, type, peak, glideTo) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), t0 + dur * 0.9);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(master);
    o.start(t0); o.stop(t0 + dur + 0.03);
  }

  // filtered-noise texture (whooshes, magnetic hum)
  function noise(t0, dur, peak, f0, f1, q) {
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = q || 1;
    bp.frequency.setValueAtTime(f0, t0);
    if (f1) bp.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + dur * 0.9);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + dur * 0.22);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(g).connect(master);
    src.start(t0); src.stop(t0 + dur + 0.02);
  }

  const pick = (i) => P[Math.max(0, Math.min(i, P.length - 1))];

  return {
    // stepper / generic click
    tick() { if (!ensure()) return; note(1180, ctx.currentTime, 0.05, "square", 0.08); },

    // screen change (nav)
    transition(up) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      note(up ? 380 : 560, t, 0.28, "sine", 0.13, up ? 720 : 300);
      noise(t, 0.26, 0.04, up ? 700 : 900, up ? 1400 : 500, 0.8);
    },

    // a unit square is placed on the board — soft pluck, pitch rises with the count
    place(i) {
      if (!ensure()) return;
      const t = ctx.currentTime, f = pick(i);
      note(f, t, 0.22, "triangle", 0.13);
      note(f * 2, t, 0.10, "sine", 0.04);
    },

    // a number "locks in" — a warm two-note confirm
    lock() {
      if (!ensure()) return;
      const t = ctx.currentTime;
      note(pick(2), t, 0.18, "sine", 0.13);
      note(pick(4), t + 0.10, 0.34, "triangle", 0.14);
      note(pick(4) * 2, t + 0.10, 0.16, "sine", 0.05);
    },

    // strips slide together into a row — airy descending swoosh
    arrange() {
      if (!ensure()) return;
      const t = ctx.currentTime;
      noise(t, 0.4, 0.09, 1500, 480, 0.8);
      note(520, t, 0.3, "sine", 0.06, 300);
    },

    // a grid row stamps down as the ×4 builds — soft thud + rising pitch
    stamp(r) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      note(pick(r), t, 0.16, "triangle", 0.12);
      note(96, t, 0.12, "sine", 0.09);
    },

    // board is duplicated — two quick blips
    duplicate() {
      if (!ensure()) return;
      const t = ctx.currentTime;
      note(pick(3), t, 0.09, "square", 0.08);
      note(pick(5), t + 0.11, 0.12, "square", 0.08);
      noise(t, 0.3, 0.04, 600, 1300, 0.7);
    },

    // a board slides in from off-screen — rising airy whoosh
    whoosh() {
      if (!ensure()) return;
      const t = ctx.currentTime;
      noise(t, 0.5, 0.10, 280, 1300, 0.7);
      note(240, t, 0.4, "sine", 0.05, 520);
    },

    // the copy separates into two rectangles — a magnetic pull-apart
    split() {
      if (!ensure()) return;
      const t = ctx.currentTime;
      note(420, t, 0.32, "sine", 0.09, 300);   // one voice glides down
      note(420, t, 0.32, "sine", 0.06, 560);   // the other glides up
      noise(t, 0.34, 0.05, 900, 400, 1.2);
    },

    // the merge / de-merge loop — a soft, FADED magnetic sound (not a beep)
    magnet(attract) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      const f0 = attract ? 140 : 220, f1 = attract ? 205 : 128;
      note(f0, t, 0.6, "sine", 0.07, f1);
      note(f0 * 2, t, 0.46, "triangle", 0.022, f1 * 2);
      noise(t, 0.52, 0.024, attract ? 520 : 900, attract ? 260 : 420, 1.3);
    },

    // a number ticker-scrolls into a variable — a quick zip
    morph() {
      if (!ensure()) return;
      const t = ctx.currentTime;
      noise(t, 0.24, 0.07, 500, 2200, 1.0);
      note(pick(3), t + 0.10, 0.18, "sine", 0.10, pick(6));
    },

    // final flourish (summary) — grows with the count
    finale(n) {
      if (!ensure()) return;
      const t = ctx.currentTime;
      const L = Math.min((n || 4) + 1, P.length - 1);
      for (let j = 0; j < L; j++) note(pick(j), t + j * 0.05, 0.34, "triangle", 0.12);
      const top = pick(L);
      note(top, t + L * 0.05, 0.6, "sine", 0.15);
      note(pick(0) / 2, t, 0.7, "sine", 0.09);
    },

    // a piece is picked up to drag — light, precise tick
    grab() {
      if (!ensure()) return;
      note(1400, ctx.currentTime, 0.06, "square", 0.07);
    },

    // a piece snaps into a valid slot — a satisfied little confirm
    snap(i) {
      if (!ensure()) return;
      const t = ctx.currentTime, f = pick(i || 2);
      note(f, t, 0.16, "triangle", 0.13);
      note(f * 1.5, t + 0.02, 0.12, "sine", 0.05);
    },

    // an invalid drop — piece eases back to where it came from (no harsh "wrong")
    bounceBack() {
      if (!ensure()) return;
      note(300, ctx.currentTime, 0.18, "sine", 0.05, 220);
    },

    // an educational overlay appears
    pop() {
      if (!ensure()) return;
      const t = ctx.currentTime;
      note(700, t, 0.14, "sine", 0.08, 980);
      note(1400, t + 0.05, 0.12, "sine", 0.04);
    },

    // an overlay is dismissed
    close() {
      if (!ensure()) return;
      note(520, ctx.currentTime, 0.14, "sine", 0.06, 340);
    },

    // kept for back-compat
    land(i) { this.place(i); }
  };
})();

