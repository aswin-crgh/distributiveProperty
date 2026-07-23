// A dismissable, centred overlay card on a scrim. Used for the two HCF-callback
// beats (Scene 4 foreshadow, Scene 5 payoff). Tap anywhere (scrim or card) to close.
// `width` (optional, px) confines the scrim to the screen's left portion — e.g.
// covering just the left reference panel — so the right panel stays visible
// and uninterrupted while the overlay is up. Omit for a full-width scrim.
const Overlay = ({ onDismiss, width, children }) => {
  const { useEffect } = React;
  useEffect(() => { AudioKit.pop(); }, []);
  const close = () => { AudioKit.close(); onDismiss(); };
  // when confined to the left, fade the BACKDROP's edge out (mask, so the
  // darkening AND the blur both taper off) instead of a hard vertical seam —
  // the card itself lives in a separate layer so it never gets faded too
  const fade = "linear-gradient(to right, black 0%, black 75%, transparent 100%)";
  const scrimStyle = width ? { width: width + "px" } : null;
  const backdropStyle = width ? { WebkitMaskImage: fade, maskImage: fade } : null;
  return React.createElement("div", { className: "overlay-scrim", style: scrimStyle, onClick: close },
    React.createElement("div", { className: "overlay-backdrop", style: backdropStyle }),
    React.createElement("div", { className: "overlay-card", onClick: close }, children)
  );
};
