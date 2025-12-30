import React from 'react';
import type { GameState } from '../../hooks/useChessGame';

interface StatusPanelProps {
    gameState: GameState;
    isThinking?: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ gameState, isThinking }) => {
    const { turn, lastMove, isCheck, isCheckmate, isDraw } = gameState;

    let statusText = 'Game in progress';
    if (isCheckmate) statusText = 'Checkmate!';
    else if (isCheck) statusText = 'Check!';
    else if (isDraw) statusText = 'Draw';

    const turnText = turn === 'w' ? "White's Turn" : "Black's Turn";
    const lastMoveText = lastMove
        ? `${lastMove.color === 'w' ? 'White' : 'Black'} moved ${lastMove.from} to ${lastMove.to}`
        : 'Ready to Play';

    return (
        <div className="panel status-panel">
            <div className="move-info">
                {isThinking ? 'CPU Thinking...' : lastMoveText}
            </div>
            <div className="turn-indicator">
                {isCheckmate || isDraw ? 'Game Over' : turnText}
            </div>
            {(isCheck || isCheckmate || isDraw) && (
                <div style={{ color: '#ff4444', fontWeight: 'bold', marginTop: '5px' }}>
                    {statusText}
                </div>
            )}
        </div>
    );
};
