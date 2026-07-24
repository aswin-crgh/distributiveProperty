// Scene 4 — tap the completed rectangle to reveal its dimensions (2 and 2m+3).
// Overlay 1 foreshadows the HCF link, then "Reveal Area" morphs the value text
// to 2×(2m+3) with a brief row-pulse (the two rows are identical — "doubling").
// onNext → the 4-step algebraic walkthrough.
const SceneReveal = ({ onNext }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const LEFT = { x: 90, y: 150, w: 780, h: 760 };
  const RIGHT = { x: 1050, y: 150, w: 780, h: 760 };

  // static mismatched pile (LEFT reference board) — must match SceneDrag.js's
  // pileOx/pileOy exactly, so the frozen reference doesn't jump-shift on entry
  const pileOx = 262, pileOy = 296;
  const uPileOx = pileOx + MW + GAP2;
  const pileTiles = () => {
    const els = [];
    for (let i = 0; i < M_COEF; i++) els.push(React.createElement(Tile, { key: "m" + i, x: pileOx, y: pileOy + i * (U + GAP2), w: MW, h: U, kind: "amber", style: { zIndex: 3 } }));
    for (let i = 0; i < CONST; i++) els.push(React.createElement(Tile, { key: "u" + i, x: uPileOx + (i % 2) * (U + GAP2), y: pileOy + Math.floor(i / 2) * (U + GAP2), w: U, h: U, kind: "blue", style: { zIndex: 3 } }));
    return els;
  };

  // completed rectangle (RIGHT board) — 2 rows × [m,m,u,u,u]; matches exactly
  // where SceneDrag.js's overflow tiles land (dead-centre of the 780×760
  // board), so the rectangle is already sitting still the instant this scene mounts
  const rectOx = 84, rectOy = 296;
  const rowW = M_PER_ROW * MW + C_PER_ROW * U + (M_PER_ROW + C_PER_ROW - 1) * GAP2;
  const rowH = U;
  const gridH = HCF * U + (HCF - 1) * GAP2;

  const [sub, setSub] = useState("tapPrompt"); // tapPrompt | dimsIn | pulsing | overlay1 | revealBtn | revealing | revealed
  const [pulseRow, setPulseRow] = useState(-1);
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const tapRect = () => {
    if (sub !== "tapPrompt") return;
    setSub("dimsIn"); AudioKit.lock();
    // let the dimension labels finish fading in, THEN pulse the result 3 times,
    // THEN (and only then) let the foreshadow overlay interrupt — the reveal IS
    // the point, never lose it under an overlay mid-animation
    push(() => { setSub("pulsing"); AudioKit.land(2); }, 550);
    push(() => setSub("overlay1"), 550 + 2300);       // let the 3 slow, deliberate pulses fully register
  };
  const dismissOverlay1 = () => setSub("revealBtn");
  const revealArea = () => {
    if (sub !== "revealBtn") return;
    setSub("revealing"); AudioKit.arrange();
    push(() => { setPulseRow(0); AudioKit.stamp(1); }, 100);
    push(() => { setPulseRow(1); AudioKit.stamp(2); }, 600);
    push(() => { setPulseRow(-1); setSub("revealed"); }, 1150);
  };

  const showDims = sub !== "tapPrompt";
  const showValue2 = sub === "revealed";

  const els = [];

  // LEFT — static reference
  els.push(React.createElement("div", { key: "lf", className: "board-frame dim", style: { left: LEFT.x, top: LEFT.y, width: LEFT.w, height: LEFT.h } }));
  pileTiles().forEach((e) => els.push(React.cloneElement(e, { key: "L" + e.key, x: LEFT.x + e.props.x, y: LEFT.y + e.props.y })));
  els.push(React.createElement("div", {
    key: "lval", className: "value-readout", style: { left: LEFT.x + LEFT.w / 2 + "px", top: LEFT.y + 40 + "px", transform: "translateX(-50%)" }
  },
    React.createElement("span", null, ui.valueOnBoard),
    React.createElement("span", { style: { color: TERM_COLOR } }, M_COEF + " ", React.createElement("span", { className: "eq-var" }, "m")),
    React.createElement("span", null, " + "),
    React.createElement("span", { style: { color: UNIT_COLOR } }, String(CONST))
  ));

  // RIGHT — the rectangle
  els.push(React.createElement("div", {
    key: "rf", className: "board-frame" + (sub === "tapPrompt" ? " tappable highlight" : ""),
    style: { left: RIGHT.x, top: RIGHT.y, width: RIGHT.w, height: RIGHT.h }, onClick: sub === "tapPrompt" ? tapRect : undefined
  }));
  for (let r = 0; r < HCF; r++) {
    const ty = RIGHT.y + rectOy + r * (rowH + GAP2);
    let tx = RIGHT.x + rectOx;
    const pulsing = pulseRow === r;
    for (let c = 0; c < M_PER_ROW; c++) {
      els.push(React.createElement(Tile, { key: "rm" + r + "-" + c, x: tx, y: ty, w: MW, h: U, kind: "amber", style: { zIndex: 3, filter: pulsing ? "brightness(1.35)" : "none" } }));
      tx += MW + GAP2;
    }
    for (let c = 0; c < C_PER_ROW; c++) {
      els.push(React.createElement(Tile, { key: "ru" + r + "-" + c, x: tx, y: ty, w: U, h: U, kind: "blue", style: { zIndex: 3, filter: pulsing ? "brightness(1.35)" : "none" } }));
      tx += U + GAP2;
    }
  }
  if (showDims) {
    const pulseCls = sub === "pulsing" ? "pulse-3x" : "soft-in";
    const mBlockCx = RIGHT.x + rectOx + (M_PER_ROW * MW + (M_PER_ROW - 1) * GAP2) / 2;
    const uBlockCx = RIGHT.x + rectOx + M_PER_ROW * MW + (M_PER_ROW - 1) * GAP2 + GAP2 + (C_PER_ROW * U + (C_PER_ROW - 1) * GAP2) / 2;
    els.push(React.createElement("div", { key: "lm", className: "strip-label", style: { left: mBlockCx + "px", top: RIGHT.y + rectOy - 54 + "px", color: TERM_COLOR } },
      React.createElement("span", { className: pulseCls, style: { display: "inline-block" } }, React.createElement("span", { className: "dim-var" }, M_PER_ROW + "m"))));
    els.push(React.createElement("div", { key: "lc", className: "strip-label", style: { left: uBlockCx + "px", top: RIGHT.y + rectOy - 54 + "px", color: UNIT_COLOR } },
      React.createElement("span", { className: pulseCls, style: { display: "inline-block" } }, String(C_PER_ROW))));
    els.push(React.createElement("div", { key: "lh", className: "dim-label", style: { left: RIGHT.x + rectOx - 50 + "px", top: RIGHT.y + rectOy + gridH / 2 - 26 + "px" } },
      React.createElement("span", { className: pulseCls, style: { display: "inline-block" } }, String(HCF))));
  }

  // value readout — morphs once revealed
  const val2 = [React.createElement("span", { key: "l" }, ui.valueOnBoard)];
  if (showValue2) {
    val2.push(React.createElement("span", { key: "m" }, HCF + NB + "×" + NB + "(" + NB));
    val2.push(React.createElement("span", { key: "b", style: { color: TERM_COLOR } }, String(M_PER_ROW), React.createElement("span", { className: "eq-var" }, "m")));
    val2.push(React.createElement("span", { key: "p" }, NB + "+" + NB));
    val2.push(React.createElement("span", { key: "a", style: { color: UNIT_COLOR } }, String(C_PER_ROW)));
    val2.push(React.createElement("span", { key: "r" }, NB + ")"));
  } else {
    val2.push(React.createElement("span", { key: "b", style: { color: TERM_COLOR } }, M_COEF + " ", React.createElement("span", { className: "eq-var" }, "m")));
    val2.push(React.createElement("span", { key: "p" }, " + "));
    val2.push(React.createElement("span", { key: "a", style: { color: UNIT_COLOR } }, String(CONST)));
  }
  els.push(React.createElement("div", {
    key: "rval", className: "value-readout", style: { left: RIGHT.x + RIGHT.w / 2 + "px", top: RIGHT.y + 40 + "px", transform: "translateX(-50%)" }
  }, val2));

  // rectangle-sides caption once revealed
  if (showValue2) {
    els.push(React.createElement("div", {
      key: "rep", style: { position: "absolute", left: RIGHT.x + RIGHT.w / 2 + "px", top: RIGHT.y + rectOy + gridH + 60 + "px", transform: "translateX(-50%)", maxWidth: "700px" }
    },
      React.createElement("div", { className: "rep-bubble soft-in", style: { position: "static" }, dangerouslySetInnerHTML: { __html: ui.rectangleSidesText } })
    ));
  }
  if (sub === "revealBtn") {
    // wrapper handles the true horizontal centring (translateX) so soft-in's
    // transform:none endstate on the button never clobbers it
    els.push(React.createElement("div", {
      key: "revbtn", style: { position: "absolute", left: RIGHT.x + RIGHT.w / 2 + "px", top: RIGHT.y + rectOy + gridH + 50 + "px", transform: "translateX(-50%)" }
    },
      React.createElement("button", { className: "btn-action small soft-in", onClick: revealArea },
        React.createElement("span", null, ui.revealAreaBtn),
        React.createElement("img", { src: "./assets/gifs/fingerTap.gif", className: "finger-tap-gif" })
      )
    ));
  }

  const header = showValue2 ? ui.sameValueHeader : ui.dragHeader;
  const instr = sub === "tapPrompt" ? ui.revealInstruction : (sub === "revealBtn" ? ui.revealAreaInstruction : (showValue2 ? ui.algebraInstruction : ""));

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" }, els),
    sub === "overlay1" ? React.createElement(Overlay, { onDismiss: dismissOverlay1, width: 960 },
      React.createElement("div", { dangerouslySetInnerHTML: { __html: ui.overlay1Text } })
    ) : null,
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, header)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { style: { minWidth: "96px" } }),
      React.createElement("div", { className: "bottom-instruction" }, instr),
      React.createElement("div", { className: "bottom-next" },
        showValue2
          ? React.createElement("button", { className: "btn-nav soft-in", onClick: onNext }, React.createElement("span", null, ui.next))
          : React.createElement("div", { style: { minWidth: "96px" } })
      )
    )
  );
};
