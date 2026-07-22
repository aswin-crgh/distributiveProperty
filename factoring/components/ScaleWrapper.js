const ScaleWrapper = ({ children }) => {
  const { useState, useEffect } = React;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return React.createElement("div", {
    className: "app-container",
    style: {
      width: "1920px", height: "1080px",
      position: "fixed", top: "50%", left: "50%",
      transform: `translate(-50%, -50%) scale(${scale})`,
      transformOrigin: "center center",
      overflow: "hidden"
    }
  }, children);
};
