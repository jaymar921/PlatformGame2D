import { useEffect, useState } from "react";
import "./App.css";
import { useCanvas } from "./hooks/useCanvas";
import { MapGenerator } from "./handlers/MapGenerator";
import { MapGeneratorV2 } from "./handlers/MapGenerator_v2";
import { LevelGenerator } from "./handlers/LevelGenerator";
import { TextureMap } from "./contants/TextureMap";
import { level1 } from "./contants/Levels";
import map1Image from "./assets/textures/map/map-1-tiles.png";
import TilemapLevelGenerator from "./handlers/TilemapLevelGenerator";
import { TileMapColliders } from "./contants/TileMapColliders";
import PlayerHandler from "./handlers/PlayerHandler";

function App() {
  const canvasScreen = useCanvas(
    "canvas-screen",
    window.innerWidth,
    window.innerHeight,
    "#020617"
  );

  function handleClick(clickEvent) {}

  useEffect(() => {
    if (!canvasScreen) return;
    canvasScreen.enableScreenDrag(true);
    canvasScreen.handleScreenClickedEvent(handleClick);
    canvasScreen.setCameraOffset(-20, -20);
    // const worldGen = new MapGenerator(10, 10, 16, "map-2", 6);
    // worldGen.generate();
    // worldGen.loadWorld(canvasScreen);

    // const worldGen2 = new MapGeneratorV2(30, 30, 1, "map-1");
    // worldGen2.generateMap(canvasScreen);

    // const levelGenerator = new LevelGenerator(canvasScreen, TextureMap, 16);
    // levelGenerator.loadLevel(level1);
    const tilemapLevelGen = new TilemapLevelGenerator(canvasScreen);
    const playerHandler = new PlayerHandler(canvasScreen, {
      x: 8 * 32,
      y: 5 * 32,
    });

    tilemapLevelGen.addLevel(
      map1Image,
      512,
      320,
      { x: 0, y: 0 },
      TileMapColliders.level1
    );

    tilemapLevelGen.loadLevel(1);

    playerHandler.addColliders(tilemapLevelGen.getBoxCollider(1));
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
