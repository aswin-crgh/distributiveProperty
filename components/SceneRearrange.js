// Scene 5 — the duplicated board morphs in from off-screen right; tapping it
// separates the blue 4×3 and amber 4×5 halves, and the multiplying 4 hops (arc)
// over the bracket to label the second rectangle. → 4×3 + 4×5.
const SceneRearrange = ({ onNext }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  const uS = 62, pitchS = uS + GAP;
  const gridW = 8 * uS + 7 * GAP, gridH = 4 * uS + 3 * GAP;
  const b3 = N1 * uS + (N1 - 1) * GAP, b5 = N2 * uS + (N2 - 1) * GAP;
  const SPLIT = 74;

  const L = { x: 110, y: 158, w: 780, h: 660 };
  const R = { x: 1030, y: 158, w: 780, h: 660 };
  const OXR = (L.w - gridW) / 2, OY = 250;   // grid origin relative to a board group

  const [sub, setSub] = useState("two");     // two | splitting | split
  const [entered, setEntered] = useState(false);
  const timers = useRef([]);
  useEffect(() => {
    timers.current.push(setTimeout(() => { setEntered(true); AudioKit.whoosh(); }, 40));   // slide the boards in
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const splitNow = () => {
    if (sub !== "two") return;
    setSub("splitting");
    timers.current.push(setTimeout(() => { setSub("split"); AudioKit.split(); }, 620));
  };

  // one board group (frame + grid + labels + value), children positioned relative to the group
  const boardGroup = (key, bd, { split, dim, highlight, onClick, transform }) => {
    const kids = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
      const kind = c < N1 ? "blue" : "amber";
      const dx = (c >= N1 && split) ? SPLIT : 0;
      kids.push(React.createElement(Tile, { key: "t" + r + "-" + c, x: OXR + c * pitchS + dx, y: OY + r * pitchS, w: uS, h: uS, kind, style: { zIndex: 3 } }));
    }
    kids.push(React.createElement("div", { key: "d3", className: "strip-label", style: { left: OXR + b3 / 2 + "px", top: OY - 50 + "px", color: BLUE, fontSize: "40px" } }, String(N1)));
    kids.push(React.createElement("div", { key: "d5", className: "strip-label", style: { left: OXR + N1 * pitchS + (split ? SPLIT : 0) + b5 / 2 + "px", top: OY - 50 + "px", color: AMBER, fontSize: "40px" } }, String(N2)));
    kids.push(React.createElement("div", { key: "d4l", className: "dim-label", style: { left: OXR - 44 + "px", top: OY + gridH / 2 - 26 + "px", fontSize: "40px" } }, String(MULT)));
    if (split) {
      const dx = -(N1 * pitchS + SPLIT);   // hop from the first 4's position
      kids.push(React.createElement("div", {
        key: "d4r", className: "dim-label arc-hop",
        style: { left: OXR + N1 * pitchS + SPLIT - 44 + "px", top: OY + gridH / 2 - 26 + "px", fontSize: "40px", "--dx": dx + "px", "--dy": "0px" }
      }, String(MULT)));
    }
    // value pill — with the final numeric value at the right
    const vs = [React.createElement("span", { key: "l" }, ui.valueOnBoard)];
    if (split) {
      vs.push(React.createElement("span", { key: "m1" }, MULT + NB + "×" + NB));
      vs.push(React.createElement("span", { key: "b", style: { color: BLUE } }, String(N1)));
      vs.push(React.createElement("span", { key: "p" }, NB + "+" + NB));
      vs.push(React.createElement("span", { key: "m2" }, MULT + NB + "×" + NB));
      vs.push(React.createElement("span", { key: "a", style: { color: AMBER } }, String(N2)));
    } else {
      vs.push(React.createElement("span", { key: "m" }, MULT + NB + "×" + NB + "(" + NB));
      vs.push(React.createElement("span", { key: "b", style: { color: BLUE } }, String(N1)));
      vs.push(React.createElement("span", { key: "p" }, NB + "+" + NB));
      vs.push(React.createElement("span", { key: "a", style: { color: AMBER } }, String(N2)));
      vs.push(React.createElement("span", { key: "r" }, NB + ")"));
    }
    vs.push(React.createElement("span", { key: "res", style: { color: "#fff", fontWeight: 800 } }, NB + "=" + NB + (MULT * (N1 + N2))));
    kids.push(React.createElement("div", { key: "val", className: "value-readout", style: { left: bd.w / 2 + "px", top: 34 + "px", transform: "translateX(-50%)", fontSize: "40px", padding: "12px 26px" } }, vs));

    if (highlight && sub === "two") {
      kids.push(React.createElement("img", { key: "hint", src: "./assets/gifs/fingerTap.gif", className: "finger-hint", style: { left: bd.w - 90 + "px", top: bd.h - 96 + "px" } }));
    }

    return React.createElement("div", {
      key, className: "board-frame" + (dim ? " dim" : "") + (highlight ? " tappable highlight" : ""),
      style: { left: bd.x + "px", top: bd.y + "px", width: bd.w + "px", height: bd.h + "px", transform: transform || "none", transition: "transform .7s var(--ease)" },
      onClick
    }, kids);
  };

  const split = sub === "split" || sub === "splitting";
  const els = [
    boardGroup("L", L, { split: false, dim: true, transform: entered ? "none" : "translateX(740px)" }),
    boardGroup("R", R, { split, dim: false, highlight: sub === "two", onClick: sub === "two" ? splitNow : undefined, transform: entered ? "none" : "translateX(1000px)" })
  ];

  const header = sub === "split" ? ui.sameValueHeader : ui.rearrangeHeader;
  const ready = sub === "split";

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" }, els),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, header)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { style: { minWidth: "96px" } }),
      React.createElement("div", { className: "bottom-instruction" }, ready ? ui.relationshipInstruction : ui.rearrangeInstruction),
      React.createElement("div", { className: "bottom-next" },
        ready
          ? React.createElement("button", { className: "btn-nav soft-in", onClick: onNext }, React.createElement("span", null, ui.next))
          : React.createElement("div", { style: { minWidth: "96px" } })
      )
    )
  );
};
