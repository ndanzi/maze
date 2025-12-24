/**
 * LevelComplete Component
 * Victory screen with confetti animation
 */

import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

// Confetti particle type
interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
}

// Pastel confetti colors
const CONFETTI_COLORS = [
    '#FFB6C1', // Pink
    '#B8E6C1', // Mint
    '#FFF3B0', // Yellow
    '#87CEEB', // Sky blue
    '#DDA0DD', // Plum
    '#FFD966', // Gold
];

/**
 * Generates random confetti pieces
 */
function generateConfetti(count: number): ConfettiPiece[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
    }));
}

/**
 * Level complete overlay with celebration
 */
export function LevelComplete() {
    const isLevelComplete = useGameStore(state => state.isLevelComplete);
    const level = useGameStore(state => state.level);
    const score = useGameStore(state => state.score);
    const nextLevel = useGameStore(state => state.nextLevel);

    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [show, setShow] = useState(false);

    // Generate confetti when level completes
    useEffect(() => {
        if (isLevelComplete) {
            setConfetti(generateConfetti(50));
            // Delay showing modal for dramatic effect
            const timer = setTimeout(() => setShow(true), 300);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
            setConfetti([]);
        }
    }, [isLevelComplete]);

    if (!isLevelComplete) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {confetti.map(piece => (
                    <div
                        key={piece.id}
                        className="absolute w-3 h-3 rounded-sm animate-confetti"
                        style={{
                            left: `${piece.x}%`,
                            backgroundColor: piece.color,
                            animationDelay: `${piece.delay}s`,
                            animationDuration: `${piece.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Victory modal */}
            <div
                className={`bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl text-center transform transition-all duration-500 ${show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                    }`}
            >
                <div className="text-6xl mb-4">🎉</div>

                <h2 className="text-3xl font-bold text-emerald-600 mb-2">
                    Bravo!
                </h2>

                <p className="text-lg text-gray-600 mb-4">
                    Hai completato il livello {level}!
                </p>

                {/* Level score breakdown */}
                <div className="flex justify-center gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-2xl">⭐</div>
                        <div className="text-lg font-bold text-amber-600">{score.stars}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl">🪙</div>
                        <div className="text-lg font-bold text-yellow-600">{score.coins}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl">💖</div>
                        <div className="text-lg font-bold text-pink-500">{score.hearts}</div>
                    </div>
                </div>

                <div className="text-2xl font-bold text-purple-600 mb-6">
                    Punteggio: {score.total}
                </div>

                <button
                    onClick={nextLevel}
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                    Prossimo Livello →
                </button>
            </div>
        </div>
    );
}
