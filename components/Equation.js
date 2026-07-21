// The distributive equation bar:  m × ( t1 op t2 )  =  m × t1 op m × t2
// Colour-anchored chips; terms can be tappable (→ variable) and the right side
// can be a dimmed "ghost" until revealed.
const eqChip = (key, term, opts) => {
  opts = opts || {};
  const cls = "eq-chip " + (term.cls || "") + (opts.tappable ? " tappable" : "");
  const inner = term.isVar
    ? React.createElement("span", { className: "eq-var" }, term.val)
    : React.createElement("span", null, term.val);
  return React.createElement("span", {
    key, className: cls, onClick: opts.onClick
  }, inner);
};

// a chip that wraps a WHOLE product term: mult × term
const eqProduct = (key, mult, term) =>
  React.createElement("span", { key, className: "eq-chip " + (term.cls || "") },
    React.createElement("span", null, mult + NB + "×" + NB),
    term.isVar ? React.createElement("span", { className: "eq-var" }, term.val)
               : React.createElement("span", null, term.val));

const Equation = ({ mult, t1, t2, op, showRight, tappable, onTapT1, onTapT2, leftDim, rightDim, style }) => {
  op = op || "+";
  const left = React.createElement("div", { className: "eq-side" + (leftDim ? " dimmed" : "") },
    React.createElement("span", null, mult + NB + "×" + NB + "(" + NB),
    eqChip("l1", t1, { tappable, onClick: tappable ? onTapT1 : undefined }),
    React.createElement("span", null, NB + op + NB),
    eqChip("l2", t2, { tappable, onClick: tappable ? onTapT2 : undefined }),
    React.createElement("span", null, NB + ")")
  );

  const right = React.createElement("div", { className: "eq-side" + (showRight ? "" : " ghost") + (rightDim ? " dimmed" : "") },
    eqProduct("r1", mult, t1),
    React.createElement("span", null, NB + op + NB),
    eqProduct("r2", mult, t2)
  );

  return React.createElement("div", { className: "eq-wrap", style: style || {} },
    left,
    React.createElement("span", { className: "eq-eq" }, "="),
    right
  );
};
