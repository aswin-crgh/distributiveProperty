// Beveled unit tile — the atom of every visual (pool square, strip cell, grid cell,
// x-rectangle). Absolutely positioned in 1920×1080 px. Colour = identity.
const TILE_FILL = {
  blue:  "linear-gradient(158deg, #85C7F2 0%, #3E93CE 100%)",
  amber: "linear-gradient(158deg, #FFCE7A 0%, #EFA020 100%)",
  grey:  "linear-gradient(158deg, #ADB7C3 0%, #6C7885 100%)"
};
const TILE_EDGE = { blue: "#2C6FA6", amber: "#C77D1E", grey: "#566270" };

const tileShadow = (kind) =>
  `inset 0 3px 5px rgba(255,255,255,0.42), inset 0 -6px 11px rgba(0,0,0,0.20), ` +
  `inset 0 0 0 1px ${TILE_EDGE[kind] || TILE_EDGE.blue}, 0 6px 13px rgba(0,0,0,0.30)`;

const Tile = ({ x, y, w, h, kind, className, style, onClick, onMouseDown, onTouchStart, innerRef }) =>
  React.createElement("div", {
    ref: innerRef,
    className: "tile " + (className || ""),
    onClick: onClick,
    onMouseDown: onMouseDown,
    onTouchStart: onTouchStart,
    style: Object.assign({
      left: x + "px", top: y + "px", width: w + "px", height: h + "px",
      background: TILE_FILL[kind] || TILE_FILL.blue,
      boxShadow: tileShadow(kind)
    }, style || {})
  });

// GAP between contiguous unit tiles (small separator, matches the deck's beveled units)
const GAP = 5;
const PITCH = U + GAP;   // centre-to-centre spacing of unit squares in a grid
