/**
 * ControlToggle Component
 * Allows switching between arrow keys and WASD controls
 */

import { useGameStore } from '../store/gameStore';

/**
 * Toggle button for control scheme
 */
export function ControlToggle() {
    const controlScheme = useGameStore(state => state.controlScheme);
    const toggleControls = useGameStore(state => state.toggleControls);

    return (
        <div className="absolute bottom-4 left-4 pointer-events-auto">
            <button
                onClick={toggleControls}
                className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg hover:bg-white transition-colors flex items-center gap-3"
            >
                <span className="text-sm font-medium text-gray-600">Controlli:</span>

                <div className="flex gap-2">
                    {/* Arrows option */}
                    <div
                        className={`px-3 py-1 rounded-xl text-sm font-bold transition-all ${controlScheme === 'arrows'
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        ↑ ↓ ← →
                    </div>

                    {/* WASD option */}
                    <div
                        className={`px-3 py-1 rounded-xl text-sm font-bold transition-all ${controlScheme === 'wasd'
                                ? 'bg-emerald-500 text-white shadow-md'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        WASD
                    </div>
                </div>
            </button>
        </div>
    );
}
