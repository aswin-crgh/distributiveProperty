// Scene 5 — four taps walk 4m+6 to 2×(2m+3): identify coefficients/constants
// (4 and 6 highlighted) → the 4 and 6 fly up into HCF(4,6)=2 (→ pulse ×3 →
// Overlay 2 payoff) → rewrite as a sum of products (term-by-term, staggered) →
// factor out the HCF — BOTH "2"s arc-jump out and converge into the one leading
// factor. The tap target is the dashed, pulsing LIVE expression on the right —
// the left-side step list is a passive progress indicator only.
const SceneSteps = ({ onNext }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const STEP_LABELS = [ui.step1Label, ui.step2Label, ui.step3Label, ui.step4Label];
  const STEP_TEXTS = [ui.step1Text, ui.step2Text, ui.step3Text, ui.step4Text];
  const STEP_INSTR = [ui.step1Instruction, ui.step2Instruction, ui.step3Instruction, ui.step4Instruction];

  const [revealed, setRevealed] = useState(0);       // 0..4 steps done
  const [digitHi, setDigitHi] = useState(false);     // step1: pulse the 4/6 in the ghost
  const [hcfFly, setHcfFly] = useState(false);       // step2: the 4/6 flying up into HCF(...)
  const [hcfPulse, setHcfPulse] = useState(false);   // step2: pulse HCF line 3x before overlay2
  const [term3Phase, setTerm3Phase] = useState(0);   // 0=none,1=first term,2=both terms (only meaningful once revealed>=3)
  const [step4Fly, setStep4Fly] = useState(false);   // step4: both 2's arc-converging before settling
  const [overlay2, setOverlay2] = useState(false);
  const [busy, setBusy] = useState(false);           // true while a multi-beat reveal is mid-flight (not tappable)
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const canTap = revealed < 4 && !overlay2 && !busy;

  const tapNext = () => {
    if (!canTap) return;
    const n = revealed + 1;
    AudioKit.morph();
    setRevealed(n);
    if (n === 1) {
      setBusy(true); setDigitHi(false);
      push(() => { setDigitHi(true); }, 500);          // let the ghost fade in, then highlight 4 & 6
      push(() => { setDigitHi(false); setBusy(false); }, 500 + 2300); // slow, deliberate pulses — let them register
    }
    if (n === 2) {
      setBusy(true); setHcfFly(true); setHcfPulse(false);
      push(() => { setHcfFly(false); setHcfPulse(true); AudioKit.land(2); }, 650);  // digits land, then pulse
      push(() => { setHcfPulse(false); setOverlay2(true); setBusy(false); }, 650 + 2300); // slow, deliberate pulses — let them register
    }
    if (n === 3) {
      setBusy(true); setTerm3Phase(0);
      push(() => { setTerm3Phase(1); AudioKit.stamp(1); }, 120);          // "2 × 2m" appears first
      push(() => { setTerm3Phase(2); AudioKit.stamp(2); setBusy(false); }, 750); // pause, THEN "+ 2 × 3" appears
    }
    if (n === 4) {
      setBusy(true); setStep4Fly(true);
      push(() => { setStep4Fly(false); setBusy(false); AudioKit.lock(); }, 680); // both 2's converge, then settle
    }
  };
  const dismissOverlay2 = () => setOverlay2(false);

  // ---- left: the 4 step rows — passive progress indicator, wide + roomy ----
  const stepRows = [];
  for (let i = 0; i < 4; i++) {
    const filled = revealed > i;
    const active = revealed === i;
    stepRows.push(React.createElement("div", {
      key: "step" + i, className: "step-row" + (filled ? " filled" : "") + (active ? " active" : ""),
      style: { left: 90 + "px", top: (140 + i * 190) + "px", width: "1000px" }
    },
      React.createElement("div", { className: "step-num" }, STEP_LABELS[i]),
      React.createElement("div", {
        className: "step-body",
        dangerouslySetInnerHTML: { __html: filled || active ? STEP_TEXTS[i] : "" }
      })
    ));
  }

  // ---- right: HCF line, dim ghost, and the live morphing expression ----
  const els = [].concat(stepRows);
  const RX = 1505; // centre-x of the right-side algebra column

  // dim ghost reference "4m + 6" — appears once step 1 is done, persists.
  // the 4 and 6 highlight during step 1 (tying "identify coefficients and
  // constants" to the actual digits), then fly up into the HCF bracket in step 2.
  if (revealed >= 1) {
    const numCls = digitHi ? "pulse-3x" : "";
    // the coefficient/constant themselves stay fully visible here (that's the
    // whole point of "identify coefficients and constants") — only the
    // structural "m" / "+" around them is dimmed, never the 4 or 6
    els.push(React.createElement("div", {
      key: "ghost", className: "eq-wrap soft-in", style: { top: "300px", left: "1130px", width: "750px", position: "absolute" }
    },
      React.createElement("div", { className: "eq-side", style: { fontSize: "52px", background: "transparent" } },
        React.createElement("span", { style: { color: TERM_COLOR } },
          React.createElement("span", { className: numCls, style: { display: "inline-block" } }, String(M_COEF)),
          React.createElement("span", { style: { opacity: 0.34 } }, "m")),
        React.createElement("span", { style: { opacity: 0.34 } }, " + "),
        React.createElement("span", { className: numCls, style: { color: UNIT_COLOR, display: "inline-block" } }, String(CONST))
      )
    ));
  }

  // the two flying digits — approximate flight from the ghost's "4"/"6"
  // positions up into the HCF bracket's "4"/"6" slots (a curved arc-hop)
  if (hcfFly) {
    els.push(React.createElement("div", {
      key: "fly4", style: { position: "absolute", left: RX - 95 + "px", top: "195px", fontSize: "60px", fontWeight: 800, color: TERM_COLOR }
    }, React.createElement("span", { className: "arc-hop", style: { display: "inline-block", "--dx": "-45px", "--dy": "115px" } }, String(M_COEF))));
    els.push(React.createElement("div", {
      key: "fly6", style: { position: "absolute", left: RX + 5 + "px", top: "195px", fontSize: "60px", fontWeight: 800, color: UNIT_COLOR }
    }, React.createElement("span", { className: "arc-hop", style: { display: "inline-block", "--dx": "65px", "--dy": "115px" } }, String(CONST))));
  }

  // HCF(4,6) = 2 — appears once step 2 is done (its digits render invisible
  // while the flying clones are still en route, so nothing doubles up)
  if (revealed >= 2) {
    const hcfNumCls = hcfPulse ? "pulse-3x" : "";
    els.push(React.createElement("div", {
      key: "hcf", className: "info-bubble",
      style: { left: RX + "px", top: "180px", background: "transparent", boxShadow: "none", fontSize: "60px", fontWeight: 800, opacity: hcfFly ? 0 : 1, whiteSpace: "nowrap" }
    },
      React.createElement("span", { className: !hcfFly ? "soft-in" : "", style: { display: "inline-block" } },
        React.createElement("span", null, "HCF("),
        React.createElement("span", { className: hcfNumCls, style: { color: TERM_COLOR, display: "inline-block" } }, String(M_COEF)),
        React.createElement("span", null, ", "),
        React.createElement("span", { className: hcfNumCls, style: { color: UNIT_COLOR, display: "inline-block" } }, String(CONST)),
        React.createElement("span", null, ") = " + HCF)
      )
    ));
  }

  // the LIVE expression — morphs: "4m + 6" → "2×2m" (+pause) "+2×3" → "2(2m+3)"
  // it is ALSO the tap target for the next step (dashed pulsing box), matching
  // the deck exactly — never the left-side step list.
  let live;
  if (revealed < 3) {
    live = React.createElement("div", { className: "eq-side", style: { fontSize: "68px" } },
      React.createElement("span", { style: { color: TERM_COLOR } }, M_COEF + "m"),
      React.createElement("span", null, NB + "+" + NB),
      React.createElement("span", { style: { color: UNIT_COLOR } }, String(CONST))
    );
  } else if (revealed === 3) {
    const parts = [React.createElement("span", { key: "t1", className: "row-grow", style: { color: TERM_COLOR, display: "inline-flex" } }, HCF + NB + "×" + NB + M_PER_ROW + "m")];
    if (term3Phase >= 2) {
      parts.push(React.createElement("span", { key: "op" }, NB + "+" + NB));
      parts.push(React.createElement("span", { key: "t2", className: "row-grow", style: { color: UNIT_COLOR, display: "inline-flex" } }, HCF + NB + "×" + NB + C_PER_ROW));
    }
    live = React.createElement("div", { className: "eq-side", style: { fontSize: "68px" } }, parts);
  } else if (step4Fly) {
    // both "2"s visibly arc outward from their terms and converge into one —
    // the leading 2 is hidden until they land
    live = React.createElement("div", { className: "eq-side", style: { fontSize: "68px", position: "relative" } },
      React.createElement("span", { style: { opacity: 0 } }, String(HCF)),
      React.createElement("span", null, NB + "(" + NB),
      React.createElement("span", { style: { color: TERM_COLOR } }, M_PER_ROW + "m"),
      React.createElement("span", null, NB + "+" + NB),
      React.createElement("span", { style: { color: UNIT_COLOR } }, String(C_PER_ROW)),
      React.createElement("span", null, NB + ")"),
      React.createElement("span", { className: "arc-hop", style: { position: "absolute", left: "0px", top: "0px", "--dx": "10px", "--dy": "-55px" } }, String(HCF)),
      React.createElement("span", { className: "arc-hop", style: { position: "absolute", left: "0px", top: "0px", "--dx": "220px", "--dy": "-55px" } }, String(HCF))
    );
  } else {
    live = React.createElement("div", { className: "eq-side", style: { fontSize: "68px" } },
      React.createElement("span", null, String(HCF)),
      React.createElement("span", null, NB + "(" + NB),
      React.createElement("span", { style: { color: TERM_COLOR } }, M_PER_ROW + "m"),
      React.createElement("span", null, NB + "+" + NB),
      React.createElement("span", { style: { color: UNIT_COLOR } }, String(C_PER_ROW)),
      React.createElement("span", null, NB + ")")
    );
  }
  els.push(React.createElement("div", {
    key: "live", className: canTap ? "tap-target-wrap" : "", onClick: canTap ? tapNext : undefined,
    style: { position: "absolute", left: (RX - 375) + "px", top: "460px", width: "750px", display: "flex", justifyContent: "center" }
  },
    live,
    canTap ? React.createElement("img", { src: "./assets/gifs/fingerTap.gif", className: "finger-tap-gif", style: { position: "absolute", right: "-20px", bottom: "-30px" } }) : null
  ));

  const instr = overlay2 ? "" : (revealed < 4 ? STEP_INSTR[revealed] : ui.stepsDoneInstruction);

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" }, els),
    overlay2 ? React.createElement(Overlay, { onDismiss: dismissOverlay2 },
      React.createElement("div", { className: "overlay-mini-rect" },
        Rectangle({ x: 320, y: 60, u: 44, mw: 96, rows: HCF, mPerRow: M_PER_ROW, cPerRow: C_PER_ROW, gap: 5, labels: "full" })
      ),
      React.createElement("div", { dangerouslySetInnerHTML: { __html: ui.overlay2Text } })
    ) : null,
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, ui.stepsHeader)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { style: { minWidth: "96px" } }),
      React.createElement("div", { className: "bottom-instruction" }, instr),
      React.createElement("div", { className: "bottom-next" },
        revealed === 4
          ? React.createElement("button", { className: "btn-nav soft-in", onClick: onNext }, React.createElement("span", null, ui.next))
          : React.createElement("div", { style: { minWidth: "96px" } })
      )
    )
  );
};
