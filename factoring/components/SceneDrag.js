// Scene 3 — the board morphs left (frozen reference); a copy flies in from the
// right. The copy starts ALREADY partially aligned to the final rectangle: rows
// 0-1 of the mismatched pile (1 m + 2 units each) sit exactly where they need to
// stay — only the genuine overflow pieces (the 3rd/4th "m" and the spare unit
// row) are draggable, into slots immediately beside the existing shape (m's
// extend the row leftward, units extend it rightward). Never a pre-drawn grid,
// never a "complete forced rearrangement." onDone → reveal scene.
const SceneDrag = ({ onDone }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const LEFT = { x: 90, y: 150, w: 780, h: 760 };
  const RIGHT = { x: 1050, y: 150, w: 780, h: 760 };

  // ---- mismatched "pile" geometry (LOCAL — relative to a board wrapper) ----
  // centred in the board (matching how Scene 2 centres the same shape), with
  // enough left margin for the overflow slot ("m" extends the row LEFTWARD)
  const pileOx = 225, pileOy = 90;
  const uPileOx = pileOx + MW + GAP2;
  const homeLocal = (kind, i) => kind === "m"
    ? { x: pileOx, y: pileOy + i * (U + GAP2) }
    : { x: uPileOx + (i % 2) * (U + GAP2), y: pileOy + Math.floor(i / 2) * (U + GAP2) };

  // ---- the two KEPT rows (already correct from the start — pile rows 0 & 1,
  // each already showing 1 "m" + 2 units, which is exactly their final spot) ----
  const ROW_Y = [pileOy, pileOy + (U + GAP2)];
  const KEPT_M_X = pileOx;                    // unchanged — matches m0/m1's pile position
  const KEPT_U_X = [uPileOx, uPileOx + (U + GAP2)]; // unchanged — matches u0..u3's pile position

  // ---- the two OVERFLOW slots per kind — immediately beside the kept row:
  // an "m" extends the row LEFTWARD (new slot left of the kept m), a unit
  // extends it RIGHTWARD (new slot right of the kept units) ----
  const OVERFLOW_M_X = pileOx - (MW + GAP2);
  const OVERFLOW_U_X = uPileOx + 2 * (U + GAP2);
  const overflowSlot = (kind, row) => kind === "m"
    ? { x: OVERFLOW_M_X, y: ROW_Y[row], w: MW, h: U }
    : { x: OVERFLOW_U_X, y: ROW_Y[row], w: U, h: U };

  const tileIndex = (id) => parseInt(id.slice(1), 10);
  const initTiles = () => {
    const t = [];
    // m0, m1 are the two KEPT tiles — already in place, not draggable.
    // m2, m3 are the overflow pair — start at their pile position (rows 2 & 3).
    for (let i = 0; i < M_COEF; i++) t.push({ id: "m" + i, kind: "m", kept: i < 2, placed: i < 2, overflowSlot: null });
    // u0..u3 are the four KEPT tiles (2 per kept row); u4, u5 are the overflow pair.
    for (let i = 0; i < CONST; i++) t.push({ id: "u" + i, kind: "u", kept: i < 4, placed: i < 4, overflowSlot: null });
    return t;
  };

  const [tiles, setTiles] = useState(initTiles);
  const [drag, setDrag] = useState(null);       // { id, kind, dx, dy, hover: bool }
  const [entered, setEntered] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const dragRef = useRef(null);                 // live drag info (avoids stale closures in window listeners)

  useEffect(() => {
    timers.current.push(setTimeout(() => { setEntered(true); AudioKit.whoosh(); }, 40));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  // how many overflow tiles of this kind have already landed (0, 1, or 2) —
  // the frontier: the NEXT overflow slot is always the one immediately beside
  // whichever kept/overflow tiles already sit in that row.
  const overflowPlaced = (kind, list) => list.filter(t => t.kind === kind && !t.kept && t.placed).length;

  const startDrag = (tile) => (e) => {
    if (tile.kept || tile.placed) return;
    e.preventDefault();
    AudioKit.grab();
    const scale = canvasScale() || 1;
    const pt = (ev) => ev.touches && ev.touches[0] ? ev.touches[0] : ev;
    const start = pt(e);
    const info = { id: tile.id, kind: tile.kind, startPX: start.clientX, startPY: start.clientY, dx: 0, dy: 0, hover: false };
    dragRef.current = info;
    setDrag({ ...info });

    const onMove = (ev) => {
      const d = dragRef.current; if (!d) return;
      const p = pt(ev);
      d.dx = (p.clientX - d.startPX) / scale; d.dy = (p.clientY - d.startPY) / scale;
      const home = homeLocal(tile.kind, tileIndex(tile.id));
      const w = tile.kind === "m" ? MW : U;
      const cx = home.x + d.dx + w / 2, cy = home.y + d.dy + U / 2;
      const row = overflowPlaced(tile.kind, tiles);
      const s = overflowSlot(tile.kind, row);
      d.hover = cx > s.x && cx < s.x + s.w && cy > s.y && cy < s.y + s.h;
      setDrag({ ...d });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      const d = dragRef.current; dragRef.current = null;
      if (d && d.hover) {
        const row = overflowPlaced(tile.kind, tiles);
        AudioKit.snap(row);
        setTiles(prev => {
          const next = prev.map(t => t.id === d.id ? { ...t, placed: true, overflowSlot: row } : t);
          if (next.every(t => t.placed)) {
            timers.current.push(setTimeout(() => { setDone(true); AudioKit.lock(); }, 500));
            timers.current.push(setTimeout(onDone, 1900));
          }
          return next;
        });
      } else {
        AudioKit.bounceBack();
      }
      setDrag(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  };

  // ---- render one board's tiles at LOCAL coords. The LEFT (frozen reference)
  // board ALWAYS uses home position, regardless of the shared `placed` state —
  // it must never reflect what's happening on the right board. ----
  const renderBoardTiles = (interactive) => tiles.map((t) => {
    const idx = tileIndex(t.id);
    const isDragging = interactive && drag && drag.id === t.id;
    const w = t.kind === "m" ? MW : U, h = U;
    let lx, ly;
    if (!interactive) {
      const home = homeLocal(t.kind, idx);
      lx = home.x; ly = home.y;
    } else if (t.kept) {
      const home = homeLocal(t.kind, idx);
      lx = home.x; ly = home.y;
    } else if (t.placed) {
      const s = overflowSlot(t.kind, t.overflowSlot);
      lx = s.x; ly = s.y;
    } else if (isDragging) {
      const home = homeLocal(t.kind, idx);
      lx = home.x + drag.dx; ly = home.y + drag.dy;
    } else {
      const home = homeLocal(t.kind, idx);
      lx = home.x; ly = home.y;
    }
    return React.createElement(Tile, {
      key: (interactive ? "R" : "L") + t.id, x: lx, y: ly, w, h,
      kind: t.kind === "m" ? "amber" : "blue",
      className: (interactive && !t.kept && !t.placed ? "draggable " : "") + (isDragging ? "dragging" : ""),
      style: { zIndex: isDragging ? 20 : 3, transition: isDragging ? "none" : undefined },
      onMouseDown: interactive ? startDrag(t) : undefined,
      onTouchStart: interactive ? startDrag(t) : undefined
    });
  });

  const valuePill = (key, bw) => React.createElement("div", {
    key, className: "value-readout", style: { left: bw / 2 + "px", top: 40 + "px", transform: "translateX(-50%)" }
  },
    React.createElement("span", null, ui.valueOnBoard),
    React.createElement("span", { style: { color: TERM_COLOR } }, M_COEF + " m"),
    React.createElement("span", null, " + "),
    React.createElement("span", { style: { color: UNIT_COLOR } }, String(CONST))
  );

  // a board wrapper: absolutely positioned at (board.x, board.y), slides in on
  // mount via transform; children use LOCAL coords (0..board.w, 0..board.h).
  const boardWrapper = (key, board, offscreenX, frameClass, children) =>
    React.createElement("div", {
      key, style: {
        position: "absolute", left: board.x + "px", top: board.y + "px", width: board.w + "px", height: board.h + "px",
        transform: entered ? "none" : `translateX(${offscreenX}px)`, transition: "transform .7s var(--ease)"
      }
    },
      React.createElement("div", { className: "board-frame " + frameClass, style: { left: 0, top: 0, width: "100%", height: "100%" } }),
      children
    );

  // LEFT — frozen reference (never reacts to right-board state)
  const leftChildren = [].concat(renderBoardTiles(false), [valuePill("lval", LEFT.w)]);
  const leftBoard = boardWrapper("lb", LEFT, 680, "dim", leftChildren);

  // RIGHT — interactive; the ONLY dropzone is the current frontier overflow
  // slot for the kind being actively dragged, immediately beside the existing
  // rows (pseudo-free — never a pre-drawn grid)
  const rightChildren = [];
  if (drag) {
    const row = overflowPlaced(drag.kind, tiles);
    const s = overflowSlot(drag.kind, row);
    rightChildren.push(React.createElement("div", {
      key: "frontier", className: "dropzone" + (drag.hover ? " hot" : ""),
      style: { left: s.x + "px", top: s.y + "px", width: s.w + "px", height: s.h + "px" }
    }));
  }
  renderBoardTiles(true).forEach(e => rightChildren.push(e));
  rightChildren.push(valuePill("rval", RIGHT.w));
  const rightBoard = boardWrapper("rb", RIGHT, 980, !done ? "highlight" : "", rightChildren);

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage", style: { touchAction: "none" } }, [leftBoard, rightBoard]),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, ui.dragHeader)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { className: "bottom-instruction" }, ui.dragInstruction)
    )
  );
};
