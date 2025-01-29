import { CanvasScreen, Sprite } from "@jaymar921/2dgraphic-utils";
import { TextureMap } from "../contants/TextureMap";

export default class TilemapLevelGenerator{
    /**
     * 
     * @param {CanvasScreen} CanvasScreen 
     */
    constructor(CanvasScreen) { 
        this.canvasScreen = CanvasScreen;
        this.levels = [];
    }

    addLevel(tileMapImageSource, mapWidth, mapHeight, offset = { x: 0, y: 0}, colliders = []){
        const levelSprite = new Sprite({
            objID: `level-${this.levels.length + 1}`,
            posX: offset.x,
            posY: offset.y,
            imageSource: tileMapImageSource
        })

        const colliderSprites = [];

        for(let y = 0; y < colliders.length; y++){
            for(let x = 0; x < colliders[y].length; x++){
                if(colliders[y][x] === 0) continue;
                const posX = x * (mapWidth / colliders[y].length);
                const posY = y * (mapHeight / colliders.length);
                const colliderSprite = new Sprite({
                    objID: `collider-${posX}-${posY}`,
                    posX,
                    posY
                });
                colliderSprites.push(colliderSprite);
            }
        }

        this.levels.push({
            level: this.levels.length + 1,
            map: levelSprite,
            colliders: colliderSprites,
            mapWidth,
            mapHeight,
            boxSize: mapHeight / colliders.length
        })
    }

    loadLevel(n){
        const level = this.levels[n-1];
        if(!level) return;

        this.canvasScreen.registerObject(level.map);

        for(const collider of level.colliders){
            this.canvasScreen.registerObject(collider);
        }
    }

    getBoxCollider(n){
        const level = this.levels[n-1];
        if(!level) return;

        const colliders = []
        for(const collider of level.colliders){
            colliders.push({
                x: collider.posX,
                y: collider.posY,
                width: level.boxSize,
                height: level.boxSize
            })
        }

        return colliders;
    }
}