import { Sprite, SpriteType } from "@jaymar921/2dgraphic-utils";
import { Blocks } from "../materials/Blocks";

export class LevelGenerator{
    constructor(canvasScreen, textureMap, textureSize = 16) {
        this.textureMap = textureMap ?? {};
        this.textureSize = textureSize;
        this.canvasScreen = canvasScreen;

        if(canvasScreen){
            canvasScreen.handleScreenClickedEvent((e) => {this.replaceObject(e, canvasScreen)})
        }
    }

    loadLevel(level = []){
        for(let y = 0; y < level.length; y++){
            for(let x = 0; x < level[y].length; x++){

                // coordinates
                const posX = x * this.textureSize;
                const posY = y * this.textureSize;

                // get texture mapped
                const texture = this.textureMap[level[y][x]];

                if(!texture) continue;

                const sprite = new Sprite({
                    objID: `x-${posX},y-${posY}`,
                    name: texture,
                    imageSource: texture,
                    posX: posX,
                    posY: posY
                })

                this.canvasScreen.registerObject(sprite)
            }
        }
    }

    replaceObject(event, canvasScreen){
        const { objID, layers, type } = event;

        if(type === SpriteType.AIR) return;

        const layer = layers[0];
        if(!layer || !layer.sprite) return;

        canvasScreen.unregisterObject(objID);
        const newSprite = new Sprite({
            objID: `x-${layer.sprite.posX},y-${layer.sprite.posY}`,
            name: Blocks.Stone.img,
            imageSource: Blocks.Stone.img,
            posX: layer.sprite.posX,
            posY: layer.sprite.posY,
            width: this.textureSize,
            height: this.textureSize
        });
        canvasScreen.registerObject(newSprite)

        console.log("added", newSprite)
    }
}