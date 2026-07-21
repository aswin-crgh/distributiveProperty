// Scene 7 — tap the 3 or 5 in the brackets → it ticker-scrolls into a variable x.
// The matching block becomes an x-rectangle (height 1, width 2<w<3) and both sides
// rebuild row by row. onNext → summary.
const SceneVariable = ({ onNext }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const [varOf, setVarOf] = useState(null);   // null | "blue" | "amber"
  const [rows, setRows] = useState(0);
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const convert = (which) => {
    if (varOf) return;
    setVarOf(which); AudioKit.morph();
    for (let r = 1; r <= MULT; r++) push(() => { setRows(r); AudioKit.stamp(r); }, 500 + (r - 1) * BEAT);
  };

  const uV = 64, pitchV = uV + GAP, xw = Math.round(XW * uV), SPLITV = 80;
  const b3 = N1 * uV + (N1 - 1) * GAP, b5 = N2 * uV + (N2 - 1) * GAP;

  const blueVar = varOf === "blue", amberVar = varOf === "amber";

  // ---- equation (inline, so the converted term can ticker-scroll) ----
  const tick = (isVar, val) =>
    React.createElement("span", { className: "ticker" },
      React.createElement("span", { className: "ticker-inner", key: val },
        isVar ? React.createElement("span", { className: "eq-var" }, val) : val));
  // single-term chip (left, inside brackets) — tappable to convert
  const chip = (cls, isVar, val, tappable, onClick) =>
    React.createElement("span", { className: "eq-chip " + cls + (tappable ? " tappable" : ""), onClick: tappable ? onClick : undefined, key: cls },
      tick(isVar, val));
  // whole-product chip (right side) — mult × term, all inside the colour box
  const prod = (cls, isVar, val) =>
    React.createElement("span", { className: "eq-chip " + cls, key: cls + "p" },
      React.createElement("span", null, MULT + NB + "×" + NB), tick(isVar, val));

  const t1 = blueVar ? { isVar: true, val: "x" } : { isVar: false, val: String(N1) };
  const t2 = amberVar ? { isVar: true, val: "x" } : { isVar: false, val: String(N2) };

  const eq = React.createElement("div", { className: "eq-wrap", style: { top: 118 } },
    React.createElement("div", { className: "eq-side" },
      React.createElement("span", null, MULT + NB + "×" + NB + "(" + NB),
      chip("blue", t1.isVar, t1.val, !varOf, () => convert("blue")),
      React.createElement("span", null, NB + "+" + NB),
      chip("amber", t2.isVar, t2.val, !varOf, () => convert("amber")),
      React.createElement("span", null, NB + ")")),
    React.createElement("span", { className: "eq-eq" }, "="),
    React.createElement("div", { className: "eq-side" },
      prod("blue", t1.isVar, t1.val),
      React.createElement("span", null, NB + "+" + NB),
      prod("amber", t2.isVar, t2.val)));

  // ---- the two visuals (merged + split), built row by row ----
  const blueW = blueVar ? xw : b3, amberW = amberVar ? xw : b5;

  const visual = (cx, oy, split, keyp) => {
    const out = [];
    const gap = split ? SPLITV : GAP;
    const totW = blueW + gap + amberW;
    const ox = cx - totW / 2;
    const blueX = ox, amberX = ox + blueW + gap;
    for (let r = 0; r < rows; r++) {
      const y = oy + r * (uV + GAP);
      if (blueVar) out.push(React.createElement(Tile, { key: keyp + "bx" + r, x: blueX, y, w: xw, h: uV, kind: "blue", className: "row-grow", style: { zIndex: 3 } }));
      else for (let c = 0; c < N1; c++) out.push(React.createElement(Tile, { key: keyp + "b" + r + "-" + c, x: blueX + c * pitchV, y, w: uV, h: uV, kind: "blue", className: "row-grow", style: { zIndex: 3 } }));
      if (amberVar) out.push(React.createElement(Tile, { key: keyp + "ax" + r, x: amberX, y, w: xw, h: uV, kind: "amber", className: "row-grow", style: { zIndex: 3 } }));
      else for (let c = 0; c < N2; c++) out.push(React.createElement(Tile, { key: keyp + "a" + r + "-" + c, x: amberX + c * pitchV, y, w: uV, h: uV, kind: "amber", className: "row-grow", style: { zIndex: 3 } }));
    }
    if (rows > 0) {
      // top labels
      const bl = blueVar ? React.createElement("span", { className: "dim-var" }, "x") : String(N1);
      const al = amberVar ? React.createElement("span", { className: "dim-var" }, "x") : String(N2);
      out.push(React.createElement("div", { key: keyp + "lb", className: "strip-label", style: { left: blueX + blueW / 2 + "px", top: oy - 50 + "px", color: BLUE, fontSize: "42px" } }, bl));
      out.push(React.createElement("div", { key: keyp + "la", className: "strip-label", style: { left: amberX + amberW / 2 + "px", top: oy - 50 + "px", color: AMBER, fontSize: "42px" } }, al));
      const gh = rows * uV + (rows - 1) * GAP;
      out.push(React.createElement("div", { key: keyp + "l4", className: "dim-label", style: { left: ox - 46 + "px", top: oy + gh / 2 - 26 + "px", fontSize: "42px" } }, String(MULT)));
      // split visual has a 4 for each rectangle
      if (split) out.push(React.createElement("div", {
        key: keyp + "l4b", className: "dim-label arc-hop",
        style: { left: amberX - 46 + "px", top: oy + gh / 2 - 26 + "px", fontSize: "42px", "--dx": (-(blueW + SPLITV)) + "px", "--dy": "0px" }
      }, String(MULT)));
    }
    return out;
  };

  const els = [React.createElement("div", { key: "eq", style: { position: "absolute", left: 0, top: 0, width: "100%" } }, eq)];
  if (varOf) {
    visual(560, 460, false, "m").forEach(e => els.push(e));
    visual(1360, 460, true, "s").forEach(e => els.push(e));
  }

  const ready = varOf && rows >= MULT;
  const instr = varOf ? (ready ? ui.concludeInstruction : "") : ui.variableInstruction;

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" }, els),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, ui.sameValueHeader)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { style: { minWidth: "96px" } }),
      React.createElement("div", { className: "bottom-instruction" }, instr),
      React.createElement("div", { className: "bottom-next" },
        ready
          ? React.createElement("button", { className: "btn-nav soft-in", onClick: () => onNext(varOf) }, React.createElement("span", null, ui.next))
          : React.createElement("div", { style: { minWidth: "96px" } })
      )
    )
  );
};
