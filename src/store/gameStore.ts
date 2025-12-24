/**
 * Game Store - Zustand state management for Maze Garden
 */

import { create } from 'zustand';
import { placeCollectibles, type Collectible } from '../utils/collectiblePlacer';
import { canMove, generateMaze, getNewPosition, type Maze } from '../utils/mazeGenerator';

// Direction type matching keyboard input
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Control scheme options
export type ControlScheme = 'arrows' | 'wasd';

// Score tracking
interface Score {
    stars: number;
    coins: number;
    hearts: number;
    total: number;
}

// Collect effect for animations
export interface CollectEffect {
    id: string;
    x: number;
    y: number;
    points: number;
    emoji: string;
    timestamp: number;
}

// Game state interface
export interface GameState {
    // Maze data
    maze: Maze | null;

    // Player
    playerPosition: { x: number; y: number };

    // Collectibles
    collectibles: Collectible[];

    // Score
    score: Score;

    // Level
    level: number;
    isLevelComplete: boolean;

    // Controls
    controlScheme: ControlScheme;

    // Effects
    collectEffects: CollectEffect[];

    // Actions
    initGame: () => void;
    movePlayer: (direction: Direction) => void;
    nextLevel: () => void;
    resetGame: () => void;
    toggleControls: () => void;
    clearCollectEffect: (id: string) => void;
}

/**
 * Gets maze size based on level
 * Starts at 12x12, increases every 2 levels, max 20x20
 */
function getMazeSizeForLevel(level: number): number {
    const baseSize = 12;
    const increment = Math.floor((level - 1) / 2) * 2;
    return Math.min(baseSize + increment, 20);
}

/**
 * Creates the game store with all state and actions
 */
export const useGameStore = create<GameState>((set, get) => ({
    // Initial state
    maze: null,
    playerPosition: { x: 0, y: 0 },
    collectibles: [],
    score: { stars: 0, coins: 0, hearts: 0, total: 0 },
    level: 1,
    isLevelComplete: false,
    controlScheme: 'arrows',
    collectEffects: [],

    // Initialize/reset the game for current level
    initGame: () => {
        const { level } = get();
        const size = getMazeSizeForLevel(level);
        const maze = generateMaze(size, size);
        const collectibles = placeCollectibles(maze, level);

        set({
            maze,
            playerPosition: { ...maze.start },
            collectibles,
            isLevelComplete: false,
            collectEffects: [],
        });
    },

    // Move player in a direction
    movePlayer: (direction: Direction) => {
        const { maze, playerPosition, collectibles, score, isLevelComplete } = get();

        // Don't move if level is complete or no maze
        if (!maze || isLevelComplete) return;

        // Check if movement is valid
        if (!canMove(maze, playerPosition.x, playerPosition.y, direction)) return;

        // Get new position
        const newPos = getNewPosition(playerPosition.x, playerPosition.y, direction);

        // Check for collectible at new position
        const collected = collectibles.find(c => c.x === newPos.x && c.y === newPos.y);

        let newScore = score;
        let newCollectibles = collectibles;
        let newEffects = get().collectEffects;

        if (collected) {
            // Update score
            const scoreUpdate = { ...score };
            scoreUpdate[collected.type === 'star' ? 'stars' : collected.type === 'coin' ? 'coins' : 'hearts']++;
            scoreUpdate.total += collected.points;
            newScore = scoreUpdate;

            // Remove collected item
            newCollectibles = collectibles.filter(c => c.id !== collected.id);

            // Add collect effect
            const effect: CollectEffect = {
                id: `effect-${Date.now()}`,
                x: newPos.x,
                y: newPos.y,
                points: collected.points,
                emoji: collected.emoji,
                timestamp: Date.now(),
            };
            newEffects = [...newEffects, effect];
        }

        // Check if reached end
        const reachedEnd = newPos.x === maze.end.x && newPos.y === maze.end.y;

        set({
            playerPosition: newPos,
            collectibles: newCollectibles,
            score: newScore,
            isLevelComplete: reachedEnd,
            collectEffects: newEffects,
        });
    },

    // Advance to next level
    nextLevel: () => {
        set(state => ({ level: state.level + 1 }));
        get().initGame();
    },

    // Reset game to level 1
    resetGame: () => {
        set({
            level: 1,
            score: { stars: 0, coins: 0, hearts: 0, total: 0 },
        });
        get().initGame();
    },

    // Toggle between arrow keys and WASD
    toggleControls: () => {
        set(state => ({
            controlScheme: state.controlScheme === 'arrows' ? 'wasd' : 'arrows',
        }));
    },

    // Clear a collect effect after animation
    clearCollectEffect: (id: string) => {
        set(state => ({
            collectEffects: state.collectEffects.filter(e => e.id !== id),
        }));
    },
}));
