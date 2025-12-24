/**
 * Player Component
 * Renders the player character (emoji) with smooth movement animation
 */

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

// Cell size must match MazeRenderer
const CELL_SIZE = 1;

// Animation settings
const MOVE_SPEED = 12; // Higher = faster snap
const BOUNCE_SPEED = 4;
const BOUNCE_HEIGHT = 0.05;

/**
 * Player character component
 * Uses emoji text rendered as a 3D sprite
 */
export function Player() {
    const playerPosition = useGameStore(state => state.playerPosition);
    const groupRef = useRef<THREE.Group>(null);
    const currentPosRef = useRef({ x: playerPosition.x, y: playerPosition.y });
    const bounceRef = useRef(0);

    // Animate position smoothly
    useFrame((_, delta) => {
        if (!groupRef.current) return;

        const targetX = playerPosition.x * CELL_SIZE + CELL_SIZE / 2;
        const targetZ = playerPosition.y * CELL_SIZE + CELL_SIZE / 2;

        // Smooth interpolation
        const currentX = groupRef.current.position.x;
        const currentZ = groupRef.current.position.z;

        const newX = THREE.MathUtils.lerp(currentX, targetX, delta * MOVE_SPEED);
        const newZ = THREE.MathUtils.lerp(currentZ, targetZ, delta * MOVE_SPEED);

        // Check if still moving
        const isMoving = Math.abs(targetX - currentX) > 0.01 || Math.abs(targetZ - currentZ) > 0.01;

        // Bounce animation while moving
        if (isMoving) {
            bounceRef.current += delta * BOUNCE_SPEED * Math.PI * 2;
            const bounce = Math.abs(Math.sin(bounceRef.current)) * BOUNCE_HEIGHT;
            groupRef.current.position.set(newX, 0.2 + bounce, newZ);
        } else {
            // Gentle idle bob
            bounceRef.current += delta * 2;
            const idleBob = Math.sin(bounceRef.current) * 0.02;
            groupRef.current.position.set(newX, 0.2 + idleBob, newZ);
        }

        // Update current position ref
        currentPosRef.current = { x: playerPosition.x, y: playerPosition.y };
    });

    // Initial position
    const initialX = playerPosition.x * CELL_SIZE + CELL_SIZE / 2;
    const initialZ = playerPosition.y * CELL_SIZE + CELL_SIZE / 2;

    return (
        <group ref={groupRef} position={[initialX, 0.2, initialZ]}>
            {/* Player emoji */}
            <Text
                fontSize={0.5}
                anchorX="center"
                anchorY="middle"
                rotation={[-Math.PI / 2, 0, 0]}
            >
                🐰
            </Text>
        </group>
    );
}
