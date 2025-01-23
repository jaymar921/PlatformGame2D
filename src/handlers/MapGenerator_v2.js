import { Sprite } from "@jaymar921/2dgraphic-utils";
import { Terrain } from "../materials/Terrain";

export class MapGeneratorV2{
    constructor(width, height, scale, seed) {
        this.width = width;
        this.height = height;
        this.scale = scale;

        // Initialize seeded RNG using LCG algorithm
        this.seed = this.stringToSeed(seed);
        this.rng = this.createLCGRNG(this.seed);

        this.noiseMap = [];

        this.perlinNoise = this.createPerlinNoise(width, height);
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

    inverseLerp(a, b, value) {
        if (a !== b) {
            return (value - a) / (b - a);
        } else {
            return 0; // or handle the case where a == b as needed
        }
    }
    
    generateNoiseMap(octaves = 1, persistance = 1, lacunarity = 1) {
        const mapWidth = this.width;
        const mapHeight = this.height;
        let scale = this.scale;
        let noiseMap = [];
    
        if (scale <= 0) scale = 0.001;
        if (lacunarity < 1) lacunarity = 1;
        if (octaves < 0) octaves = 1;
        if (persistance < 0) persistance = 0;
        if (persistance > 1) persistance = 1;
    
        let maxNoiseHeight = -Infinity; // Corrected initialization
        let minNoiseHeight = Infinity;  // Corrected initialization
    
        for (let y = 0; y < mapHeight; y++) {
            noiseMap[y] = [];
            for (let x = 0; x < mapWidth; x++) {
                let amplitude = 1;
                let frequency = 1;
                let noiseHeight = 0;
    
                for (let i = 0; i < octaves; i++) {
                    let sampleX = x / scale * frequency;
                    let sampleY = y / scale * frequency;
    
                    let perlinValue = this.randomGenerator(sampleX, sampleY);
                    noiseHeight += perlinValue * amplitude;
    
                    amplitude *= persistance;
                    frequency *= lacunarity;
                }
    
                // Update max and min noise heights
                if (noiseHeight > maxNoiseHeight) {
                    maxNoiseHeight = noiseHeight;
                }
                if (noiseHeight < minNoiseHeight) {
                    minNoiseHeight = noiseHeight;
                }
    
                noiseMap[y][x] = noiseHeight;
            }
        }
    
        // Normalize the noise map
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const normalizedValue = this.inverseLerp(minNoiseHeight, maxNoiseHeight, noiseMap[y][x]);
                noiseMap[y][x] = normalizedValue;
            }
        }
    
        this.noiseMap = noiseMap;
    }

    generateMap(canvasScreen){
        this.generateNoiseMap(5, 0.5, 2)

        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const currentHeight = this.noiseMap[y][x];
                
                let blockImage = Terrain.ocean;
                if(currentHeight <= 0.2){
                    blockImage = Terrain.ocean;
                }else if(currentHeight <= 0.4){
                    blockImage = Terrain.sea;
                }else if(currentHeight <= 0.5){
                    blockImage = Terrain.beach;
                }else if(currentHeight <= 0.5){
                    blockImage = Terrain.plains;
                }else if(currentHeight <= 0.7){
                    blockImage = Terrain.forrest;
                }else if(currentHeight <= 1){
                    blockImage = Terrain.mountain;
                }
                
                this.createSprite(canvasScreen, x, y, blockImage, currentHeight.toFixed(2))
            }
        }
    }

    createSprite(canvasScreen, posX, posY, image, currentHeight){
        const sprite = new Sprite({
            objID: `${posX}-${posY} | ${currentHeight}`,
            name: image,
            posX: posX * 16,
            posY: posY * 16,
            imageSource: image
        })

        canvasScreen.registerObject(sprite)
    }
}