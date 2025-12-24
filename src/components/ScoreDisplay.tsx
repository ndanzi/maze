/**
 * ScoreDisplay Component
 * Shows current level, collected items, and total score
 */

import { useGameStore } from '../store/gameStore';

/**
 * HUD overlay showing game progress
 */
export function ScoreDisplay() {
    const level = useGameStore(state => state.level);
    const score = useGameStore(state => state.score);

    return (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            {/* Level indicator */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                <span className="text-lg font-bold text-emerald-700">
                    Livello {level}
                </span>
            </div>

            {/* Collectibles count */}
            <div className="flex gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg flex items-center gap-1">
                    <span className="text-xl">⭐</span>
                    <span className="text-lg font-bold text-amber-600">{score.stars}</span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg flex items-center gap-1">
                    <span className="text-xl">🪙</span>
                    <span className="text-lg font-bold text-yellow-600">{score.coins}</span>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg flex items-center gap-1">
                    <span className="text-xl">💖</span>
                    <span className="text-lg font-bold text-pink-500">{score.hearts}</span>
                </div>
            </div>

            {/* Total score */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                <span className="text-lg font-bold text-purple-600">
                    {score.total} pts
                </span>
            </div>
        </div>
    );
}
