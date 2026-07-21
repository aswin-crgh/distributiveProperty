// Scene 6 — the equation 4×(3+5) = 4×3+4×5, with the visual looping between the
// merged grid and the de-merged pair. Then the rule: PRODUCT of a SUM = SUM of a PRODUCT.
const SceneEquation = ({ onNext }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const [sub, setSub] = useState("loop");     // loop | rule
  const [merged, setMerged] = useState(true);
  const [showRight, setShowRight] = useState(false);
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    push(() => { setShowRight(true); AudioKit.transition(true); }, 900);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (sub !== "loop") return;
    let alive = true, cur = true;   // starts merged
    const tick = () => {
      if (!alive) return;
      cur = !cur; setMerged(cur); AudioKit.magnet(cur);   // faded magnetic, not a beep
      timers.current.push(setTimeout(tick, LOOP_HOLD));
    };
    timers.current.push(setTimeout(tick, LOOP_HOLD + 400));
    return () => { alive = false; };
  }, [sub]);

  const uM = 72, pitchM = uM + GAP, SPLITM = 90;
  const gridW = 8 * uM + 7 * GAP, gridH = 4 * uM + 3 * GAP;
  const b3 = N1 * uM + (N1 - 1) * GAP, b5 = N2 * uM + (N2 - 1) * GAP;

  const bigGrid = (cx, oy, split, scale, dim) => {
    const out = [];
    const totW = gridW + (split ? SPLITM : 0);
    const ox = cx - totW / 2;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
      const kind = c < N1 ? "blue" : "amber";
      const dx = (c >= N1 && split) ? SPLITM : 0;
      out.push(React.createElement(Tile, {
        key: "t" + r + "-" + c, x: ox + c * pitchM + dx, y: oy + r * pitchM, w: uM, h: uM, kind,
        style: { zIndex: 3, opacity: dim ? 0.5 : 1 }
      }));
    }
    const col = dim ? "rgba(210,225,240,0.5)" : null;
    out.push(React.createElement("div", { key: "d3", className: "strip-label", style: { left: ox + b3 / 2 + "px", top: oy - 52 + "px", color: col || BLUE } }, String(N1)));
    out.push(React.createElement("div", { key: "d5", className: "strip-label", style: { left: ox + N1 * pitchM + (split ? SPLITM : 0) + b5 / 2 + "px", top: oy - 52 + "px", color: col || AMBER } }, String(N2)));
    out.push(React.createElement("div", { key: "d4", className: "dim-label", style: { left: ox - 50 + "px", top: oy + gridH / 2 - 30 + "px", color: col || INK } }, String(MULT)));
    if (split) out.push(React.createElement("div", { key: "d4b", className: "dim-label", style: { left: ox + N1 * pitchM + SPLITM - 50 + "px", top: oy + gridH / 2 - 30 + "px", color: col || INK } }, String(MULT)));
    return out;
  };

  const els = [];

  // equation
  els.push(React.createElement("div", { key: "eq", style: { position: "absolute", left: 0, top: 118, width: "100%" } },
    React.createElement(Equation, {
      mult: String(MULT),
      t1: { val: String(N1), cls: "blue" },
      t2: { val: String(N2), cls: "amber" },
      op: "+", showRight: showRight || sub === "rule",
      // during the loop, highlight the side whose form is on screen (merged→left, split→right)
      leftDim: sub === "loop" && !merged,
      rightDim: sub === "loop" && merged
    })
  ));

  if (sub === "loop") {
    bigGrid(960, 420, !merged, 1, false).forEach(e => els.push(e));
    els.push(React.createElement("div", {
      key: "hero", className: "info-bubble hero",
      style: { left: 960 + "px", top: 800 + "px", maxWidth: "980px" },
      dangerouslySetInnerHTML: { __html: ui.distributiveBubble }
    }));
  } else {
    // rule: both forms side by side, dimmed
    bigGrid(560, 430, false, 1, true).forEach(e => els.push(React.cloneElement(e, { key: "m" + e.key })));
    bigGrid(1360, 430, true, 1, true).forEach(e => els.push(React.cloneElement(e, { key: "s" + e.key })));
    els.push(React.createElement("div", {
      key: "rule", className: "info-bubble hero",
      style: { left: 960 + "px", top: 812 + "px", fontSize: "54px", letterSpacing: "0.5px", whiteSpace: "nowrap" }
    }, ui.ruleBubble));
  }

  const header = sub === "rule" ? ui.ruleHeader : ui.sameValueHeader;
  const instr = sub === "rule" ? ui.algebraInstruction : ui.summariseInstruction;
  const onNextTap = () => {
    if (sub === "loop") { setSub("rule"); AudioKit.transition(true); }
    else { onNext(); }
  };

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" }, els),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, header)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { style: { minWidth: "96px" } }),
      React.createElement("div", { className: "bottom-instruction" }, instr),
      React.createElement("div", { className: "bottom-next" },
        React.createElement("button", { className: "btn-nav", onClick: onNextTap }, React.createElement("span", null, ui.next))
      )
    )
  );
};
