import React from 'react';

interface ScorePanelProps {
    difficulty: number;
    setDifficulty: (val: number) => void;
    onReset: () => void;
    gameMode: 'PvC' | 'PvP';
    setGameMode: (mode: 'PvC' | 'PvP') => void;
    isGameStarted: boolean;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
    difficulty,
    setDifficulty,
    onReset,
    gameMode,
    setGameMode,
    isGameStarted
}) => {
    return (
        <div className="panel score-panel" style={{ paddingBottom: '10px', overflowY: 'auto' }}>
            <div className="panel-header">CONTROLS</div>
            <div className="score-content">
                <div className="score-row">
                    <span>WHITE</span>
                    <span>Player 1</span>
                </div>
                <div className="score-row">
                    <span>BLACK</span>
                    {/* Removed 'Stockfish' name as requested */}
                    <span>{gameMode === 'PvC' ? 'CPU' : 'Player 2'}</span>
                </div>

                {/* Game Mode Toggle */}
                <div style={{ marginTop: '10px', borderTop: '1px solid #555', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.7rem', marginBottom: '4px', textAlign: 'left', color: '#aaa' }}>
                        GAME MODE
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                            onClick={() => !isGameStarted && setGameMode('PvC')}
                            disabled={isGameStarted && gameMode === 'PvP'} // Disable if started and in other mode
                            style={{
                                flex: 1,
                                padding: '4px',
                                background: gameMode === 'PvC' ? '#4CAF50' : '#333',
                                color: gameMode === 'PvC' ? 'white' : '#888',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                cursor: isGameStarted ? 'not-allowed' : 'pointer',
                                fontWeight: gameMode === 'PvC' ? 'bold' : 'normal',
                                opacity: (isGameStarted && gameMode !== 'PvC') ? 0.5 : 1,
                                fontSize: '0.9rem'
                            }}
                        >
                            Vs CPU
                        </button>
                        <button
                            onClick={() => !isGameStarted && setGameMode('PvP')}
                            disabled={isGameStarted && gameMode === 'PvC'}
                            style={{
                                flex: 1,
                                padding: '4px',
                                background: gameMode === 'PvP' ? '#2196F3' : '#333',
                                color: gameMode === 'PvP' ? 'white' : '#888',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                cursor: isGameStarted ? 'not-allowed' : 'pointer',
                                fontWeight: gameMode === 'PvP' ? 'bold' : 'normal',
                                opacity: (isGameStarted && gameMode !== 'PvP') ? 0.5 : 1,
                                fontSize: '0.9rem'
                            }}
                        >
                            Vs Friend
                        </button>
                    </div>
                    {isGameStarted && (
                        <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px', fontStyle: 'italic' }}>
                            Reset to change
                        </div>
                    )}
                </div>

                {/* Difficulty Slider - Only show in PvC */}
                {gameMode === 'PvC' && (
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ fontSize: '0.7rem', marginBottom: '2px', textAlign: 'left', color: '#aaa' }}>
                            CPU DIFFICULTY: {difficulty}
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            value={difficulty}
                            onChange={(e) => setDifficulty(parseInt(e.target.value))}
                            style={{ width: '100%', margin: '5px 0' }}
                        />
                    </div>
                )}

                <div style={{ marginTop: '15px' }}>
                    <button
                        onClick={onReset}
                        style={{
                            width: '100%',
                            padding: '12px', /* Increased padding for easier click */
                            background: '#d32f2f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            letterSpacing: '1px'
                        }}
                    >
                        New Game
                    </button>
                </div>
            </div>
        </div>
    );
};
