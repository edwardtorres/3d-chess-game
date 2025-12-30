import React from 'react';
import './PromotionModal.css';

interface PromotionModalProps {
    isOpen: boolean;
    onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
    onCancel: () => void;
    turn: 'w' | 'b';
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, onSelect, onCancel, turn }) => {
    if (!isOpen) return null;

    const pieces = [
        { id: 'q', label: 'Queen' },
        { id: 'r', label: 'Rook' },
        { id: 'b', label: 'Bishop' },
        { id: 'n', label: 'Knight' },
    ] as const;

    return (
        <div className="promotion-modal-overlay">
            <div className="promotion-modal">
                <h3>Promote Pawn</h3>
                <div className="promotion-options">
                    {pieces.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => onSelect(p.id)}
                            className={`promotion-btn ${turn}`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};
