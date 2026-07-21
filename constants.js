// ---------------------------------------------------------------------------
// Distributive Property — tunables + geometry. One place for spacing, timing,
// colours, and the scripted values. Loaded as a browser global before components.
// ---------------------------------------------------------------------------

// ---- house palette (colour = identity) ----
const C_INTERACT = "#F5D54D";   // gold — the one CTA / interactive controls (reserved)

// The two identity colours for this lesson:
const BLUE      = "#5EB2E7";     // the number "3" (and the variable x)  — house obj-1
const BLUE_DK   = "#2C7AB4";
const AMBER     = "#FFB84D";     // the number "5"                        — house obj-6
const AMBER_DK  = "#C77D1E";
const GREY      = "#8A97A6";     // "coloured-out" pool squares
const GREY_DK   = "#5A6673";
const INK       = "#eef5fb";     // the neutral multiplier "4" dimension label

// ---- scripted values (fixed, per the storyboard) ----
const N1   = 3;   // first number (blue)
const N2   = 5;   // second number (amber)
const MULT = 4;   // multiplier

// ---- geometry (absolute px in the 1920×1080 canvas) ----
const U       = 86;    // unit-square side in the main board grid
const POOL_U  = 104;   // scattered pool square size
const XW      = 2.4;   // width (in units) of an "x" tile — height 1, 2<width<3

// ---- timing ----
const BEAT      = 460;   // ms per cascade reveal step
const LOOP_HOLD = 1500;  // pause between loop transformations (scene 6)

// ---- shared board-journey geometry (so hand-offs between scenes line up) ----
const GAP0 = 5;                              // (mirrors GAP in Tile.js)
const PITCH0 = U + GAP0;
const ROW8_W = 8 * U + 7 * GAP0;             // width of the arranged 3+5 row (8 units)
const BLOCK3_W = N1 * U + (N1 - 1) * GAP0;   // width of the blue "3" block
const BLOCK5_W = N2 * U + (N2 - 1) * GAP0;   // width of the amber "5" block

// single-board centre (scenes 2-4) and the arranged-row baseline
const BOARD_CX = 1350;
const ARR_Y = 470;                           // top-y of the arranged single row

// non-breaking space — flex chips trim normal whitespace, so use this around
// operators (×, +, ±, =, parentheses) to guarantee a single-space gap.
const NB = " ";

// tiny helper: clamp
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
