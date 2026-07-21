// Scenes 2-3 — build "3" (blue) then "5" (amber) by tapping unit squares. The
// square you tap is the one that flies to the board. Then tap the board to arrange
// the 3+5 into a neat row. onDone → multiply.
const SceneBuild = ({ onDone }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  // scattered pool of unit squares (left side); index = identity
  const POOL = [
    [120, 300, -6], [300, 220, 5], [470, 300, -4], [180, 470, 7],
    [360, 440, -8], [545, 460, 4], [120, 655, -5], [330, 630, 6],
    [505, 650, -7], [250, 800, 3], [455, 800, -5]
  ];

  const BOARD = { x: 900, y: 150, w: 900, h: 720 };
  const STRIP3_Y = 372, STRIP5_Y = 600;

  const [blue, setBlue] = useState(0);
  const [amber, setAmber] = useState(0);
  const [used, setUsed] = useState([]);        // pool indices consumed (in tap order)
  const [sub, setSub] = useState("build3");    // build3 | rep3 | build5 | rep5 | arrangePrompt | arranging | done
  const [fly, setFly] = useState(null);        // {kind,i,fromX,fromY} — tile currently flying in
  const [flyIn, setFlyIn] = useState(false);
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const buildingBlue = sub === "build3";
  const buildingAmber = sub === "build5";
  const arranged = sub === "arranging" || sub === "done";

  const rowLeft = (n) => BOARD_CX - (n * U + (n - 1) * GAP) / 2;
  const arrLeft = BOARD_CX - ROW8_W / 2;
  const bluePos = (i) => arranged ? { x: arrLeft + i * PITCH, y: ARR_Y }
    : { x: rowLeft(sub === "build3" ? blue : N1) + i * PITCH, y: STRIP3_Y };
  const amberPos = (i) => arranged ? { x: arrLeft + (N1 + i) * PITCH, y: ARR_Y }
    : { x: rowLeft(sub === "build5" ? amber : N2) + i * PITCH, y: STRIP5_Y };

  // ---- place the tapped square ----
  const place = (idx) => {
    if (!(buildingBlue || buildingAmber)) return;
    if (used.indexOf(idx) >= 0) return;
    const kind = buildingBlue ? "blue" : "amber";
    const i = buildingBlue ? blue : amber;
    setUsed((u) => u.concat([idx]));
    setFly({ kind, i, fromX: POOL[idx][0], fromY: POOL[idx][1] });
    setFlyIn(false);
    push(() => setFlyIn(true), 30);
    push(() => setFly(null), 640);
    if (buildingBlue) {
      const nv = blue + 1; setBlue(nv); AudioKit.place(nv - 1);
      if (nv >= N1) lock3();
    } else {
      const nv = amber + 1; setAmber(nv); AudioKit.place(N1 + nv - 1);
      if (nv >= N2) lock5();
    }
  };

  const lock3 = () => {
    push(() => { setSub("rep3"); AudioKit.lock(); }, 480);
    push(() => setSub("build5"), 2500);
  };
  const lock5 = () => {
    push(() => { setSub("rep5"); AudioKit.lock(); }, 480);
    push(() => setSub("arrangePrompt"), 2500);
  };
  const arrangeBoard = () => {
    if (sub !== "arrangePrompt") return;
    setSub("arranging"); AudioKit.arrange();
    push(() => setSub("done"), 700);
    push(() => onDone(), 1900);
  };

  // ---- value readout spans ----
  const valSpans = () => {
    const p = [React.createElement("span", { key: "l" }, ui.valueOnBoard)];
    if (sub === "build3") {   // building the 3 — show only the blue count
      p.push(React.createElement("span", { key: "b", style: { color: blue ? BLUE : "#dfe7dd" } }, String(blue)));
      return p;
    }
    // the 3 is locked (rep3 shows just "3"; the amber term only once we start building it)
    p.push(React.createElement("span", { key: "b", style: { color: BLUE } }, String(N1)));
    const showAmber = ["build5", "rep5", "arrangePrompt", "arranging", "done"].indexOf(sub) >= 0;
    if (showAmber) {
      p.push(React.createElement("span", { key: "pp", style: { color: "#dfe7dd" } }, NB + "+" + NB));
      p.push(React.createElement("span", { key: "a", style: { color: AMBER } }, String(sub === "build5" ? amber : N2)));
    }
    return p;
  };

  const els = [];

  // board frame
  els.push(React.createElement("div", {
    key: "frame",
    className: "board-frame" + (sub === "arrangePrompt" ? " tappable highlight" : ""),
    style: { left: BOARD.x + "px", top: BOARD.y + "px", width: BOARD.w + "px", height: BOARD.h + "px" },
    onClick: sub === "arrangePrompt" ? arrangeBoard : undefined
  }));

  // goal instruction (amber cadence) — hidden once arranged
  if (!arranged) {
    const main = (buildingBlue || sub === "rep3") ? ui.goalMain3 : ui.goalMain5;
    els.push(React.createElement("div", {
      key: "goal", className: "goal-bubble",
      style: { left: BOARD.x + BOARD.w / 2 + "px", top: BOARD.y + 30 + "px", width: "780px" }
    },
      React.createElement("div", { className: "goal-main" }, main),
      React.createElement("div", { className: "goal-sub" }, ui.goalSub)
    ));
  }

  // pool squares
  if (buildingBlue || buildingAmber) {
    const avail = POOL.map((_, i) => i).filter((i) => used.indexOf(i) < 0);
    avail.forEach((idx) => {
      const [px, py, rot] = POOL[idx];
      els.push(React.createElement(Tile, {
        key: "pool" + idx, x: px, y: py, w: POOL_U, h: POOL_U, kind: buildingBlue ? "blue" : "amber",
        className: "pool-tile", style: { transform: `rotate(${rot}deg)`, zIndex: 3 },
        onClick: () => place(idx)
      }));
    });
    // one gentle finger nudge on the first available square
    if (avail.length) {
      const [hx, hy] = POOL[avail[0]];
      els.push(React.createElement("img", {
        key: "hint", src: "./assets/gifs/fingerTap.gif", className: "finger-hint",
        style: { left: hx + POOL_U - 30 + "px", top: hy + POOL_U - 26 + "px" }
      }));
    }
  }

  // drop-zone indicator (next slot) while building and ≥1 placed
  if ((buildingBlue && blue > 0 && blue < N1) || (buildingAmber && amber > 0 && amber < N2)) {
    const n = buildingBlue ? blue : amber;
    els.push(React.createElement("div", {
      key: "dz", className: "dropzone hot",
      style: { left: rowLeft(n + 1) + n * PITCH + "px", top: (buildingBlue ? STRIP3_Y : STRIP5_Y) + "px", width: U + "px", height: U + "px" }
    }));
  }

  // helper: render a tile that may be the flying one
  const renderTile = (key, kind, i, pos) => {
    const isFly = fly && fly.kind === kind && fly.i === i;
    if (isFly && !flyIn) {
      return React.createElement(Tile, { key, x: fly.fromX, y: fly.fromY, w: POOL_U, h: POOL_U, kind, style: { zIndex: 5 } });
    }
    return React.createElement(Tile, { key, x: pos.x, y: pos.y, w: U, h: U, kind, style: { zIndex: 4 } });
  };

  // blue tiles
  const blueShown = sub === "build3" ? blue : N1;
  for (let i = 0; i < blueShown; i++) els.push(renderTile("blue" + i, "blue", i, bluePos(i)));
  // amber tiles
  const amberShown = (sub === "build5") ? amber
    : (["rep5", "arrangePrompt", "arranging", "done"].indexOf(sub) >= 0 ? N2 : 0);
  for (let i = 0; i < amberShown; i++) els.push(renderTile("amber" + i, "amber", i, amberPos(i)));

  // strip labels
  const showLbl3 = ["rep3", "build5", "rep5", "arrangePrompt"].indexOf(sub) >= 0;
  if (showLbl3) els.push(React.createElement("div", { key: "lbl3", className: "strip-label soft-in", style: { left: rowLeft(N1) + BLOCK3_W / 2 + "px", top: STRIP3_Y - 62 + "px", color: BLUE } }, String(N1)));
  if (sub === "rep5" || sub === "arrangePrompt") els.push(React.createElement("div", { key: "lbl5", className: "strip-label soft-in", style: { left: rowLeft(N2) + BLOCK5_W / 2 + "px", top: STRIP5_Y - 62 + "px", color: AMBER } }, String(N2)));
  if (arranged) {
    els.push(React.createElement("div", { key: "albl3", className: "strip-label", style: { left: arrLeft + BLOCK3_W / 2 + "px", top: ARR_Y - 62 + "px", color: BLUE } }, String(N1)));
    els.push(React.createElement("div", { key: "albl5", className: "strip-label", style: { left: arrLeft + N1 * PITCH + BLOCK5_W / 2 + "px", top: ARR_Y - 62 + "px", color: AMBER } }, String(N2)));
  }

  // "This rectangle represents N" bubble
  if (sub === "rep3" || sub === "rep5") {
    els.push(React.createElement("div", {
      key: "rep", className: "rep-bubble soft-in",
      style: { left: BOARD.x + 250 + "px", top: (sub === "rep3" ? STRIP3_Y : STRIP5_Y) - 6 + "px" },
      dangerouslySetInnerHTML: { __html: sub === "rep3" ? ui.represents3 : ui.represents5 }
    }));
  }

  // value readout — bottom-centre of the board while building; board-top once arranged
  els.push(React.createElement("div", {
    key: "val", className: "value-readout",
    style: arranged
      ? { left: BOARD.x + BOARD.w / 2 + "px", top: BOARD.y + 40 + "px", transform: "translateX(-50%)" }
      : { left: BOARD.x + BOARD.w / 2 + "px", top: BOARD.y + BOARD.h - 98 + "px", transform: "translateX(-50%)" }
  }, valSpans()));

  const header = (buildingBlue || sub === "rep3") ? ui.buildHeader1 : arranged ? ui.boardHas : ui.buildHeader2;
  const instr = sub === "arrangePrompt" ? ui.arrangeInstruction : ui.buildInstruction;

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" }, els),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, header)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { className: "bottom-instruction" }, instr)
    )
  );
};
