// Scene 2 — a scattered pool of 4 "m" tiles + 6 unit squares, living INSIDE the
// board from the start. Tapping "Rearrange neatly" settles them (staggered, one
// after another) into a tidy-but-NOT-rectangular shape (a 4-tall column of m
// flush beside a 3-tall grid of units — mismatched heights sets up Scene 3).
// Then "Duplicate" hands off to Scene 3. onDone → drag scene.
const SceneScatter = ({ onDone }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const BOARD = { x: 90, y: 150, w: 1740, h: 760 };

  // scattered pool positions (x, y, rotation) — fixed, hand-placed, non-overlapping,
  // all inside the board's bounds
  const POOL_M = [
    [220, 260, -6], [520, 220, 5], [340, 460, 6], [640, 500, -5]
  ];
  const POOL_U_POS = [
    [180, 560, -8], [400, 610, 5], [780, 260, -4], [860, 460, 7], [700, 610, -6], [980, 340, 4]
  ];

  // arranged (mismatched) layout: m-column (1 wide, 4 tall) flush beside a 2x3
  // unit grid — same GAP2 between the two groups, no extra daylight
  const mColX = BOARD.x + 700, mColY = BOARD.y + 120;
  const uGridX = mColX + MW + GAP2, uGridY = mColY;

  const [sub, setSub] = useState("scatter"); // scatter | arranging | arranged | dupBtn | leaving
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const rearrange = () => {
    if (sub !== "scatter") return;
    setSub("arranging"); AudioKit.arrange();
    // staggered per-tile landing chimes echo the staggered visual settle
    for (let i = 0; i < M_COEF; i++) push(() => AudioKit.place(i), 120 + i * 90);
    for (let i = 0; i < CONST; i++) push(() => AudioKit.place(M_COEF + i), 120 + M_COEF * 90 + i * 60);
    push(() => { setSub("arranged"); AudioKit.lock(); }, 120 + M_COEF * 90 + CONST * 60 + 200);
    push(() => setSub("dupBtn"), 120 + M_COEF * 90 + CONST * 60 + 900);
  };
  const duplicate = () => {
    if (sub !== "dupBtn") return;
    setSub("leaving"); AudioKit.duplicate();
    push(() => onDone(), 700);
  };

  const arranged = sub !== "scatter";

  const mPos = (i) => arranged ? { x: mColX, y: mColY + i * (U + GAP2), rot: 0 } : { x: POOL_M[i][0], y: POOL_M[i][1], rot: POOL_M[i][2] };
  const uPos = (i) => {
    if (!arranged) return { x: POOL_U_POS[i][0], y: POOL_U_POS[i][1], rot: POOL_U_POS[i][2] };
    const r = Math.floor(i / 2), c = i % 2;
    return { x: uGridX + c * (U + GAP2), y: uGridY + r * (U + GAP2), rot: 0 };
  };

  const els = [];
  els.push(React.createElement("div", {
    key: "frame", className: "board-frame",
    style: { left: BOARD.x + "px", top: BOARD.y + "px", width: BOARD.w + "px", height: BOARD.h + "px" }
  }));

  // legend (top-right of the board — a caption, not part of the manipulative;
  // kept clear of the scattered pool, which lives in the board's left/centre)
  els.push(React.createElement("div", { key: "legend", className: "legend-box", style: { left: BOARD.x + BOARD.w - 210 + "px", top: 165 + "px" } },
    React.createElement("div", { className: "legend-row" },
      React.createElement(Tile, { x: 0, y: 0, w: 60, h: 60, kind: "blue", style: { position: "static" } }),
      React.createElement("span", { className: "legend-eq" }, "="),
      React.createElement("span", { className: "legend-label" }, React.createElement("span", { className: "unit" }, ui.legendUnit))
    ),
    React.createElement("div", { className: "legend-row" },
      React.createElement(Tile, { x: 0, y: 0, w: 96, h: 48, kind: "amber", style: { position: "static" } }),
      React.createElement("span", { className: "legend-eq" }, "="),
      React.createElement("span", { className: "legend-label" },
        React.createElement("span", { className: "varname" }, "m"))
    )
  ));

  // m tiles — staggered transition-delay on settle so they land one after another
  for (let i = 0; i < M_COEF; i++) {
    const p = mPos(i);
    const delay = sub === "arranging" ? (i * 90) + "ms" : "0ms";
    els.push(React.createElement(Tile, {
      key: "m" + i, x: p.x, y: p.y, w: MW, h: U, kind: "amber",
      className: !arranged ? "pool-tile" : "",
      style: { zIndex: 3, transform: `rotate(${p.rot}deg)`, transitionDelay: delay }
    }));
  }
  // unit tiles — staggered after the m tiles finish landing
  for (let i = 0; i < CONST; i++) {
    const p = uPos(i);
    const delay = sub === "arranging" ? (M_COEF * 90 + i * 60) + "ms" : "0ms";
    els.push(React.createElement(Tile, {
      key: "u" + i, x: p.x, y: p.y, w: U, h: U, kind: "blue",
      className: !arranged ? "pool-tile" : "",
      style: { zIndex: 3, transform: `rotate(${p.rot}deg)`, transitionDelay: delay }
    }));
  }

  // value readout — appears once settled
  if (sub === "arranged" || sub === "dupBtn" || sub === "leaving") {
    els.push(React.createElement("div", {
      key: "val", style: { position: "absolute", left: mColX + (uGridX + 2 * U + GAP2 - mColX) / 2 + "px", top: mColY - 90 + "px", transform: "translateX(-50%)" }
    },
      React.createElement("div", { className: "value-readout soft-in", style: { position: "static" } },
        React.createElement("span", null, ui.valueOnBoard),
        React.createElement("span", { style: { color: TERM_COLOR } }, M_COEF + " ", React.createElement("span", { className: "eq-var" }, "m")),
        React.createElement("span", null, " + "),
        React.createElement("span", { style: { color: UNIT_COLOR } }, String(CONST))
      )
    ));
  }

  // action button — properly centered (wrapper handles translateX so soft-in
  // never clobbers it) and kept fully WITHIN the board with real margin
  const centered = (key, top, child) => React.createElement("div", {
    key, style: { position: "absolute", left: BOARD.x + BOARD.w / 2 + "px", top: top + "px", transform: "translateX(-50%)" }
  }, child);

  if (sub === "scatter") {
    els.push(centered("rbtn", BOARD.y + BOARD.h - 160,
      React.createElement("button", { className: "btn-action soft-in", onClick: rearrange },
        React.createElement("span", null, ui.rearrangeBtn),
        React.createElement("img", { src: "./assets/gifs/fingerTap.gif", className: "finger-tap-gif" })
      )));
  }
  if (sub === "dupBtn") {
    els.push(centered("dcap", BOARD.y + BOARD.h - 260,
      React.createElement("div", { className: "action-caption soft-in", style: { width: 620 }, dangerouslySetInnerHTML: { __html: ui.duplicateText } })));
    els.push(centered("dbtn", BOARD.y + BOARD.h - 120,
      React.createElement("button", { className: "btn-action small soft-in", onClick: duplicate },
        React.createElement("span", null, ui.duplicateBtn),
        React.createElement("img", { src: "./assets/gifs/fingerTap.gif", className: "finger-tap-gif" })
      )));
  }

  const instr = sub === "scatter" ? ui.scatterInstruction : (sub === "dupBtn" ? ui.duplicateInstruction : "");

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" },
      React.createElement("div", {
        style: {
          position: "absolute", inset: 0, transformOrigin: "50% 40%",
          transition: "transform .7s var(--ease), opacity .7s var(--ease)",
          transform: sub === "leaving" ? "scale(0.82)" : "none",
          opacity: sub === "leaving" ? 0 : 1
        }
      }, els)
    ),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, ui.scatterHeader)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { className: "bottom-instruction" }, instr)
    )
  );
};
