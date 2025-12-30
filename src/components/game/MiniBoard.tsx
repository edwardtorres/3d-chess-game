import React, { useState } from 'react';
import { Chess, type Square } from 'chess.js';
import './MiniBoard.css';

interface MiniBoardProps {
    fen: string;
    onMove: (from: string, to: string) => void;
    turn: 'w' | 'b';
    validMoves: (square: string) => string[];
}

export const MiniBoard: React.FC<MiniBoardProps> = ({ fen, onMove, validMoves }) => {
    const game = new Chess(fen);
    const board = game.board();

    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

    const handleSquareClick = (rowIndex: number, colIndex: number) => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        const square = `${files[colIndex]}${ranks[rowIndex]}` as Square;

        // If clicking same square, deselect
        if (selectedSquare === square) {
            setSelectedSquare(null);
            setPossibleMoves([]);
            return;
        }

        // If a move is attempted (clicked on a possible move)
        if (selectedSquare && possibleMoves.includes(square)) {
            onMove(selectedSquare, square);
            setSelectedSquare(null);
            setPossibleMoves([]);
            return;
        }

        // Select new piece
        const piece = board[rowIndex][colIndex];
        if (piece) {
            setSelectedSquare(square);
            const moves = validMoves(square);
            setPossibleMoves(moves);
        } else {
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    };

    // Flatten logic for simpler rendering
    const flatBoard = board.flatMap((row, rowIndex) =>
        row.map((piece, colIndex) => ({
            piece,
            rowIndex,
            colIndex
        }))
    );

    return (
        <div className="mini-board-container">
            <div className="mini-board-grid">
                {flatBoard.map(({ piece, rowIndex, colIndex }) => {
                    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
                    const square = `${files[colIndex]}${ranks[rowIndex]}`;
                    const isDark = (rowIndex + colIndex) % 2 === 1;
                    const isSelected = selectedSquare === square;
                    const isPossibleMove = possibleMoves.includes(square);

                    return (
                        <div
                            key={square}
                            className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isPossibleMove ? 'highlight' : ''}`}
                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                        >
                            {piece ? (
                                <span className={`piece ${piece.color}`}>
                                    {getPieceSymbol(piece.type, piece.color)}
                                </span>
                            ) : (
                                /* Ensuring empty squares have content to hold layout if CSS fails */
                                null
                            )}
                            {isPossibleMove && !piece && <div className="move-dot" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function getPieceSymbol(type: string, _color: string) {
    const symbols: Record<string, string> = {
        p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
        P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
    };
    return symbols[type] || '';
}
