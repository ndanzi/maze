/**
 * Collectible Placer
 * Places stars, coins, and hearts throughout the maze
 */

import type { Maze } from './mazeGenerator';

export type CollectibleType = 'star' | 'coin' | 'heart';

export interface Collectible {
    id: string;
    type: CollectibleType;
    x: number;
    y: number;
    points: number;
    emoji: string;
}

// Points for each collectible type
const COLLECTIBLE_CONFIG: Record<CollectibleType, { points: number; emoji: string }> = {
    star: { points: 10, emoji: '⭐' },
    coin: { points: 25, emoji: '🪙' },
    heart: { points: 50, emoji: '💖' },
};

// Collectible count per level
interface LevelConfig {
    stars: number;
    coins: number;
    hearts: number;
}

/**
 * Gets the collectible configuration for a given level
 */
export function getCollectibleCountForLevel(level: number): LevelConfig {
    // Base counts, increasing slightly with level
    const baseStars = 5;
    const baseCoins = 3;
    const baseHearts = 1;

    return {
        stars: Math.min(baseStars + Math.floor(level / 2), 10),
        coins: Math.min(baseCoins + Math.floor(level / 2), 6),
        hearts: Math.min(baseHearts + Math.floor(level / 3), 3),
    };
}

/**
 * Generates a unique ID for a collectible
 */
function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Places collectibles throughout the maze
 * Avoids start and end positions
 */
export function placeCollectibles(maze: Maze, level: number): Collectible[] {
    const collectibles: Collectible[] = [];
    const config = getCollectibleCountForLevel(level);

    // Get all valid positions (not start or end)
    const validPositions: { x: number; y: number }[] = [];

    for (let y = 0; y < maze.height; y++) {
        for (let x = 0; x < maze.width; x++) {
            // Skip start and end positions
            if (
                (x === maze.start.x && y === maze.start.y) ||
                (x === maze.end.x && y === maze.end.y)
            ) {
                continue;
            }
            validPositions.push({ x, y });
        }
    }

    // Shuffle positions for random placement
    const shuffled = validPositions.sort(() => Math.random() - 0.5);

    let positionIndex = 0;

    // Helper to add collectibles
    const addCollectibles = (type: CollectibleType, count: number) => {
        for (let i = 0; i < count && positionIndex < shuffled.length; i++) {
            const pos = shuffled[positionIndex++];
            const { points, emoji } = COLLECTIBLE_CONFIG[type];

            collectibles.push({
                id: generateId(),
                type,
                x: pos.x,
                y: pos.y,
                points,
                emoji,
            });
        }
    };

    // Add collectibles (hearts first as they're rarer, then coins, then stars)
    addCollectibles('heart', config.hearts);
    addCollectibles('coin', config.coins);
    addCollectibles('star', config.stars);

    return collectibles;
}
