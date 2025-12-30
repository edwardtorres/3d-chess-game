import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group, MeshStandardMaterial } from 'three';

interface Piece3DProps {
    type: string; // p, r, n, b, q, k
    color: 'w' | 'b';
    position: [number, number, number];
    animateFrom?: [number, number, number]; // If set, lerp from this to position
}

export const Piece3D: React.FC<Piece3DProps> = ({ type, color, position, animateFrom }) => {
    const group = useRef<Group>(null);
    const material = useMemo(() => new MeshStandardMaterial({
        color: color === 'w' ? '#eeeeee' : '#333333',
        roughness: 0.3,
        metalness: 0.2
    }), [color]);

    // Animation state
    const animState = useRef({
        startTime: 0,
        isAnimating: false,
        startPos: new Vector3(),
        targetPos: new Vector3(...position)
    });

    useLayoutEffect(() => {
        // Update target position
        const target = new Vector3(...position);

        if (animateFrom) {
            // Start animation
            animState.current.isAnimating = true;
            animState.current.startTime = Date.now();
            animState.current.startPos.set(...animateFrom);
            animState.current.targetPos.copy(target);

            // Set initial position to start
            if (group.current) {
                group.current.position.copy(animState.current.startPos);
            }
        } else {
            // Snap to position
            if (group.current) {
                group.current.position.copy(target);
            }
        }
    }, [position, animateFrom]);

    useFrame(() => {
        if (animState.current.isAnimating && group.current) {
            const now = Date.now();
            const elapsed = now - animState.current.startTime;
            const duration = 300; // ms
            const t = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - t, 3);

            group.current.position.lerpVectors(
                animState.current.startPos,
                animState.current.targetPos,
                ease
            );

            if (t >= 1) {
                animState.current.isAnimating = false;
            }
        }
    });

    const getGeometry = () => {
        switch (type.toLowerCase()) {
            case 'p': // Pawn
                return (
                    <group>
                        <mesh position={[0, 0.2, 0]} castShadow receiveShadow material={material}>
                            <coneGeometry args={[0.2, 0.4, 16]} />
                        </mesh>
                        <mesh position={[0, 0.45, 0]} castShadow receiveShadow material={material}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                        </mesh>
                    </group>
                );
            case 'r': // Rook
                return (
                    <mesh position={[0, 0.3, 0]} castShadow receiveShadow material={material}>
                        <cylinderGeometry args={[0.25, 0.25, 0.6, 16]} />
                    </mesh>
                );
            case 'n': // Knight
                return (
                    <group>
                        <mesh position={[0, 0.2, 0]} castShadow receiveShadow material={material}>
                            <cylinderGeometry args={[0.2, 0.25, 0.4, 16]} />
                        </mesh>
                        <mesh position={[0, 0.5, 0.1]} rotation={[-0.2, 0, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[0.2, 0.4, 0.3]} />
                        </mesh>
                    </group>
                );
            case 'b': // Bishop
                return (
                    <group>
                        <mesh position={[0, 0.3, 0]} castShadow receiveShadow material={material}>
                            <cylinderGeometry args={[0.15, 0.25, 0.6, 16]} />
                        </mesh>
                        <mesh position={[0, 0.65, 0]} castShadow receiveShadow material={material}>
                            <coneGeometry args={[0.15, 0.3, 16]} />
                        </mesh>
                    </group>
                );
            case 'q': // Queen
                return (
                    <group>
                        <mesh position={[0, 0.4, 0]} castShadow receiveShadow material={material}>
                            <cylinderGeometry args={[0.2, 0.3, 0.8, 16]} />
                        </mesh>
                        <mesh position={[0, 0.85, 0]} castShadow receiveShadow material={material}>
                            <sphereGeometry args={[0.2, 16, 16]} />
                        </mesh>
                        <mesh position={[0, 0.85, 0]} rotation={[1.57, 0, 0]} castShadow receiveShadow material={material}>
                            <torusGeometry args={[0.25, 0.05, 8, 16]} />
                        </mesh>
                    </group>
                );
            case 'k': // King
                return (
                    <group>
                        <mesh position={[0, 0.45, 0]} castShadow receiveShadow material={material}>
                            <cylinderGeometry args={[0.25, 0.3, 0.9, 16]} />
                        </mesh>
                        <mesh position={[0, 1.0, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[0.2, 0.2, 0.2]} />
                        </mesh>
                        <mesh position={[0, 1.15, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[0.08, 0.3, 0.08]} />
                        </mesh>
                        <mesh position={[0, 1.15, 0]} castShadow receiveShadow material={material}>
                            <boxGeometry args={[0.25, 0.08, 0.08]} />
                        </mesh>
                    </group>
                );
            default:
                return null;
        }
    };

    return (
        <group ref={group}>
            {getGeometry()}
        </group>
    );
};
