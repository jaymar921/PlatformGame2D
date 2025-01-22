import { useEffect } from "react";
import "./App.css";
import { useCanvas } from "./hooks/useCanvas";
import { MapGenerator } from "./handlers/MapGenerator";

function App() {
  const canvasScreen = useCanvas("canvas-screen", 300, 300, "blue");

  function handleClick(clickEvent) {
    console.log(clickEvent);
  }

  useEffect(() => {
    if (!canvasScreen) return;
    canvasScreen.enableScreenDrag(true);
    canvasScreen.handleScreenClickedEvent(handleClick);

    const worldGen = new MapGenerator(16, 16, 16);
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
