// Scene 8 — the general rule. The tapped term (scene 7) is x; the other is b,
// keeping position/colour:  3→x ⇒ a×(x±b) ;  5→x ⇒ a×(b±x).
const SceneSummary = ({ varOf, onRestart }) => {
  const ui = window.T.ui;
  const blueLabel = varOf === "amber" ? "b" : "x";   // first (blue) bracket term
  const amberLabel = varOf === "amber" ? "x" : "b";  // second (amber) bracket term

  const varSpan = (t) => React.createElement("span", { className: "eq-var" }, t);
  const box = (cls, t) => React.createElement("span", { className: "eq-chip " + cls, key: cls }, varSpan(t));
  const prod = (cls, t) => React.createElement("span", { className: "eq-chip " + cls, key: cls + "p" },
    varSpan("a"), React.createElement("span", null, NB + "×" + NB), varSpan(t));

  const eq = React.createElement("div", { className: "eq-wrap soft-in", style: { top: 132 } },
    React.createElement("div", { className: "eq-side" },
      varSpan("a"),
      React.createElement("span", null, NB + "×" + NB + "(" + NB),
      box("blue", blueLabel),
      React.createElement("span", null, NB + "±" + NB),
      box("amber", amberLabel),
      React.createElement("span", null, NB + ")")),
    React.createElement("span", { className: "eq-eq" }, "="),
    React.createElement("div", { className: "eq-side" },
      prod("blue", blueLabel),
      React.createElement("span", null, NB + "±" + NB),
      prod("amber", amberLabel)));

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" },
      eq,
      React.createElement("div", { className: "summary-wrap", style: { top: 470 } },
        React.createElement("div", {
          className: "summary-card soft-in",
          dangerouslySetInnerHTML: { __html: ui.summaryText }
        }))
    ),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, ui.ruleHeader)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { style: { minWidth: "96px" } }),
      React.createElement("div", { className: "bottom-instruction" }, ui.activityCompleted),
      React.createElement("div", { className: "bottom-next" },
        React.createElement("button", { className: "btn-nav", onClick: onRestart }, React.createElement("span", null, ui.startOver))
      )
    )
  );
};
