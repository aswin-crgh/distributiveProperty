// Scene 7 — two panels (Distributed Form / Factor Form). First tap shows what
// each form IS; tapping » swaps the panel bodies to show HOW to convert between
// them — the Factor Form panel gains a compact 4-step recap — and reveals Start
// Over (fixed back to the scripted 4m+6 example).
const SceneSummary = ({ onRestart }) => {
  const { useState } = React;
  const ui = window.T.ui;
  const [sub, setSub] = useState("define"); // define | convert

  const panel = (title, body) => React.createElement("div", { className: "panel" },
    React.createElement("div", { className: "panel-title" }, title),
    React.createElement("div", { className: "panel-body" }, body)
  );

  const miniSteps = () => {
    const rows = [
      [ui.step1Label, ui.step1Short], [ui.step2Label, ui.step2Short],
      [ui.step3Label, ui.step3Short], [ui.step4Label, ui.step4Short]
    ];
    return React.createElement("div", { key: "steps", className: "mini-steps" },
      rows.map((r, i) => React.createElement("div", { key: i, className: "mini-step" },
        React.createElement("span", { className: "n" }, r[0]),
        React.createElement("span", { className: "t" }, r[1])
      ))
    );
  };

  const factorBody = sub === "define"
    ? ui.factorFormText
    : [React.createElement("div", { key: "t" }, ui.factorFormText2), miniSteps()];

  // faint decorative backdrop: the spread/mismatched arrangement echoing the
  // distributed form on the left, the settled rectangle echoing the factor
  // form on the right — pure ambience, sits behind the panels
  const bg = [];
  const bgTileStyle = { opacity: 0.16, filter: "saturate(0.7)" };
  const spreadSpots = [[130, 850, -8], [260, 900, 6], [190, 770, 4], [340, 830, -5], [400, 900, 7]];
  spreadSpots.forEach((s, i) => bg.push(React.createElement(Tile, {
    key: "bgs" + i, x: s[0], y: s[1], w: i % 2 ? 60 : 130, h: 60, kind: i % 2 ? "blue" : "amber",
    style: Object.assign({ zIndex: 2, transform: `rotate(${s[2]}deg)` }, bgTileStyle)
  })));
  Rectangle({ x: 1560, y: 800, u: 46, mw: 100, rows: HCF, mPerRow: M_PER_ROW, cPerRow: C_PER_ROW, gap: 5, labels: "none" })
    .forEach((e, i) => bg.push(React.cloneElement(e, { key: "bgr" + i, style: Object.assign({}, e.props.style, bgTileStyle, { zIndex: 2 }) })));

  return React.createElement("div", { className: "page canvas-page" },
    React.createElement("div", { className: "stage" },
      bg,
      React.createElement("div", { className: "panel-pair soft-in", key: sub, style: { left: "110px", top: "190px", width: "1700px" } },
        panel(ui.distributedFormTitle, sub === "define" ? ui.distributedFormText : ui.distributedFormText2),
        panel(ui.factorFormTitle, factorBody)
      )
    ),
    React.createElement("div", { className: "top-bar" }, React.createElement("span", null, ui.summariseHeader)),
    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { style: { minWidth: "96px" } }),
      React.createElement("div", { className: "bottom-instruction" }, sub === "define" ? ui.summaryInstruction : ui.activityCompleted),
      React.createElement("div", { className: "bottom-next" },
        sub === "define"
          ? React.createElement("button", { className: "btn-nav", onClick: () => { AudioKit.transition(true); setSub("convert"); } }, React.createElement("span", null, ui.next))
          : React.createElement("button", { className: "btn-nav", onClick: onRestart }, React.createElement("span", null, ui.startOver))
      )
    )
  );
};
