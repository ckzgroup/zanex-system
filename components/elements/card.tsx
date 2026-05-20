"use client"

import React, {useRef, useState} from 'react';

interface CardProps {
    children: React.ReactNode
}

function Card({ children } : CardProps) {

    const ref = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current || isFocused) return;

        const div = ref.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(1);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };
    return (

        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative w-full overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm border border-secondary-foreground/20 hover:border-primary/30"
        >
            <div
                className="border-primary pointer-events-none absolute left-0 top-0 z-10 h-full w-full cursor-default rounded-xl border bg-[transparent] p-3.5 opacity-0  transition-opacity duration-500 placeholder:select-none"
                style={{
                    border: "1px solid primary",
                    opacity,
                    WebkitMaskImage: `radial-gradient(30% 140px at ${position.x}px ${position.y}px, black 45%, transparent)`,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
                }}
            />

            {children}

        </div>

    );
}

export default Card;