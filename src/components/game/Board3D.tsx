import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sparkles } from '@react-three/drei';
import { Piece3D } from './Piece3D';
import { Chess } from 'chess.js';
import { SpotLight } from 'three';

interface Board3DProps {
    fen?: string;
    lastMove?: { from: string, to: string } | null;
}

// Animated Candle Light Component
const CandleLight = () => {
    const light = useRef<SpotLight>(null);

    useFrame(({ clock }) => {
        if (light.current) {
            // Smooth random noise for flicker
            const noise = Math.sin(clock.elapsedTime * 10) * 0.05 +
                Math.sin(clock.elapsedTime * 23) * 0.05 +
                (Math.random() - 0.5) * 0.1;

            light.current.intensity = 2.0 + noise; // Base intensity 2.0

            // Subtle position sway
            light.current.position.x = 8 + Math.sin(clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <spotLight
            ref={light}
            position={[8, 12, 6]}
            angle={0.4}
            penumbra={1}
            intensity={2.0}
            color="#ffaa33" // Warm Orange candle color
            castShadow
            shadow-bias={-0.0005}
        />
    );
};

const BoardModel: React.FC<{ fen: string, lastMove?: { from: string, to: string } | null }> = ({ fen, lastMove }) => {
    const boardData = useMemo(() => {
        const game = new Chess(fen);
        const board = game.board();
        const pieces: any[] = [];

        board.forEach((row, rowIndex) => {
            row.forEach((piece, colIndex) => {
                if (piece) {
                    const x = colIndex - 3.5;
                    const z = rowIndex - 3.5;

                    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
                    const square = `${files[colIndex]}${ranks[rowIndex]}`;

                    // Check if this piece is the one that just moved to 'to'
                    let animateFrom: [number, number, number] | undefined = undefined;
                    if (lastMove && lastMove.to === square) {
                        const fromFile = lastMove.from[0];
                        const fromRank = lastMove.from[1];
                        const fromCol = files.indexOf(fromFile);
                        const fromRow = ranks.indexOf(fromRank);

                        animateFrom = [fromCol - 3.5, 0, fromRow - 3.5];
                    }

                    pieces.push({
                        ...piece,
                        position: [x, 0, z] as [number, number, number],
                        key: `piece-${square}`,
                        animateFrom
                    });
                }
            });
        });
        return pieces;
    }, [fen, lastMove]);

    // Board tiles
    const tiles = useMemo(() => {
        const tilesArr = [];
        for (let x = 0; x < 8; x++) {
            for (let z = 0; z < 8; z++) {
                const isDark = (x + z) % 2 === 1;
                tilesArr.push(
                    <mesh
                        key={`tile-${x}-${z}`}
                        position={[x - 3.5, -0.05, z - 3.5]}
                        receiveShadow
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <planeGeometry args={[1, 1]} />
                        {/* Muted tile colors for atmospheric contrast */}
                        <meshStandardMaterial
                            color={isDark ? '#444' : '#ccc'}
                            roughness={0.6}
                            metalness={0.1}
                        />
                    </mesh>
                );
            }
        }
        return tilesArr;
    }, []);

    return (
        <group>
            {/* Board Base - Deep Dark Wood */}
            <mesh position={[0, -0.6, 0]} receiveShadow>
                <boxGeometry args={[12, 1, 12]} />
                <meshStandardMaterial color="#1a120b" roughness={0.8} />
            </mesh>

            {/* Tiles */}
            <group>{tiles}</group>

            {/* Pieces */}
            {boardData.map((p) => (
                <Piece3D
                    key={p.key}
                    type={p.type}
                    color={p.color}
                    position={p.position}
                    animateFrom={p.animateFrom}
                />
            ))}
        </group>
    );
};

export const Board3D: React.FC<Board3DProps> = ({ fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', lastMove }) => {
    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#020205' }}>
            <Canvas shadows camera={{ position: [8, 6, 4], fov: 45 }}>
                {/* 
                   Gothic Hall Atmosphere - Cinematic Pass:
                   - Fog: Deepest Blue/Black exponential fog.
                   - Sparkles: Floating dust motes caught in the light.
                   - Lighting: Dynamic Candle + Static Moon.
                */}
                <color attach="background" args={['#020205']} />
                <fogExp2 attach="fog" args={['#020205', 0.06]} />

                {/* 
                   Sparkles: Dust motes
                   count: number of particles
                   scale: spread area
                   size: particle size
                   speed: float speed
                   opacity: subtle visibility
                */}
                <Sparkles
                    count={200}
                    scale={12}
                    size={2}
                    speed={0.4}
                    opacity={0.3}
                    color="#ffffff"
                    position={[0, 2, 0]}
                />

                {/* Environment: Night City for subtle reflections only, no background */}
                <Environment preset="city" background={false} />

                {/* 1. Ambient: Barely there, deep purple shadow lift */}
                <ambientLight intensity={0.25} color="#101020" />

                {/* 2. Key Light: Flickering Candle */}
                <CandleLight />

                {/* 3. Rim Light: Moon (Cool Blue) from back-left */}
                <spotLight
                    position={[-8, 5, -8]}
                    angle={0.6}
                    penumbra={1}
                    intensity={2.5}
                    color="#6688ff"
                />

                {/* 4. Fill Point: Soft warmth near board center */}
                <pointLight position={[0, 3, 0]} intensity={0.3} color="#ff8844" distance={8} />

                <group position={[0, 0, 0]}>
                    <BoardModel fen={fen} lastMove={lastMove} />
                </group>

                <OrbitControls
                    enablePan={false}
                    minPolarAngle={0.1}
                    maxPolarAngle={Math.PI / 2.2}
                    target={[0, 0, 0]}
                    maxDistance={20}
                    minDistance={5}
                />
            </Canvas>
        </div>
    );
};
