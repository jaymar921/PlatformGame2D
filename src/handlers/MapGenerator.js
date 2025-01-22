import { CanvasScreen, Sprite } from "@jaymar921/2dgraphic-utils";
import { Blocks } from "../materials/Blocks";

export class MapGenerator{
    constructor(width = 5, height = 5, blockSize = 16) {
        this.width = width;
        this.height = height;
        this.blockSize = blockSize;
        this.blocks = [];
    }

    getSize(){
        return this.width * this.height;
    }

    generate(){
        const {width, height, blockSize} = this;

        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                // Cobblestone Texture for now
                const spr = new Sprite({
                    objID: `block-${Blocks.Grass.id}:${x}-${y}`,
                    name: Blocks.Grass.name,
                    posX: x * blockSize,
                    posY: y * blockSize,
                    imageSource: Blocks.Grass.img
                })

                this.blocks.push(spr);
            }
        }
    }

    /**
     * 
     * @param {CanvasScreen} canvasScreen 
     */
    loadWorld(canvasScreen){
        this.blocks.forEach(bk => canvasScreen.registerObject(bk));
    }
}