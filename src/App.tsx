import { useState, useEffect } from 'react';
import { Board3D } from './components/game/Board3D';
import { MiniBoard } from './components/game/MiniBoard';
import { StatusPanel } from './components/game/StatusPanel';
import { ScorePanel } from './components/game/ScorePanel';
import { PromotionModal } from './components/game/PromotionModal';
import { useChessGame } from './hooks/useChessGame';
import { useStockfish } from './hooks/useStockfish';
import './App.css';

function App() {
  const { gameState, makeMove, getPossibleMoves, resetGame } = useChessGame();
  const { isThinking, bestMove, requestMove, setBestMove } = useStockfish();

  // Game Mode State: 'PvC' (Player vs Computer) or 'PvP' (Player vs Player)
  const [gameMode, setGameMode] = useState<'PvC' | 'PvP'>('PvC');

  // Settings
  const [difficulty, setDifficulty] = useState(2); // 0-5

  // Promotion state
  const [promotionMove, setPromotionMove] = useState<{ from: string, to: string } | null>(null);

  // Engine loop - Only runs if in PvC mode
  useEffect(() => {
    if (
      gameMode === 'PvC' &&
      gameState.turn === 'b' &&
      !gameState.isGameOver &&
      !gameState.isDraw &&
      !gameState.isCheckmate
    ) {
      // Small delay to feel natural
      const timer = setTimeout(() => {
        requestMove(gameState.fen, difficulty);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.turn, gameState.fen, gameState.isGameOver, difficulty, requestMove, gameMode]);

  // Handle Engine Move
  useEffect(() => {
    if (gameMode === 'PvC' && bestMove) {
      makeMove(bestMove.from, bestMove.to, bestMove.promotion);
      setBestMove(null); // Consume move
    }
  }, [bestMove, makeMove, setBestMove, gameMode]);

  const handleMove = (from: string, to: string) => {
    // If PvC: Prevent moving if it's CPU turn (Black) or if CPU is thinking
    if (gameMode === 'PvC') {
      if (gameState.turn === 'b' || isThinking) return;
    }
    // If PvP: Allow both turns, no restriction on 'b'

    // Try to make move
    const isMoveSuccessful = makeMove(from, to);
    if (!isMoveSuccessful) {
      // If failed, check if it might be a promotion
      const rank = to[1];
      if ((rank === '8' || rank === '1')) {
        setPromotionMove({ from, to });
      }
    }
  };

  const handlePromotionSelect = (piece: 'q' | 'r' | 'b' | 'n') => {
    if (promotionMove) {
      makeMove(promotionMove.from, promotionMove.to, piece);
      setPromotionMove(null);
    }
  };

  const handleReset = () => {
    resetGame();
  };

  // Determine if game has started (any move made)
  const isGameStarted = !!gameState.lastMove;

  return (
    <div className="game-container">
      <PromotionModal
        isOpen={!!promotionMove}
        onSelect={handlePromotionSelect}
        onCancel={() => setPromotionMove(null)}
        turn={gameState.turn}
      />

      <section className="view-3d">
        <Board3D
          fen={gameState.fen}
          lastMove={gameState.lastMove ? { from: gameState.lastMove.from, to: gameState.lastMove.to } : null}
        />
      </section>

      <section className="game-controls">
        <div className="control-group left">
          <MiniBoard
            fen={gameState.fen}
            onMove={handleMove}
            turn={gameState.turn}
            validMoves={getPossibleMoves}
          />
        </div>
        <div className="control-group center">
          <StatusPanel gameState={gameState} isThinking={gameMode === 'PvC' && isThinking} />
        </div>
        <div className="control-group right">
          <ScorePanel
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            onReset={handleReset}
            gameMode={gameMode}
            setGameMode={setGameMode}
            isGameStarted={isGameStarted}
          />
        </div>
      </section>
    </div>
  )
}

export default App
