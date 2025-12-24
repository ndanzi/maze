/**
 * Game Component
 * Main game container with React Three Fiber canvas and UI overlays
 */

import { OrthographicCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useGameStore } from '../store/gameStore';
import { CollectEffects } from './CollectEffect';
import { Collectibles } from './Collectibles';
import { ControlToggle } from './ControlToggle';
import { LevelComplete } from './LevelComplete';
import { MazeRenderer } from './MazeRenderer';
import { Player } from './Player';
import { ScoreDisplay } from './ScoreDisplay';

/**
 * 3D Scene content
 */
function Scene() {
    const maze = useGameStore(state => state.maze);

    if (!maze) return null;

    // Calculate camera position to center on maze
    const centerX = maze.width / 2;
    const centerZ = maze.height / 2;
    // Zoom based on maze size - larger maze = smaller zoom
    const zoom = Math.min(50, 600 / maze.width);

    return (
        <>
            {/* Orthographic camera for 2D-like view - looking straight down */}
            <OrthographicCamera
                makeDefault
                position={[centerX, 20, centerZ + 0.001]} // Tiny offset to avoid gimbal lock
                zoom={zoom}
                near={0.1}
                far={100}
                rotation={[-Math.PI / 2, 0, 0]} // Look straight down
            />

            {/* Lighting */}
            <ambientLight intensity={0.9} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={0.5}
            />

            {/* Game elements */}
            <MazeRenderer />
            <Collectibles />
            <CollectEffects />
            <Player />
        </>
    );
}

/**
 * Main Game component
 */
export function Game() {
    const initGame = useGameStore(state => state.initGame);
    const maze = useGameStore(state => state.maze);

    // Use keyboard controls hook
    useKeyboardControls();

    // Initialize game on mount
    useEffect(() => {
        initGame();
    }, [initGame]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-b from-sky-200 to-sky-100">
            {/* R3F Canvas */}
            <Canvas>
                <Scene />
            </Canvas>

            {/* UI Overlays */}
            {maze && (
                <>
                    <ScoreDisplay />
                    <ControlToggle />
                    <LevelComplete />
                </>
            )}

            {/* Loading state */}
            {!maze && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl font-bold text-emerald-600 animate-pulse">
                        Caricamento...
                    </div>
                </div>
            )}
        </div>
    );
}
