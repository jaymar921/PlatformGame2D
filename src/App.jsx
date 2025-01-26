import { useEffect, useState } from "react";
import "./App.css";
import { useCanvas } from "./hooks/useCanvas";
import { MapGenerator } from "./handlers/MapGenerator";
import { MapGeneratorV2 } from "./handlers/MapGenerator_v2";
import { LevelGenerator } from "./handlers/LevelGenerator";
import { TextureMap } from "./contants/TextureMap";
import { level1 } from "./contants/Levels";

function App() {
  const canvasScreen = useCanvas(
    "canvas-screen",
    window.innerWidth,
    window.innerHeight,
    "black"
  );

  function handleClick(clickEvent) {}

  useEffect(() => {
    if (!canvasScreen) return;
    canvasScreen.enableScreenDrag(true);
    canvasScreen.handleScreenClickedEvent(handleClick);
    canvasScreen.setCameraOffset(-20, -20);
    const worldGen = new MapGenerator(10, 10, 16, "map-2", 6);
    worldGen.generate();
    worldGen.loadWorld(canvasScreen);

    // const worldGen2 = new MapGeneratorV2(30, 30, 1, "map-1");
    // worldGen2.generateMap(canvasScreen);

    // const levelGenerator = new LevelGenerator(canvasScreen, TextureMap, 16);
    // levelGenerator.loadLevel(level1);
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
