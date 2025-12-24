/**
 * Keyboard Controls Hook
 * Handles arrow keys and WASD input for player movement
 */

import { useCallback, useEffect, useRef } from 'react';
import { useGameStore, type ControlScheme, type Direction } from '../store/gameStore';

// Key mappings for each control scheme
const KEY_MAPPINGS: Record<ControlScheme, Record<string, Direction>> = {
    arrows: {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
    },
    wasd: {
        KeyW: 'UP',
        KeyS: 'DOWN',
        KeyA: 'LEFT',
        KeyD: 'RIGHT',
    },
};

// Movement repeat interval in ms (when holding key)
const MOVE_INTERVAL = 150;

/**
 * Custom hook that handles keyboard input for player movement
 * Supports both single press and continuous movement when key is held
 */
export function useKeyboardControls() {
    const movePlayer = useGameStore(state => state.movePlayer);
    const controlScheme = useGameStore(state => state.controlScheme);
    const isLevelComplete = useGameStore(state => state.isLevelComplete);

    // Track currently held keys
    const heldKeysRef = useRef<Set<string>>(new Set());
    const intervalRef = useRef<number | null>(null);

    // Get direction from key code
    const getDirection = useCallback((code: string): Direction | null => {
        // Check current control scheme first
        const primary = KEY_MAPPINGS[controlScheme][code];
        if (primary) return primary;

        // Also allow the other control scheme (for flexibility)
        const secondary = KEY_MAPPINGS[controlScheme === 'arrows' ? 'wasd' : 'arrows'][code];
        return secondary || null;
    }, [controlScheme]);

    // Process held keys and move
    const processHeldKeys = useCallback(() => {
        if (isLevelComplete) return;

        for (const code of heldKeysRef.current) {
            const direction = getDirection(code);
            if (direction) {
                movePlayer(direction);
                break; // Only process one direction at a time
            }
        }
    }, [getDirection, movePlayer, isLevelComplete]);

    // Handle key down
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const direction = getDirection(event.code);
        if (!direction) return;

        // Prevent default to stop page scrolling with arrow keys
        event.preventDefault();

        // If this key is not already held, move immediately
        if (!heldKeysRef.current.has(event.code)) {
            heldKeysRef.current.add(event.code);
            movePlayer(direction);

            // Start continuous movement if not already started
            if (intervalRef.current === null) {
                intervalRef.current = window.setInterval(processHeldKeys, MOVE_INTERVAL);
            }
        }
    }, [getDirection, movePlayer, processHeldKeys]);

    // Handle key up
    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        heldKeysRef.current.delete(event.code);

        // Stop interval if no keys are held
        if (heldKeysRef.current.size === 0 && intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Set up event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);

            // Clean up interval on unmount
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [handleKeyDown, handleKeyUp]);

    // Clear held keys when level completes
    useEffect(() => {
        if (isLevelComplete) {
            heldKeysRef.current.clear();
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [isLevelComplete]);
}
