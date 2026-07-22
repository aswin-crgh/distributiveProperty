// Root: linear scene machine for the factoring (HCF) lesson.
//   intro → scatter → drag → reveal → steps → loop → summary → (restart)
const App = () => {
  const { useState } = React;
  const [phase, setPhase] = useState("intro");
  const go = (p, up) => { AudioKit.transition(up !== false); setPhase(p); };

  let screen;
  switch (phase) {
    case "intro":    screen = React.createElement(IntroScreen, { onExplore: () => go("scatter") }); break;
    case "scatter":  screen = React.createElement(SceneScatter, { onDone: () => setPhase("drag") }); break;
    case "drag":     screen = React.createElement(SceneDrag, { onDone: () => setPhase("reveal") }); break;
    case "reveal":   screen = React.createElement(SceneReveal, { onNext: () => go("steps") }); break;
    case "steps":    screen = React.createElement(SceneSteps, { onNext: () => go("loop") }); break;
    case "loop":     screen = React.createElement(SceneLoop, { onNext: () => go("summary") }); break;
    case "summary":  screen = React.createElement(SceneSummary, { onRestart: () => go("intro", false) }); break;
    default:         screen = React.createElement(IntroScreen, { onExplore: () => go("scatter") });
  }

  return React.createElement(ScaleWrapper, null,
    React.createElement("div", { key: phase, style: { width: "100%", height: "100%" } }, screen)
  );
};
