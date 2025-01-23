import { CanvasScreen, Sprite } from "@jaymar921/2dgraphic-utils";
import { Blocks } from "../materials/Blocks";
import { Gradient } from "../materials/Gradient";
import { Terrain } from "../materials/Terrain";

export class MapGenerator {
    constructor(width = 5, height = 5, blockSize = 16, seed = 'default-seed', smoothnessFactor = 1) {
        this.width = width;
        this.height = height;
        this.blockSize = blockSize;
        this.blocks = [];
        this.chunks = [];
        this.smoothnessFactor = smoothnessFactor;


        // Initialize seeded RNG using LCG algorithm
        this.seed = this.stringToSeed(seed);
        this.rng = this.createLCGRNG(this.seed);

        this.perlinNoise = this.createPerlinNoise(width, height);
    }

    getSize() {
        return this.width * this.height;
    }

    // Convert a string seed into a numerical seed
    stringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
        }
        return hash;
    }

    // Create a seeded Linear Congruential Generator (LCG)
    createLCGRNG(seed) {
        const a = 1664525; // Multiplier
        const c = 1013904223; // Increment
        const m = 4294967296; // Modulus (2^32)

        let state = (seed ^ a) % m;

        return () => {
            state = (a * state + c) % m;
            return state / m; // Normalize to [0, 1]
        };
    }

    // Simple Perlin Noise generator using a 2D grid with seeded RNG
    createPerlinNoise(width, height) {
        const noise = [];
        for (let i = 0; i < width; i++) {
            noise[i] = [];
            for (let j = 0; j < height; j++) {
                // Use the seeded RNG for deterministic randomness
                noise[i][j] = this.rng();  // Use the LCG RNG
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

    generateChunks(){
        const { width, height, blockSize } = this;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Generate Perlin noise value, smoothed and scaled to [-1, 1]
                const random = this.randomGenerator(x, y).toFixed(1);
    
                let image = null;
                let biome = null;
    
                // Assign biomes and corresponding images based on the noise value
                if (random <= -0.6) {
                    biome = "Water";
                    image = Terrain.ocean;
                } else if (random <= -0.2) {
                    biome = "Sea";
                    image = Terrain.sea;
                } else if (random <= 0.2) {
                    biome = "Plains";
                    image = Terrain.plains;
                } else if (random <= 0.4) {
                    biome = "Forest";
                    image = Terrain.forrest;
                } else {
                    biome = "Mountain";
                    image = Terrain.mountain;
                }
                
                this.chunks.push({
                    biome: biome,
                    image: image,
                    x: x,
                    y: y,
                    pN: random
                });
            }
        }
    }

    generate() {
        this.generateChunks();
    
        // Iterate over each chunk
        for (const chunk of this.chunks) {
            const { biome, image, x, y, pN } = chunk;
    
            for (let localY = 0; localY < 16; localY++) {
                for (let localX = 0; localX < 16; localX++) {
                    const globalX = x * this.blockSize + localX;
                    const globalY = y * this.blockSize + localY;
    
                    // Calculate the interpolated noise value
                    const interpolatedPN = this.getInterpolatedValue(globalX, globalY, x, y);
    
                    // Determine the biome and corresponding image based on the interpolated noise value
                    let blockBiome = null;
                    let blockImage = null;
    
                    if (interpolatedPN <= -0.6) {
                        blockBiome = "Water";
                        blockImage = Terrain.ocean;
                    } else if (interpolatedPN <= -0.2) {
                        blockBiome = "Sea";
                        blockImage = Terrain.sea;
                    } else if (interpolatedPN <= 0) {
                        blockBiome = "Beach";
                        blockImage = Terrain.beach;
                    } else if (interpolatedPN <= 0.3) {
                        blockBiome = "Plains";
                        blockImage = Terrain.plains;
                    } else if (interpolatedPN <= 0.6) {
                        blockBiome = "Forest";
                        blockImage = Terrain.forrest;
                    } else {
                        blockBiome = "Mountain";
                        blockImage = Terrain.mountain;
                    }
    
                    // Create the sprite for the block
                    const spr = new Sprite({
                        objID: `block-${localX}-${localY}:${x}-${y}: I: ${interpolatedPN.toFixed(2)} | biome: ${biome}`,
                        name: `biome: ${blockBiome}`,
                        posX: globalX * this.blockSize,
                        posY: globalY * this.blockSize,
                        imageSource: blockImage,
                    });
    
                    this.blocks.push(spr);
                }
            }
        }
    }
    
    /**
 * Interpolates the noise value for a block based on neighboring chunks.
 * @param {number} globalX - The global X-coordinate of the block.
 * @param {number} globalY - The global Y-coordinate of the block.
 * @param {number} chunkX - The X-coordinate of the current chunk.
 * @param {number} chunkY - The Y-coordinate of the current chunk.
 * @returns {number} Interpolated noise value.
 */
    getInterpolatedValue(globalX, globalY, chunkX, chunkY) {
        const neighbors = [
            { dx: 0, dy: 0 },   // Current chunk
            { dx: -1, dy: 0 },  // Left
            { dx: 1, dy: 0 },   // Right
            { dx: 0, dy: -1 },  // Top
            { dx: 0, dy: 1 },   // Bottom
            { dx: -1, dy: -1 }, // Top-left
            { dx: 1, dy: -1 },  // Top-right
            { dx: -1, dy: 1 },  // Bottom-left
            { dx: 1, dy: 1 },   // Bottom-right
        ];

        let totalWeight = 0;
        let weightedSum = 0;

        for (const { dx, dy } of neighbors) {
            const neighborX = chunkX + dx;
            const neighborY = chunkY + dy;

            // Check if the neighbor chunk exists
            const neighborChunk = this.chunks.find(c => c.x === neighborX && c.y === neighborY);
            if (!neighborChunk) continue;

            // Calculate the center of the neighbor chunk
            const neighborCenterX = neighborChunk.x * this.blockSize + this.blockSize / 2;
            const neighborCenterY = neighborChunk.y * this.blockSize + this.blockSize / 2;

            // Calculate the distance from the global position to the neighbor chunk center
            const distance = Math.sqrt(
                Math.pow(globalX - neighborCenterX, 2) +
                Math.pow(globalY - neighborCenterY, 2)
            );

            // Use a Gaussian-like weight for smoother interpolation
            const weight = Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(this.smoothnessFactor, 2)));
            totalWeight += weight;
            weightedSum += weight * neighborChunk.pN;
        }

        // Avoid division by zero
        return totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    

    /**
     * 
     * @param {CanvasScreen} canvasScreen 
     */
    loadWorld(canvasScreen) {
        this.blocks.forEach(bk => canvasScreen.registerObject(bk));
    }
}

