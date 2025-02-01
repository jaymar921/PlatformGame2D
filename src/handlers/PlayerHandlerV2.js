import { Sprite, SpriteType } from "@jaymar921/2dgraphic-utils";
import jayIdleLeft from "../assets/textures/sprites/Jay-idle-left.png";
import jayIdleRight from "../assets/textures/sprites/Jay-idle-right.png";
import jayWalkLeft from "../assets/textures/sprites/Jay-walk-left.png";
import jayWalkRight from "../assets/textures/sprites/Jay-walk-right.png";
import Player from "../objects/Player";

export default class PlayerHandler {
    constructor(canvasScreen, position = { x: 0, y: 0 }) {
        this.canvasScreen = canvasScreen;
        this.position = position;
        this.colliders = [];

        this.player = null;
        this.target = { x: null, y: null };
        this.prevDirection = "left";
        this.callbacks = [];

        this.loadPlayer();
        this.canvasScreen.handleScreenClickedEvent(e => this.handleScreenTapEvent(e));

        setInterval(() => this.updatePlayer(), 30);
    }

    addPlayerMoveEvent(callback){
        this.callbacks.push(callback);
    }

    loadPlayer() {
        const player = new Player({
            objID: "Player-1",
            type: SpriteType.PLAYER,
            posX: this.position.x,
            posY: this.position.y,
            imageSource: jayIdleLeft,
            frames: 12,
            animations: {
                walkLeft: {
                    frames: 6,
                    imageSource: jayWalkLeft
                },
                walkRight: {
                    frames: 6,
                    imageSource: jayWalkRight
                }
                ,jayIdleLeft: {
                    frames: 12,
                    imageSource: jayIdleLeft
                },
                jayIdleRight: {
                    frames: 12,
                    imageSource: jayIdleRight
                },
            },
            hitbox: {
                x: 8,
                width: 16,
                y: 10,
                height: 22
            }
        });

        this.canvasScreen.registerObject(player);
        this.player = player;

    }

    addColliders(colliders = []) {
        this.colliders.push(...colliders);
    }

    handleScreenTapEvent(e) {
        this.target.x = e.mousePosition.x;
        this.target.y = e.mousePosition.y;
    }

    updatePlayer() {
        const player = this.player;
        if (this.target.x === null || this.target.y === null){
            if(this.prevDirection === "left")
                player.switchAnimation("jayIdleLeft")
            else
                player.switchAnimation("jayIdleRight")
            return;
        }

        const speed = 1; // Movement speed

        const hitbox = player.getHitbox();

        let dx = this.target.x - (hitbox.x + hitbox.width / 2);
        let dy = this.target.y - (hitbox.y + hitbox.height / 2);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < speed) {
            // Stop moving if close to target
            this.target.x = null;
            this.target.y = null;
            return;
        }

        // Normalize movement vector
        let moveX = (dx / distance) * speed;
        let moveY = (dy / distance) * speed;

        if(moveX < 0){
            this.prevDirection = "left";
            player.switchAnimation("walkLeft");
        }
        else if(moveX > 0){
            this.prevDirection = "right";
            player.switchAnimation("walkRight");
        }
        // Move player
        player.posX += moveX;
        this.checkForHorizontalCollision(["id-1"]);
        
        player.posY += moveY;
        this.checkForVerticalCollision(["id-1"]);

        // if player collide with a specific collision block id
        const collisionId = this.checkAllDirectionCollision(["id-2", "id-3", "id-4"]);
        for(const cbks of this.callbacks) cbks({
            collisionId: collisionId,
            position: { x: player.posX, y: player.posY }
        })
    }

    checkAllDirectionCollision(colliderIds = []) {
        const player = this.player;
        const hitbox = player.getHitbox();

        for (const collider of this.colliders) {
            const { x, y, width, height } = collider;

            if (
                hitbox.x + hitbox.width > x && // Right side collision
                hitbox.x < x + width && // Left side collision
                hitbox.y + hitbox.height > y && // Bottom collision
                hitbox.y < y + height // Top collision
            ) {
                if(!colliderIds.includes(collider.name)) continue;
                
                return collider.name;
            }
        }
        return null;
    }

    checkForHorizontalCollision(colliderIds = []) {
        const player = this.player;
        const hitbox = player.getHitbox();

        for (const collider of this.colliders) {
            const { x, y, width, height } = collider;

            if (
                hitbox.x + hitbox.width > x && // Right side collision
                hitbox.x < x + width && // Left side collision
                hitbox.y + hitbox.height > y && // Bottom collision
                hitbox.y < y + height // Top collision
            ) {
                if(!colliderIds.includes(collider.name)) continue;

                if (hitbox.x + hitbox.width / 2 < x + width / 2) {
                    //Moving right
                    player.posX = x - hitbox.width - player.hitbox.x;
                } else {
                    //Moving left
                    player.posX = x + width - player.hitbox.x;
                }
            }
        }
    }

    checkForVerticalCollision(colliderIds = []) {
        const player = this.player;

        const hitbox = player.getHitbox();

        for (const collider of this.colliders) {
            const { x, y, width, height } = collider;

            if (
                hitbox.x + hitbox.width > x && // Right side collision
                hitbox.x < x + width && // Left side collision
                hitbox.y + hitbox.height > y && // Bottom collision
                hitbox.y < y + height // Top collision
            ) {
                if(!colliderIds.includes(collider.name)) continue;

                if (hitbox.y + hitbox.height / 2 < y + height / 2) {
                    // Moving down
                    player.posY = y - hitbox.height - player.hitbox.y;
                } else {
                    // Moving up
                    player.posY = y + height - player.hitbox.y;
                }
            }
        }
    }
}
