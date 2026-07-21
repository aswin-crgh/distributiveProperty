// Scene 4 — the arranged 3+5 row is multiplied ×4 into a grid, then duplicated.
// Starts already-arranged (matched coords from SceneBuild). onDone → rearrange.
const SceneMultiply = ({ onDone }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const BOARD = { x: 900, y: 150, w: 900, h: 720 };
  const arrLeft = BOARD_CX - ROW8_W / 2;

  const [sub, setSub] = useState("intro");   // intro | multBtn | building | grid | dupBtn | leaving
  const [rows, setRows] = useState(1);        // 1..MULT
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => {
    push(() => setSub("multBtn"), 1300);      // "The board has 3+5" hold, then offer ×4
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const doMultiply = () => {
    if (sub !== "multBtn") return;
    setSub("building"); AudioKit.stamp(1);
    for (let r = 2; r <= MULT; r++) {
      push(() => { setRows(r); AudioKit.stamp(r); }, (r - 1) * BEAT);
    }
    push(() => setSub("grid"), (MULT - 1) * BEAT + 200);
    push(() => setSub("dupBtn"), (MULT - 1) * BEAT + 1500);
  };

  const doDuplicate = () => {
    if (sub !== "dupBtn") return;
    setSub("leaving"); AudioKit.duplicate();
    push(() => onDone(), 900);
  };

  const gridBuilt = sub === "grid" || sub === "dupBtn" || sub === "leaving";
  const showGridRows = sub === "building" ? rows : (gridBuilt ? MULT : 1);

  const els = [];

  // board frame
  els.push(React.createElement("div", {
    key: "frame", className: "board-frame",
    style: { left: BOARD.x + "px", top: BOARD.y + "px", width: BOARD.w + "px", height: BOARD.h + "px" }
  }));

  // grid tiles
  for (let r = 0; r < showGridRows; r++) {
    for (let c = 0; c < 8; c++) {
      const kind = c < N1 ? "blue" : "amber";
      els.push(React.createElement(Tile, {
        key: "g" + r + "-" + c, x: arrLeft + c * PITCH, y: ARR_Y + r * PITCH, w: U, h: U, kind,
        className: (sub === "building" && r === rows - 1 && r > 0) ? "row-grow" : "",
        style: { zIndex: 4 }
      }));
    }
  }

  // dimension labels
  els.push(React.createElement("div", { key: "d3", className: "strip-label", style: { left: arrLeft + BLOCK3_W / 2 + "px", top: ARR_Y - 62 + "px", color: BLUE } }, String(N1)));
  els.push(React.createElement("div", { key: "d5", className: "strip-label", style: { left: arrLeft + N1 * PITCH + BLOCK5_W / 2 + "px", top: ARR_Y - 62 + "px", color: AMBER } }, String(N2)));
  if (showGridRows > 1) {
    const gh = showGridRows * U + (showGridRows - 1) * GAP;
    els.push(React.createElement("div", {
      key: "d4", className: "dim-label soft-in",
      style: { left: arrLeft - 56 + "px", top: ARR_Y + gh / 2 - 30 + "px" }
    }, String(MULT)));
  }

  // value readout (inside board top) — with the final numeric value at the right
  const eqResult = (v) => React.createElement("span", { key: "res", style: { color: "#fff", fontWeight: 800 } }, NB + "=" + NB + v);
  const val = [React.createElement("span", { key: "l" }, ui.valueOnBoard)];
  if (gridBuilt || sub === "building") {
    val.push(React.createElement("span", { key: "m" }, String(MULT) + NB + "×" + NB + "(" + NB));
    val.push(React.createElement("span", { key: "b", style: { color: BLUE } }, String(N1)));
    val.push(React.createElement("span", { key: "p" }, NB + "+" + NB));
    val.push(React.createElement("span", { key: "a", style: { color: AMBER } }, String(N2)));
    val.push(React.createElement("span", { key: "r" }, NB + ")"));
    val.push(eqResult(MULT * (N1 + N2)));
  } else {
    val.push(React.createElement("span", { key: "b", style: { color: BLUE } }, String(N1)));
    val.push(React.createElement("span", { key: "p" }, NB + "+" + NB));
    val.push(React.createElement("span", { key: "a", style: { color: AMBER } }, String(N2)));
    val.push(eqResult(N1 + N2));
  }
  els.push(React.createElement("div", {
    key: "val", className: "value-readout",
    style: { left: BOARD.x + BOARD.w / 2 + "px", top: BOARD.y + 40 + "px", transform: "translateX(-50%)" }
  }, val));

  // rep bubble once grid built
  if (gridBuilt) {
    els.push(React.createElement("div", {
      key: "rep", className: "rep-bubble soft-in",
      style: { left: 470 + "px", top: 820 + "px" },
      dangerouslySetInnerHTML: { __html: ui.rectangleIs }
    }));
  }

  // ---- left-side action (×4 then Duplicate) ----
  if (sub === "multBtn") {
    els.push(React.createElement("div", { key: "mcap", className: "action-caption soft-in", style: { position: "absolute", left: 130, top: 320, width: 600 }, dangerouslySetInnerHTML: { __html: ui.multiplyText } }));
    els.push(React.createElement("button", { key: "mbtn", className: "btn-action soft-in", style: { position: "absolute", left: 355, top: 540 }, onClick: doMultiply },
      React.createElement("span", null, ui.multiplyBtn),
      React.createElement("img", { src: "./assets/gifs/fingerTap.gif", className: "finger-tap-gif" })
    ));
  }
  if (sub === "dupBtn") {
    els.push(React.createElement("div", { key: "dcap", className: "action-caption soft-in", style: { position: "absolute", left: 130, top: 330, width: 600 }, dangerouslySetInnerHTML: { __html: ui.duplicateText } }));
    els.push(React.createElement("button", { key: "dbtn", className: "btn-action small soft-in", style: { position: "absolute", left: 320, top: 540 }, onClick: doDuplicate },
      React.createElement("span", null, ui.duplicateBtn),
      React.createElement("img", { src: "./assets/gifs/fingerTap.gif", className: "finger-tap-gif" })
    ));
  }

  const header = sub === "intro" ? ui.boardHas
    : (sub === "dupBtn" || sub === "leaving") ? ui.rearrangeHeader
    : ui.multiplyHeader;
  const instr = sub === "dupBtn" ? ui.duplicateInstruction : (sub === "multBtn" ? ui.multiplyInstruction : "");

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" }, els),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, header)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { className: "bottom-instruction" }, instr)
    )
  );
};
