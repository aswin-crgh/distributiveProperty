// Scene 1 — statement card + the single primary CTA.
const IntroScreen = ({ onExplore }) => {
  const ui = window.T.ui;
  return React.createElement("div", { className: "page intro-page" },
    React.createElement("div", { className: "top-bar" },
      React.createElement("span", null, window.T.title)
    ),

    React.createElement("div", { className: "intro-content" },
      React.createElement("div", { className: "intro-card" },
        React.createElement("div", {
          className: "intro-statement",
          dangerouslySetInnerHTML: { __html: ui.introStatement }
        })
      ),
      React.createElement("button", { className: "btn-primary", onClick: onExplore },
        React.createElement("span", null, ui.exploreButton),
        React.createElement("img", { src: "./assets/gifs/fingerTap.gif", className: "finger-tap-gif" })
      )
    ),

    React.createElement("div", { className: "bottom-bar" },
      React.createElement("div", { className: "bottom-instruction" }, ui.introInstruction)
    )
  );
};
