/**
 * MazeRenderer Component
 * Renders the maze walls and floor using React Three Fiber
 */

import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

// Pastel color palette for garden theme
const COLORS = {
    grass: '#B8E6C1',      // Light mint green
    hedge: '#7CB587',       // Forest green for walls
    hedgeTop: '#8FC99A',    // Lighter top for 3D effect
    entrance: '#87CEEB',    // Sky blue
    exit: '#DDA0DD',        // Plum/violet
};

// Cell size in world units
const CELL_SIZE = 1;
const WALL_THICKNESS = 0.15;
const WALL_HEIGHT = 0.4;

interface WallData {
    key: string;
    position: [number, number, number];
    size: [number, number, number];
}

/**
 * Renders the maze grid with walls and special markers
 */
export function MazeRenderer() {
    const maze = useGameStore(state => state.maze);

    // Generate wall geometry data
    const walls = useMemo<WallData[]>(() => {
        if (!maze) return [];

        const wallList: WallData[] = [];

        for (let y = 0; y < maze.height; y++) {
            for (let x = 0; x < maze.width; x++) {
                const cell = maze.cells[y][x];
                const worldX = x * CELL_SIZE;
                const worldY = y * CELL_SIZE;

                // Top wall
                if (cell.walls.top) {
                    wallList.push({
                        key: `wall-${x}-${y}-top`,
                        position: [worldX + CELL_SIZE / 2, WALL_HEIGHT / 2, worldY],
                        size: [CELL_SIZE + WALL_THICKNESS, WALL_HEIGHT, WALL_THICKNESS],
                    });
                }

                // Left wall
                if (cell.walls.left) {
                    wallList.push({
                        key: `wall-${x}-${y}-left`,
                        position: [worldX, WALL_HEIGHT / 2, worldY + CELL_SIZE / 2],
                        size: [WALL_THICKNESS, WALL_HEIGHT, CELL_SIZE + WALL_THICKNESS],
                    });
                }

                // Right wall (only for rightmost column)
                if (x === maze.width - 1 && cell.walls.right) {
                    wallList.push({
                        key: `wall-${x}-${y}-right`,
                        position: [worldX + CELL_SIZE, WALL_HEIGHT / 2, worldY + CELL_SIZE / 2],
                        size: [WALL_THICKNESS, WALL_HEIGHT, CELL_SIZE + WALL_THICKNESS],
                    });
                }

                // Bottom wall (only for bottom row)
                if (y === maze.height - 1 && cell.walls.bottom) {
                    wallList.push({
                        key: `wall-${x}-${y}-bottom`,
                        position: [worldX + CELL_SIZE / 2, WALL_HEIGHT / 2, worldY + CELL_SIZE],
                        size: [CELL_SIZE + WALL_THICKNESS, WALL_HEIGHT, WALL_THICKNESS],
                    });
                }
            }
        }

        return wallList;
    }, [maze]);

    if (!maze) return null;

    const mazeWorldWidth = maze.width * CELL_SIZE;
    const mazeWorldHeight = maze.height * CELL_SIZE;

    return (
        <group>
            {/* Ground/grass plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mazeWorldWidth / 2, -0.01, mazeWorldHeight / 2]}>
                <planeGeometry args={[mazeWorldWidth + 2, mazeWorldHeight + 2]} />
                <meshStandardMaterial color={COLORS.grass} />
            </mesh>

            {/* Maze walls (hedges) */}
            {walls.map(wall => (
                <mesh key={wall.key} position={wall.position}>
                    <boxGeometry args={wall.size} />
                    <meshStandardMaterial color={COLORS.hedge} />
                </mesh>
            ))}

            {/* Entrance marker */}
            <mesh
                position={[
                    maze.start.x * CELL_SIZE + CELL_SIZE / 2,
                    0.01,
                    maze.start.y * CELL_SIZE + CELL_SIZE / 2
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[CELL_SIZE * 0.35, 32]} />
                <meshStandardMaterial color={COLORS.entrance} transparent opacity={0.7} />
            </mesh>

            {/* Exit marker */}
            <mesh
                position={[
                    maze.end.x * CELL_SIZE + CELL_SIZE / 2,
                    0.01,
                    maze.end.y * CELL_SIZE + CELL_SIZE / 2
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[CELL_SIZE * 0.35, 32]} />
                <meshStandardMaterial color={COLORS.exit} transparent opacity={0.7} />
            </mesh>
        </group>
    );
}
