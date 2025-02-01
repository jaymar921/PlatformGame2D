import { Sprite, SpriteType } from "@jaymar921/2dgraphic-utils";

export default class Player extends Sprite{
    constructor({objID, name, posX, posY, width, height, imageSource, animations, frames = 1, frameBuffer = 3, loop = true, autoPlay = true, scale=1, imageSmoothingEnabled = false, type = SpriteType.OBJECT, hitbox}) {
        super({objID, name, posX, posY, width, height, imageSource, animations, frames, frameBuffer, loop, autoPlay, scale, imageSmoothingEnabled, type});
        this.hitbox = hitbox;
    }

    getHitbox(){
        const hb = {
            x: this.posX,
            y: this.posY,
            width: this.width,
            height: this.height
        }
        if(!this.hitbox) return hb;

        // hitbox left
        hb.x = this.posX + (this.hitbox.offsetX ?? this.hitbox.x);
        // hitbox right
        hb.width = this.hitbox.width;
        // hitbox top
        hb.y = this.posY + (this.hitbox.offsetY ?? this.hitbox.y);
        // hitbox bottom
        hb.height = this.hitbox.height;

        return hb;
    }
}