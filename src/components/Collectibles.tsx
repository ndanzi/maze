/**
 * Collectibles Component
 * Renders all collectible items (stars, coins, hearts) in the maze
 */

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import type { Collectible } from '../utils/collectiblePlacer';

// Cell size must match MazeRenderer
const CELL_SIZE = 1;

// Animation settings
const BOB_SPEED = 2;
const BOB_HEIGHT = 0.08;
const ROTATE_SPEED = 1;

/**
 * Single collectible item with floating animation
 */
function CollectibleItem({ collectible }: { collectible: Collectible }) {
    const groupRef = useRef<THREE.Group>(null);
    const startOffset = useRef(Math.random() * Math.PI * 2);

    // Animate bobbing and rotation
    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime + startOffset.current;

        // Bobbing motion
        const bob = Math.sin(time * BOB_SPEED) * BOB_HEIGHT;
        groupRef.current.position.y = 0.25 + bob;

        // Slow rotation
        groupRef.current.rotation.z = Math.sin(time * ROTATE_SPEED) * 0.2;
    });

    const worldX = collectible.x * CELL_SIZE + CELL_SIZE / 2;
    const worldZ = collectible.y * CELL_SIZE + CELL_SIZE / 2;

    return (
        <group ref={groupRef} position={[worldX, 0.25, worldZ]}>
            <Text
                fontSize={0.35}
                anchorX="center"
                anchorY="middle"
                rotation={[-Math.PI / 2, 0, 0]}
            >
                {collectible.emoji}
            </Text>
        </group>
    );
}

/**
 * Renders all collectibles in the maze
 */
export function Collectibles() {
    const collectibles = useGameStore(state => state.collectibles);

    return (
        <group>
            {collectibles.map(collectible => (
                <CollectibleItem key={collectible.id} collectible={collectible} />
            ))}
        </group>
    );
}
