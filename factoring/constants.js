// ---------------------------------------------------------------------------
// Factoring (HCF) applet — tunables + geometry. One place for spacing, timing,
// colours, and the scripted values. Loaded as a browser global before components.
// ---------------------------------------------------------------------------

// ---- house palette (colour = identity) ----
// Here colour marks a ROLE, not "object A vs B": blue = a constant/unit ('1'),
// amber = a variable-coefficient term ('m'). Same hexes as the sister applet
// (distributive property) so the two read as a matched pair.
const C_INTERACT = "#F5D54D";   // gold — the one CTA / interactive controls (reserved)

const UNIT_COLOR = "#5EB2E7";   // the constant "1" tile        — house obj-1 (blue)
const UNIT_DK    = "#2C7AB4";
const TERM_COLOR = "#FFB84D";   // the variable-coefficient "m" tile — house obj-6 (amber)
const TERM_DK    = "#C77D1E";
const INK        = "#eef5fb";

// ---- scripted values (fixed, per the storyboard) ----
const M_COEF = 4;   // coefficient of m (number of "m" tiles)
const CONST  = 6;   // constant term (number of unit "1" tiles)
const HCF    = 2;   // HCF(4,6) — fixed, matches the deck's worked example
const M_PER_ROW = M_COEF / HCF;   // 2 — m-tiles per row once factored
const C_PER_ROW = CONST / HCF;    // 3 — unit tiles per row once factored

// ---- geometry (absolute px in the 1920×1080 canvas) ----
const U     = 80;     // unit-square side
const MW    = 170;    // "m" tile width (fixed; not a clean multiple of U — it's a
                       // variable, never meant to read as "exactly N units wide")
const GAP2  = 8;       // gap between contiguous tiles in board layouts
const POOL_U  = U;      // scattered-pool unit-square size — matches the rest of the applet
const POOL_MW = MW;     // scattered-pool "m" tile width — matches the rest of the applet

// ---- timing ----
const BEAT      = 460;   // ms per cascade reveal step
const LOOP_HOLD = 1500;  // pause between loop transformations (scene 6)

// non-breaking space — flex chips trim normal whitespace, so use this around
// operators (×, +, =, brackets) to guarantee a single-space gap.
const NB = " ";

// tiny helper: clamp
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ScaleWrapper scales the whole 1920×1080 canvas to fit the viewport — any code
// converting raw pointer-event deltas (screen px) into canvas-space px must
// divide by this factor first (mirrors ScaleWrapper's own scale computation).
const canvasScale = () => Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
