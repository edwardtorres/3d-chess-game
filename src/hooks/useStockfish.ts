import { useEffect, useRef, useState, useCallback } from 'react';

export const useStockfish = () => {
    const workerRef = useRef<Worker | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [bestMove, setBestMove] = useState<{ from: string, to: string, promotion?: string } | null>(null);

    useEffect(() => {
        // Initialize worker
        // We use import.meta.env.BASE_URL to handle deployment in subfolders (GitHub Pages)
        try {
            const workerPath = `${import.meta.env.BASE_URL}stockfish.js`;
            const worker = new Worker(workerPath);
            workerRef.current = worker;

            worker.onmessage = (event) => {
                const message = event.data;

                if (message === 'uciok') {
                    // console.log('Engine ready');
                }

                if (typeof message === 'string') {
                    if (message.startsWith('bestmove')) {
                        setIsThinking(false);
                        const moveStr = message.split(' ')[1];
                        if (moveStr && moveStr !== '(none)') {
                            // Parse move string "e2e4" or "a7a8q"
                            const fileFrom = moveStr[0];
                            const rankFrom = moveStr[1];
                            const fileTo = moveStr[2];
                            const rankTo = moveStr[3];
                            const promotion = moveStr.length > 4 ? moveStr[4] : undefined;

                            setBestMove({
                                from: `${fileFrom}${rankFrom}`,
                                to: `${fileTo}${rankTo}`,
                                promotion
                            });
                        }
                    }
                }
            };

            worker.postMessage('uci');
            worker.postMessage('isready');
        } catch (error) {
            console.error('Error initializing Stockfish worker:', error);
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const requestMove = useCallback((fen: string, difficulty: number) => {
        if (!workerRef.current) return;

        setIsThinking(true);
        setBestMove(null); // Reset previous best move

        // Adjust depth or time based on difficulty (0-100)
        // For responsiveness, we'll use movetime.
        // Easy: 300ms, Hard: 1200ms
        // const moveTime = 300 + (difficulty * 10); // unused
        // Let's say difficulty is 0-5.
        // 0: 300ms
        // 5: 1500ms
        const calculatedTime = 300 + (difficulty * 200);

        workerRef.current.postMessage('ucinewgame');
        workerRef.current.postMessage(`position fen ${fen}`);
        workerRef.current.postMessage(`go movetime ${calculatedTime}`);
    }, []);

    return {
        isThinking,
        bestMove,
        requestMove,
        setBestMove // Allow clearing it
    };
};
