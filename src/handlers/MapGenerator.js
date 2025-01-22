import { CanvasScreen, Sprite } from "@jaymar921/2dgraphic-utils";
import { Blocks } from "../materials/Blocks";
import { Gradient } from "../materials/Gradient";

export class MapGenerator {
    constructor(width = 5, height = 5, blockSize = 16) {
        this.width = width;
        this.height = height;
        this.blockSize = blockSize;
        this.blocks = [];

        this.perlinNoise = this.createPerlinNoise(width, height);
    }

    getSize() {
        return this.width * this.height;
    }

    // Simple Perlin Noise generator using a 2D grid
    createPerlinNoise(width, height) {
        const noise = [];
        for (let i = 0; i < width; i++) {
            noise[i] = [];
            for (let j = 0; j < height; j++) {
                noise[i][j] = (Math.random());
            }
        }
        return noise;
        
    }

    // Simple Smoothstep function
    smoothstep(t) {
        return t * t * (3 - 2 * t);
    }

    // Using Perlin Noise with Smoothstep
    randomGenerator(x, y) {
        const noiseValue = this.perlinNoise[x % this.width][y % this.height];
        const smoothedValue = this.smoothstep(noiseValue); // Apply smoothstep for smoother transition
        return smoothedValue * 2 - 1; // Map it to the range of -1 to 1
    }

    generate() {
        const { width, height, blockSize } = this;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Generate perlin noise with smoothstep
                const random = this.randomGenerator(x, y).toFixed(1);

                let image = null;

                if(random <= - 0.8) image = Gradient[10]
                else if(random <= - 0.6) image = Gradient[9]
                else if(random <= - 0.4) image = Gradient[8]
                else if(random <= - 0.2) image = Gradient[7]
                else if(random <= 0) image = Gradient[6]
                else if(random <= 0.2) image = Gradient[5]
                else if(random <= 0.4) image = Gradient[4]
                else if(random <= 0.6) image = Gradient[3]
                else if(random <= 0.8) image = Gradient[2]
                else image = Gradient[1]

                const spr = new Sprite({
                    objID: `block-${Blocks.Grass.id}:${x}-${y}`,
                    name: Blocks.Grass.name,
                    posX: x * blockSize,
                    posY: y * blockSize,
                    imageSource: image,
                });

                this.blocks.push(spr);
            }
        }
    }

    /**
     * 
     * @param {CanvasScreen} canvasScreen 
     */
    loadWorld(canvasScreen) {
        this.blocks.forEach(bk => canvasScreen.registerObject(bk));
    }
}
