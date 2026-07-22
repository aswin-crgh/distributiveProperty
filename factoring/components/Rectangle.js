// The composite rectangle: `rows` rows, each row = mPerRow "m" tiles + cPerRow
// unit tiles, contiguous (no gap between the m-block and the unit-block — it
// reads as ONE rectangle, not two side by side). Static/non-draggable — used
// for the Scene 4 reveal and the Scene 5 mini callback.
//
// labels: "none" | "height" | "full"  (full = height + per-row m/unit widths)
const Rectangle = ({ x, y, u, mw, rows, mPerRow, cPerRow, gap, labels, dim, onClick, tappable }) => {
  gap = gap == null ? 6 : gap;
  labels = labels || "none";
  const rowW = mPerRow * mw + cPerRow * u + (mPerRow + cPerRow - 1) * gap;
  const rowH = rows * u + (rows - 1) * gap;

  const els = [];
  for (let r = 0; r < rows; r++) {
    const ty = y + r * (u + gap);
    let tx = x;
    for (let c = 0; c < mPerRow; c++) {
      els.push(React.createElement(Tile, { key: "m" + r + "-" + c, x: tx, y: ty, w: mw, h: u, kind: "amber", style: { zIndex: 3, opacity: dim ? 0.55 : 1 } }));
      tx += mw + gap;
    }
    for (let c = 0; c < cPerRow; c++) {
      els.push(React.createElement(Tile, { key: "u" + r + "-" + c, x: tx, y: ty, w: u, h: u, kind: "blue", style: { zIndex: 3, opacity: dim ? 0.55 : 1 } }));
      tx += u + gap;
    }
  }

  if (labels === "height" || labels === "full") {
    els.push(React.createElement("div", {
      key: "h", className: "dim-label", style: { left: x - 46 + "px", top: y + rowH / 2 - 26 + "px", color: dim ? "#7791a4" : INK }
    }, String(rows)));
  }
  if (labels === "full") {
    const mBlockCx = x + (mPerRow * mw + (mPerRow - 1) * gap) / 2;
    const cBlockCx = x + mPerRow * mw + (mPerRow - 1) * gap + gap + (cPerRow * u + (cPerRow - 1) * gap) / 2;
    els.push(React.createElement("div", { key: "lm", className: "strip-label", style: { left: mBlockCx + "px", top: y - 50 + "px", color: dim ? "#c79a55" : TERM_COLOR } },
      React.createElement("span", { className: "dim-var" }, mPerRow + "m")));
    els.push(React.createElement("div", { key: "lc", className: "strip-label", style: { left: cBlockCx + "px", top: y - 50 + "px", color: dim ? "#5f92b8" : UNIT_COLOR } }, String(cPerRow)));
  }

  els.push(React.createElement("div", {
    key: "hit", onClick, className: tappable ? "rect-hit tappable" : "rect-hit",
    style: { position: "absolute", left: x + "px", top: y - (labels !== "none" ? 60 : 0) + "px",
             width: rowW + "px", height: rowH + (labels !== "none" ? 60 : 0) + "px",
             cursor: tappable ? "pointer" : "default", zIndex: 4, background: "transparent" }
  }));

  return els;
};

Rectangle.size = (u, mw, rows, mPerRow, cPerRow, gap) => {
  gap = gap == null ? 6 : gap;
  return {
    w: mPerRow * mw + cPerRow * u + (mPerRow + cPerRow - 1) * gap,
    h: rows * u + (rows - 1) * gap
  };
};
