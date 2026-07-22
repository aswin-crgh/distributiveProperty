// A dismissable, centred overlay card on a scrim. Used for the two HCF-callback
// beats (Scene 4 foreshadow, Scene 5 payoff). Tap anywhere (scrim or card) to close.
const Overlay = ({ onDismiss, children }) => {
  const { useEffect } = React;
  useEffect(() => { AudioKit.pop(); }, []);
  const close = () => { AudioKit.close(); onDismiss(); };
  return React.createElement("div", { className: "overlay-scrim", onClick: close },
    React.createElement("div", { className: "overlay-card", onClick: close }, children)
  );
};
