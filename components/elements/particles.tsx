"use client"

// components/ParticleComponent.tsx
import React, { useEffect, useRef } from 'react';

interface ParticleComponentProps {
    numParticles: number;
}

const ParticleComponent: React.FC<ParticleComponentProps> = ({ numParticles }) => {
    const particleContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let particles: HTMLElement[] = [];

        const getRandom = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = '1px';
            particle.style.height = '1px';
            particle.style.animationDuration = `${getRandom(2, 5)}s`;
            particle.style.animationDelay = `${getRandom(0, 5)}s`;

            const initialX = getRandom(0, particleContainerRef.current?.clientWidth || 100);
            const initialY = getRandom(0, particleContainerRef.current?.clientHeight || 100);
            const rotateDeg = getRandom(0, 360);
            const radius = getRandom(50, 150);

            particle.style.left = `${initialX}px`;
            particle.style.top = `${initialY}px`;
            particle.style.transform = `rotate(${rotateDeg}deg) translate(${radius}px) rotate(-${rotateDeg}deg)`;

            particles.push(particle);
            particleContainerRef.current?.appendChild(particle);

            particle.addEventListener('animationend', () => {
                particleContainerRef.current?.removeChild(particle);
                particles = particles.filter((p) => p !== particle);
            });
        };

        const intervalId = setInterval(createParticle, 500);

        return () => {
            clearInterval(intervalId);
        };
    }, [numParticles]);

    return <div ref={particleContainerRef} className="particle-container"></div>;
};

export default ParticleComponent;
