const { StrictMode } = React;
const { createRoot } = ReactDOM;
const root = createRoot(document.getElementById("root"));
root.render(React.createElement(StrictMode, null, React.createElement(App, null)));
