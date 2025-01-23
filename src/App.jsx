import { useEffect } from "react";
import "./App.css";
import { useCanvas } from "./hooks/useCanvas";
import { MapGenerator } from "./handlers/MapGenerator";

function App() {
  const canvasScreen = useCanvas(
    "canvas-screen",
    window.innerWidth,
    window.innerHeight,
    "blue"
  );

  function handleClick(clickEvent) {
    console.log(clickEvent);
  }

  useEffect(() => {
    if (!canvasScreen) return;
    canvasScreen.enableScreenDrag(true);
    canvasScreen.handleScreenClickedEvent(handleClick);
    canvasScreen.setCameraOffset(0, 0);
    const worldGen = new MapGenerator(5, 5, 16, "map-2", 1.9);
    worldGen.generate();
    worldGen.loadWorld(canvasScreen);
  }, [canvasScreen]);

  return (
    <>
      <div className="content-center h-screen">
        <canvas className="m-auto" id="canvas-screen"></canvas>
      </div>
    </>
  );
}

export default App;
