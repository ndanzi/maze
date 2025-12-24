/**
 * Maze Generator using Recursive Backtracking Algorithm
 * Generates a perfect maze (exactly one path between any two points)
 */

// Direction vectors: [dx, dy]
const DIRECTIONS = {
    UP: [0, -1],
    DOWN: [0, 1],
    LEFT: [-1, 0],
    RIGHT: [1, 0],
} as const;

type Direction = keyof typeof DIRECTIONS;

export interface Cell {
    x: number;
    y: number;
    walls: {
        top: boolean;
        bottom: boolean;
        left: boolean;
        right: boolean;
    };
    visited: boolean;
}

export interface Maze {
    cells: Cell[][];
    width: number;
    height: number;
    start: { x: number; y: number };
    end: { x: number; y: number };
}

/**
 * Creates a new maze grid with all walls intact
 */
function createGrid(width: number, height: number): Cell[][] {
    const grid: Cell[][] = [];

    for (let y = 0; y < height; y++) {
        const row: Cell[] = [];
        for (let x = 0; x < width; x++) {
            row.push({
                x,
                y,
                walls: {
                    top: true,
                    bottom: true,
                    left: true,
                    right: true,
                },
                visited: false,
            });
        }
        grid.push(row);
    }

    return grid;
}

/**
 * Gets the opposite wall for a given direction
 */
function getOppositeWall(direction: Direction): keyof Cell['walls'] {
    const opposites: Record<Direction, keyof Cell['walls']> = {
        UP: 'bottom',
        DOWN: 'top',
        LEFT: 'right',
        RIGHT: 'left',
    };
    return opposites[direction];
}

/**
 * Gets the wall name for a given direction
 */
function getWallForDirection(direction: Direction): keyof Cell['walls'] {
    const walls: Record<Direction, keyof Cell['walls']> = {
        UP: 'top',
        DOWN: 'bottom',
        LEFT: 'left',
        RIGHT: 'right',
    };
    return walls[direction];
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Recursive backtracking algorithm to carve the maze
 */
function carve(grid: Cell[][], x: number, y: number): void {
    grid[y][x].visited = true;

    // Get all directions in random order
    const directions = shuffle(Object.keys(DIRECTIONS) as Direction[]);

    for (const direction of directions) {
        const [dx, dy] = DIRECTIONS[direction];
        const newX = x + dx;
        const newY = y + dy;

        // Check if the new position is valid and not visited
        if (
            newX >= 0 &&
            newX < grid[0].length &&
            newY >= 0 &&
            newY < grid.length &&
            !grid[newY][newX].visited
        ) {
            // Remove walls between current and next cell
            grid[y][x].walls[getWallForDirection(direction)] = false;
            grid[newY][newX].walls[getOppositeWall(direction)] = false;

            // Recursively carve from the new cell
            carve(grid, newX, newY);
        }
    }
}

/**
 * Generates a random maze of the specified size
 * Start is always top-left, end is always bottom-right
 */
export function generateMaze(width: number, height: number): Maze {
    const grid = createGrid(width, height);

    // Start carving from top-left corner
    carve(grid, 0, 0);

    // Open entrance (top wall of start) and exit (bottom wall of end)
    grid[0][0].walls.top = false;
    grid[height - 1][width - 1].walls.bottom = false;

    return {
        cells: grid,
        width,
        height,
        start: { x: 0, y: 0 },
        end: { x: width - 1, y: height - 1 },
    };
}

/**
 * Checks if a player can move in a given direction from a cell
 */
export function canMove(
    maze: Maze,
    fromX: number,
    fromY: number,
    direction: Direction
): boolean {
    const cell = maze.cells[fromY]?.[fromX];
    if (!cell) return false;

    const wall = getWallForDirection(direction);
    return !cell.walls[wall];
}

/**
 * Gets the new position after moving in a direction
 */
export function getNewPosition(
    x: number,
    y: number,
    direction: Direction
): { x: number; y: number } {
    const [dx, dy] = DIRECTIONS[direction];
    return { x: x + dx, y: y + dy };
}
