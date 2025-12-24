/**
 * CollectEffect Component
 * Shows visual effects when collecting items (floating score, particles)
 */

import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGameStore, type CollectEffect as CollectEffectData } from '../store/gameStore';

// Cell size must match MazeRenderer
const CELL_SIZE = 1;

// Effect settings
const EFFECT_DURATION = 1000; // ms
const RISE_SPEED = 1.5;
const SCALE_START = 1.2;
const SCALE_END = 0.5;

/**
 * Single collect effect with floating text and fade out
 */
function SingleEffect({ effect }: { effect: CollectEffectData }) {
    const groupRef = useRef<THREE.Group>(null);
    const textRef = useRef<THREE.Mesh>(null);
    const clearCollectEffect = useGameStore(state => state.clearCollectEffect);
    const startTime = useRef(Date.now());

    // Auto-remove after duration
    useEffect(() => {
        const timer = setTimeout(() => {
            clearCollectEffect(effect.id);
        }, EFFECT_DURATION);

        return () => clearTimeout(timer);
    }, [effect.id, clearCollectEffect]);

    // Animate the effect
    useFrame(() => {
        if (!groupRef.current || !textRef.current) return;

        const elapsed = Date.now() - startTime.current;
        const progress = Math.min(elapsed / EFFECT_DURATION, 1);

        // Rise up
        groupRef.current.position.y = 0.5 + progress * RISE_SPEED;

        // Scale down
        const scale = THREE.MathUtils.lerp(SCALE_START, SCALE_END, progress);
        groupRef.current.scale.setScalar(scale);

        // Fade out
        const material = textRef.current.material as THREE.MeshBasicMaterial;
        if (material && 'opacity' in material) {
            material.opacity = 1 - progress;
        }
    });

    const worldX = effect.x * CELL_SIZE + CELL_SIZE / 2;
    const worldZ = effect.y * CELL_SIZE + CELL_SIZE / 2;

    return (
        <group ref={groupRef} position={[worldX, 0.5, worldZ]}>
            <Text
                ref={textRef}
                fontSize={0.3}
                anchorX="center"
                anchorY="middle"
                rotation={[-Math.PI / 2, 0, 0]}
                color="#FFD700"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {`+${effect.points}`}
                <meshBasicMaterial transparent />
            </Text>
        </group>
    );
}

/**
 * Renders all active collect effects
 */
export function CollectEffects() {
    const collectEffects = useGameStore(state => state.collectEffects);

    return (
        <group>
            {collectEffects.map(effect => (
                <SingleEffect key={effect.id} effect={effect} />
            ))}
        </group>
    );
}
