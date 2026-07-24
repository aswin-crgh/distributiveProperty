// Scene 6 — 2×(2m+3) sits between two buttons. Distribute and Factor are exact
// time-reverses of each other: distribute = the leading "2" splits, BOTH copies
// visibly arc outward to prefix each term, then the terms simplify; factor = the
// terms un-simplify, then BOTH "2"s visibly arc inward and converge into the one
// leading factor. Once both directions have been tried once, "»" unlocks.
const SceneLoop = ({ onNext }) => {
  const { useState, useRef, useEffect } = React;
  const ui = window.T.ui;

  // DX magnitudes for the two chips' arcs — chip1 (before "2m") travels a short
  // hop, chip2 (before "3") travels a longer one past the "+ 2m" in between.
  const DX1 = -50, DX2 = -340;

  const [form, setForm] = useState("factored");     // factored | mid | distributed
  const [arcing, setArcing] = useState(null);        // null | "out" (distribute's split) | "in" (factor's merge)
  const [triedD, setTriedD] = useState(false);
  const [triedF, setTriedF] = useState(false);
  const [busy, setBusy] = useState(false);
  const timers = useRef([]);
  const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const distribute = () => {
    if (form !== "factored" || busy) return;
    setBusy(true); AudioKit.split();
    setArcing("out"); setForm("mid");                          // phase A: both 2's arc outward (650ms)
    push(() => setArcing(null), 650);                          // settle, hold the mid form
    push(() => { setForm("distributed"); setTriedD(true); setBusy(false); AudioKit.lock(); }, 1050); // phase C: simplify (cross-fade)
  };
  const factor = () => {
    if (form !== "distributed" || busy) return;
    setBusy(true); AudioKit.split();
    setForm("mid");                                            // phase A reversed: un-simplify (cross-fade)
    push(() => { setForm("factored"); setArcing("in"); }, 400); // phase C reversed: land on factored shape, both 2's arc inward to converge
    push(() => { setArcing(null); setTriedF(true); setBusy(false); AudioKit.lock(); }, 400 + 650);
  };

  const expr = () => {
    if (form === "factored") {
      if (arcing === "in") {
        // both flying "2"s converge into the (hidden, until they land) leading 2
        return React.createElement("div", { className: "eq-side", style: { fontSize: "88px", position: "relative" } },
          React.createElement("span", { style: { opacity: 0 } }, String(HCF)),
          React.createElement("span", null, NB + "(" + NB),
          React.createElement("span", { style: { color: TERM_COLOR } }, String(M_PER_ROW), React.createElement("span", { className: "eq-var" }, "m")),
          React.createElement("span", null, NB + "+" + NB),
          React.createElement("span", { style: { color: UNIT_COLOR } }, String(C_PER_ROW)),
          React.createElement("span", null, NB + ")"),
          React.createElement("span", { className: "arc-hop", style: { position: "absolute", left: "38px", top: "24px", "--dx": -DX1 + "px", "--dy": "0px" } }, String(HCF)),
          React.createElement("span", { className: "arc-hop", style: { position: "absolute", left: "38px", top: "24px", "--dx": -DX2 + "px", "--dy": "0px" } }, String(HCF))
        );
      }
      return React.createElement("div", { className: "eq-side", style: { fontSize: "88px" } },
        React.createElement("span", null, String(HCF)),
        React.createElement("span", null, NB + "(" + NB),
        React.createElement("span", { style: { color: TERM_COLOR } }, String(M_PER_ROW), React.createElement("span", { className: "eq-var" }, "m")),
        React.createElement("span", null, NB + "+" + NB),
        React.createElement("span", { style: { color: UNIT_COLOR } }, String(C_PER_ROW)),
        React.createElement("span", null, NB + ")"));
    }
    if (form === "mid") {
      // distribute: both "2×" chips arc IN from the shared origin (the old
      // leading 2's spot), duplicating outward to prefix each term.
      const cls = arcing === "out" ? "arc-hop" : "";
      return React.createElement("div", { className: "eq-side", style: { fontSize: "76px" } },
        React.createElement("span", { className: cls, style: { display: "inline-block", "--dx": DX1 + "px", "--dy": "0px" } }, HCF + NB + "×" + NB),
        React.createElement("span", { style: { color: TERM_COLOR } }, String(M_PER_ROW), React.createElement("span", { className: "eq-var" }, "m")),
        React.createElement("span", null, NB + "+" + NB),
        React.createElement("span", { className: cls, style: { display: "inline-block", "--dx": DX2 + "px", "--dy": "0px" } }, HCF + NB + "×" + NB),
        React.createElement("span", { style: { color: UNIT_COLOR } }, String(C_PER_ROW)));
    }
    return React.createElement("div", { className: "eq-side soft-in", style: { fontSize: "88px" } },
      React.createElement("span", { style: { color: TERM_COLOR } }, String(M_COEF), React.createElement("span", { className: "eq-var" }, "m")),
      React.createElement("span", null, NB + "+" + NB),
      React.createElement("span", { style: { color: UNIT_COLOR } }, String(CONST)));
  };

  const bothTried = triedD && triedF;
  const dEnabled = form === "factored" && !busy;
  const fEnabled = form === "distributed" && !busy;

  const instr = !triedD && !triedF ? ui.loopInstructionStart
    : bothTried ? ui.loopInstructionDone
    : ui.loopInstructionOne;

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" },
      React.createElement("div", { key: form + arcing, style: { position: "absolute", left: 0, top: "420px", width: "100%", display: "flex", justifyContent: "center" } }, expr()),
      React.createElement("button", {
        className: "btn-toggle" + (triedD ? " tried" : "") + (dEnabled ? " active" : ""),
        style: { position: "absolute", left: "470px", top: "650px" }, onClick: distribute, disabled: !dEnabled
      }, ui.distributeBtn),
      React.createElement("button", {
        className: "btn-toggle" + (triedF ? " tried" : "") + (fEnabled ? " active" : ""),
        style: { position: "absolute", left: "1000px", top: "650px" }, onClick: factor, disabled: !fEnabled
      }, ui.factorBtn)
    ),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, ui.loopHeader)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { style: { minWidth: "96px" } }),
      React.createElement("div", { className: "bottom-instruction" }, instr),
      React.createElement("div", { className: "bottom-next" },
        bothTried
          ? React.createElement("button", { className: "btn-nav soft-in", onClick: onNext }, React.createElement("span", null, ui.next))
          : React.createElement("div", { style: { minWidth: "96px" } })
      )
    )
  );
};
