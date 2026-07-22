// Scene 7 — tap the 3 or 5 → it ticker-scrolls into a variable x. The reveal is
// paced and anchored: the NUMBER drops from the expression (into BOTH visuals) and
// becomes a stacked-unit rectangle; then the VARIABLE drops and becomes a solid
// rectangle; then the ×4 duplication stacks both down. onNext → summary.
const SceneVariable = ({ onNext }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const [varOf, setVarOf] = useState(null);        // null | "blue" | "amber"
  const [numRows, setNumRows] = useState(0);       // rows shown for the NUMBER block
  const [varRows, setVarRows] = useState(0);       // rows shown for the VARIABLE block
  const [numGlyph, setNumGlyph] = useState("hidden"); // hidden | drop | fade
  const [varGlyph, setVarGlyph] = useState("hidden");
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const convert = (which) => {
    if (varOf) return;
    setVarOf(which); AudioKit.morph();
    // 1) the NUMBER drops from the expression, then becomes its (unit-square) rectangle
    setNumGlyph("drop");
    push(() => { setNumGlyph("fade"); setNumRows(1); AudioKit.place(1); }, 820);
    push(() => setNumGlyph("hidden"), 1320);
    // 2) then the VARIABLE drops, then becomes its (solid) rectangle
    push(() => { setVarGlyph("drop"); AudioKit.morph(); }, 1420);
    push(() => { setVarGlyph("fade"); setVarRows(1); AudioKit.place(2); }, 2240);
    push(() => setVarGlyph("hidden"), 2740);
    // 3) then the ×4 duplication stacks both blocks down
    for (let r = 2; r <= MULT; r++) push(() => { setNumRows(r); setVarRows(r); AudioKit.stamp(r); }, 2860 + (r - 2) * BEAT);
  };

  const uV = 64, pitchV = uV + GAP, xw = Math.round(XW * uV), SPLITV = 80;
  const b3 = N1 * uV + (N1 - 1) * GAP, b5 = N2 * uV + (N2 - 1) * GAP;

  const blueVar = varOf === "blue", amberVar = varOf === "amber";
  const blueW = blueVar ? xw : b3, amberW = amberVar ? xw : b5;

  // number vs variable identity (colour/value swap with which term was tapped)
  const numberVal = blueVar ? N2 : N1;
  const numberColor = blueVar ? AMBER : BLUE;
  const variableColor = blueVar ? BLUE : AMBER;

  // ---- equation (inline, so the converted term can ticker-scroll) ----
  const tick = (isVar, val) =>
    React.createElement("span", { className: "ticker" },
      React.createElement("span", { className: "ticker-inner", key: val },
        isVar ? React.createElement("span", { className: "eq-var" }, val) : val));
  const chip = (cls, isVar, val, tappable, onClick) =>
    React.createElement("span", { className: "eq-chip " + cls + (tappable ? " tappable" : ""), onClick: tappable ? onClick : undefined, key: cls },
      tick(isVar, val));
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
  const oy = 460;
  const centers = (cx, gap) => {
    const totW = blueW + gap + amberW, ox = cx - totW / 2;
    return { ox, blueX: ox, amberX: ox + blueW + gap };
  };

  const visual = (cx, oy, split, keyp) => {
    const out = [];
    const gap = split ? SPLITV : GAP;
    const { ox, blueX, amberX } = centers(cx, gap);
    const blueRows = blueVar ? varRows : numRows;
    const amberRows = amberVar ? varRows : numRows;
    const rowCls = (r) => r === 0 ? "diss-in" : "row-grow";
    for (let r = 0; r < blueRows; r++) {
      const y = oy + r * pitchV;
      if (blueVar) out.push(React.createElement(Tile, { key: keyp + "bx" + r, x: blueX, y, w: xw, h: uV, kind: "blue", className: rowCls(r), style: { zIndex: 3 } }));
      else for (let c = 0; c < N1; c++) out.push(React.createElement(Tile, { key: keyp + "b" + r + "-" + c, x: blueX + c * pitchV, y, w: uV, h: uV, kind: "blue", className: rowCls(r), style: { zIndex: 3 } }));
    }
    for (let r = 0; r < amberRows; r++) {
      const y = oy + r * pitchV;
      if (amberVar) out.push(React.createElement(Tile, { key: keyp + "ax" + r, x: amberX, y, w: xw, h: uV, kind: "amber", className: rowCls(r), style: { zIndex: 3 } }));
      else for (let c = 0; c < N2; c++) out.push(React.createElement(Tile, { key: keyp + "a" + r + "-" + c, x: amberX + c * pitchV, y, w: uV, h: uV, kind: "amber", className: rowCls(r), style: { zIndex: 3 } }));
    }
    // top labels (per block, once it has a row)
    const bl = blueVar ? React.createElement("span", { className: "dim-var" }, "x") : String(N1);
    const al = amberVar ? React.createElement("span", { className: "dim-var" }, "x") : String(N2);
    if (blueRows > 0) out.push(React.createElement("div", { key: keyp + "lb", className: "strip-label", style: { left: blueX + blueW / 2 + "px", top: oy - 50 + "px", color: BLUE, fontSize: "42px" } }, bl));
    if (amberRows > 0) out.push(React.createElement("div", { key: keyp + "la", className: "strip-label", style: { left: amberX + amberW / 2 + "px", top: oy - 50 + "px", color: AMBER, fontSize: "42px" } }, al));
    // the ×4 dimension appears once duplication starts (>1 row)
    const maxR = Math.max(blueRows, amberRows);
    if (maxR > 1) {
      const gh = maxR * uV + (maxR - 1) * GAP;
      out.push(React.createElement("div", { key: keyp + "l4", className: "dim-label", style: { left: ox - 46 + "px", top: oy + gh / 2 - 26 + "px", fontSize: "42px" } }, String(MULT)));
      if (split) out.push(React.createElement("div", {
        key: keyp + "l4b", className: "dim-label arc-hop",
        style: { left: amberX - 46 + "px", top: oy + gh / 2 - 26 + "px", fontSize: "42px", "--dx": (-(blueW + SPLITV)) + "px", "--dy": "0px" }
      }, String(MULT)));
    }
    return out;
  };

  const els = [React.createElement("div", { key: "eq", style: { position: "absolute", left: 0, top: 0, width: "100%" } }, eq)];
  if (varOf) {
    visual(560, oy, false, "m").forEach(e => els.push(e));
    visual(1360, oy, true, "s").forEach(e => els.push(e));
  }

  // ---- anchoring glyphs: drop from the expression into BOTH visuals ----
  const row1cy = oy + uV / 2;
  const glyphAt = (key, cx, color, isVar, val, cls) =>
    React.createElement("div", {
      key, style: { position: "absolute", left: cx + "px", top: row1cy + "px", transform: "translate(-50%, -50%)", zIndex: 6, pointerEvents: "none" }
    }, React.createElement("div", {
      className: cls,
      style: { fontSize: "112px", fontWeight: "bold", lineHeight: 1, color, textShadow: "0 6px 18px rgba(0,0,0,0.5)" }
    }, isVar ? React.createElement("span", { className: "eq-var" }, "x") : val));

  if (varOf && numGlyph !== "hidden") {
    const cls = numGlyph === "fade" ? "diss-out" : "expr-drop";
    [["mL", 560, GAP], ["sR", 1360, SPLITV]].forEach(([k, cx, gap]) => {
      const { blueX, amberX } = centers(cx, gap);
      const numberCx = blueVar ? (amberX + amberW / 2) : (blueX + blueW / 2);
      els.push(glyphAt("gn" + k, numberCx, numberColor, false, String(numberVal), cls));
    });
  }
  if (varOf && varGlyph !== "hidden") {
    const cls = varGlyph === "fade" ? "diss-out" : "expr-drop";
    [["mL", 560, GAP], ["sR", 1360, SPLITV]].forEach(([k, cx, gap]) => {
      const { blueX, amberX } = centers(cx, gap);
      const variableCx = blueVar ? (blueX + blueW / 2) : (amberX + amberW / 2);
      els.push(glyphAt("gv" + k, variableCx, variableColor, true, "x", cls));
    });
  }

  const ready = varOf && numRows >= MULT && varRows >= MULT;
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
