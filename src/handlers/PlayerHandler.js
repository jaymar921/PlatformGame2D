import { Sprite } from "@jaymar921/2dgraphic-utils";
import jayIdle from "../assets/textures/sprites/Jay-idle.png";

export default class PlayerHandler {
    constructor(canvasScreen, position = { x: 0, y: 0 }) {
        this.canvasScreen = canvasScreen;
        this.position = position;
        this.colliders = [];

        this.player = null;
        this.target = { x: null, y: null };

        this.loadPlayer();
        this.canvasScreen.handleScreenClickedEvent(e => this.handleScreenTapEvent(e));

        setInterval(() => this.updatePlayer(), 30);
    }

    loadPlayer() {
        const player = new Sprite({
            objID: "Player-1",
            posX: this.position.x,
            posY: this.position.y,
            imageSource: jayIdle,
            frames: 12,
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
        if (this.target.x === null || this.target.y === null) return;

        const player = this.player;
        const speed = 1; // Movement speed

        let dx = this.target.x - (player.posX + player.width / 2);
        let dy = this.target.y - (player.posY + player.height / 2);
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

        // Move player
        player.posX += moveX;
        this.checkForHorizontalCollision();
        
        player.posY += moveY;
        this.checkForVerticalCollision();
    }

    checkForHorizontalCollision() {
        const player = this.player;

        for (const collider of this.colliders) {
            const { x, y, width, height } = collider;

            if (
                player.posX + player.width > x && // Right side collision
                player.posX < x + width && // Left side collision
                player.posY + player.height > y && // Bottom collision
                player.posY < y + height // Top collision
            ) {
                if (player.posX + player.width / 2 < x + width / 2) {
                    // Moving right
                    player.posX = x - player.width;
                } else {
                    // Moving left
                    player.posX = x + width;
                }
            }
        }
    }

    checkForVerticalCollision() {
        const player = this.player;

        for (const collider of this.colliders) {
            const { x, y, width, height } = collider;

            if (
                player.posX + player.width > x && // Right collision
                player.posX < x + width && // Left collision
                player.posY + player.height > y && // Bottom collision
                player.posY < y + height // Top collision
            ) {
                if (player.posY + player.height / 2 < y + height / 2) {
                    // Moving down
                    player.posY = y - player.height;
                } else {
                    // Moving up
                    player.posY = y + height;
                }
            }
        }
    }
}
