import { useState, useEffect, useCallback } from 'react';
import { Chess, Move } from 'chess.js';

export interface GameState {
    fen: string;
    turn: 'w' | 'b';
    isCheck: boolean;
    isCheckmate: boolean;
    isDraw: boolean;
    isGameOver: boolean;
    lastMove: Move | null;
    history: string[];
}

const STORAGE_KEY = '3d-chess-game-state';

export const useChessGame = () => {
    const [game, setGame] = useState<Chess>(() => {
        const savedFen = localStorage.getItem(STORAGE_KEY);
        return new Chess(savedFen || undefined);
    });

    const [gameState, setGameState] = useState<GameState>({
        fen: game.fen(),
        turn: game.turn(),
        isCheck: game.inCheck(),
        isCheckmate: game.isCheckmate(),
        isDraw: game.isDraw(),
        isGameOver: game.isGameOver(),
        lastMove: null,
        history: game.history(),
    });

    // Persist state whenever fen changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, gameState.fen);
    }, [gameState.fen]);

    const updateGameState = useCallback((newGame: Chess, move: Move | null = null) => {
        setGameState({
            fen: newGame.fen(),
            turn: newGame.turn(),
            isCheck: newGame.inCheck(),
            isCheckmate: newGame.isCheckmate(),
            isDraw: newGame.isDraw(),
            isGameOver: newGame.isGameOver(),
            lastMove: move,
            history: newGame.history(),
        });
        setGame(newGame); // Just to force re-render if needed, though game object usually mutated
    }, []);

    const makeMove = useCallback((from: string, to: string, promotion?: string) => {
        try {
            const gameCopy = new Chess(game.fen());
            const move = gameCopy.move({
                from,
                to,
                promotion: promotion || 'q', // Default to queen if not specified, but UI should handle this
            });

            if (move) {
                updateGameState(gameCopy, move);
                return true;
            }
        } catch (e) {
            // Invalid move
            return false;
        }
        return false;
    }, [game, updateGameState]);

    const resetGame = useCallback(() => {
        const newGame = new Chess();
        updateGameState(newGame);
        localStorage.removeItem(STORAGE_KEY);
    }, [updateGameState]);

    const getPossibleMoves = useCallback((square: string) => {
        return game.moves({ square: square as import('chess.js').Square, verbose: true }).map((m) => m.to);
    }, [game]);

    return {
        game,
        gameState,
        makeMove,
        resetGame,
        getPossibleMoves, // Helper to highlight legal moves
    };
};
