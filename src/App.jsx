import { useEffect, useState } from "react";
import "./App.css";
import { useCanvas } from "./hooks/useCanvas";
import { MapGenerator } from "./handlers/MapGenerator";
import { MapGeneratorV2 } from "./handlers/MapGenerator_v2";
import { LevelGenerator } from "./handlers/LevelGenerator";
import { TextureMap } from "./contants/TextureMap";
import { level1 } from "./contants/Levels";
import map1Image from "./assets/textures/map/map-1-tiles-v2.png";
import map2Image from "./assets/textures/map/map-2.png";
import TilemapLevelGenerator from "./handlers/TilemapLevelGenerator";
import { TileMapColliders } from "./contants/TileMapColliders";
import PlayerHandler from "./handlers/PlayerHandler";
import PlayerHandlerV2 from "./handlers/PlayerHandlerV2";
import { convertSingleArrayMapTo2DArray } from "./utils/Utility";

function App() {
  const canvasScreen = useCanvas(
    "canvas-screen",
    window.innerWidth,
    window.innerHeight,
    "#020617"
  );
  const [handlersLoaded, setHandlersLoaded] = useState(false);
  const [modal, setModal] = useState({ show: false, display: "" });

  function handleClick(clickEvent) {}

  function onPlayerCollisionEvent(event) {
    // check if player collide with object
    if (event.collisionId === "id-2") {
      setModal({ show: true, display: "Paper" });
    } else if (event.collisionId === "id-3") {
      setModal({ show: true, display: "Stone" });
    } else if (event.collisionId === "id-4") {
      setModal({ show: true, display: "Pothole" });
    } else {
      setModal({ show: false, display: "" });
    }
  }

  useEffect(() => {
    if (!canvasScreen) return;
    // const worldGen = new MapGenerator(10, 10, 16, "map-2", 6);
    // worldGen.generate();
    // worldGen.loadWorld(canvasScreen);

    // const worldGen2 = new MapGeneratorV2(30, 30, 1, "map-1");
    // worldGen2.generateMap(canvasScreen);

    // const levelGenerator = new LevelGenerator(canvasScreen, TextureMap, 16);
    // levelGenerator.loadLevel(level1);
    if (!handlersLoaded) {
      canvasScreen.enableScreenDrag(true);
      canvasScreen.handleScreenClickedEvent(handleClick);
      canvasScreen.setCameraOffset(-20, -20);

      const tilemapLevelGen = new TilemapLevelGenerator(canvasScreen);

      const colliders = convertSingleArrayMapTo2DArray(
        TileMapColliders.level2_singleArray,
        {
          row: 20,
          column: 30,
        },
        1
      );

      tilemapLevelGen.addLevel(map2Image, 960, 640, { x: 0, y: 0 }, colliders);

      console.log(TileMapColliders.level2_singleArray);
      console.log();

      tilemapLevelGen.loadLevel(1);

      const playerHandler = new PlayerHandlerV2(canvasScreen, {
        x: 8 * 32,
        y: 5 * 32,
      });

      playerHandler.addColliders(tilemapLevelGen.getBoxCollider(1));
      playerHandler.addPlayerMoveEvent(onPlayerCollisionEvent);
      setTimeout(() => setHandlersLoaded(true), 200);
    }
  }, [canvasScreen]);

  return (
    <>
      {modal.show && (
        <div className="absolute border-2 left-[50%] translate-x-[-50%] top-[10%] p-2 rounded-md bg-gray-200 text-slate-900 shadow-xl">
          <h1 className="font-bold">{modal.display}</h1>
        </div>
      )}
      <div className="content-center h-screen">
        <canvas className="m-auto" id="canvas-screen"></canvas>
      </div>
    </>
  );
}

export default App;
