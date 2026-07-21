// Root: linear scene machine for the distributive-property lesson.
//   intro → build → multiply → rearrange → equation → variable → summary
const App = () => {
  const { useState } = React;
  const [phase, setPhase] = useState("intro");
  const [varOf, setVarOf] = useState("blue");   // which term became x in scene 7
  const go = (p, up) => { AudioKit.transition(up !== false); setPhase(p); };

  let screen;
  switch (phase) {
    case "intro":     screen = React.createElement(IntroScreen, { onExplore: () => go("build") }); break;
    case "build":     screen = React.createElement(SceneBuild, { onDone: () => setPhase("multiply") }); break;
    case "multiply":  screen = React.createElement(SceneMultiply, { onDone: () => go("rearrange") }); break;
    case "rearrange": screen = React.createElement(SceneRearrange, { onNext: () => go("equation") }); break;
    case "equation":  screen = React.createElement(SceneEquation, { onNext: () => go("variable") }); break;
    case "variable":  screen = React.createElement(SceneVariable, { onNext: (v) => { if (v) setVarOf(v); go("summary"); } }); break;
    case "summary":   screen = React.createElement(SceneSummary, { varOf, onRestart: () => go("intro", false) }); break;
    default:          screen = React.createElement(IntroScreen, { onExplore: () => go("build") });
  }

  // remount each phase (fresh timers/animation) by keying on the phase name
  return React.createElement(ScaleWrapper, null,
    React.createElement("div", { key: phase, style: { width: "100%", height: "100%" } }, screen)
  );
};
