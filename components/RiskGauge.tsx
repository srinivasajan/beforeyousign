'use client';

import { useEffect, useState, useRef } from 'react';

interface RiskGaugeProps {
    score: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    animated?: boolean;
}

export default function RiskGauge({
    score,
    size = 'lg',
    showLabel = true,
    animated = true
}: RiskGaugeProps) {
    const [displayScore, setDisplayScore] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const gaugeRef = useRef<HTMLDivElement>(null);

    // Sizes configuration
    const sizes = {
        sm: { width: 120, strokeWidth: 8, fontSize: 'text-2xl', labelSize: 'text-xs' },
        md: { width: 180, strokeWidth: 10, fontSize: 'text-4xl', labelSize: 'text-sm' },
        lg: { width: 260, strokeWidth: 14, fontSize: 'text-6xl', labelSize: 'text-base' },
    };

    const config = sizes[size];
    const radius = (config.width - config.strokeWidth) / 2;
    const circumference = radius * Math.PI; // Half circle
    const center = config.width / 2;

    // Animate score on visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (gaugeRef.current) {
            observer.observe(gaugeRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    // Animate the score value
    useEffect(() => {
        if (!isVisible || !animated) {
            setDisplayScore(score);
            return;
        }

        const duration = 1500; // 1.5 seconds
        const steps = 60;
        const increment = score / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= score) {
                setDisplayScore(score);
                clearInterval(timer);
            } else {
                setDisplayScore(Math.round(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, score, animated]);

    // Calculate stroke dashoffset
    const progress = isVisible ? (displayScore / 100) * circumference : 0;
    const dashOffset = circumference - progress;

    // Get gradient colors based on score
    const getGradientId = () => {
        if (score >= 75) return 'gradient-critical';
        if (score >= 50) return 'gradient-high';
        if (score >= 25) return 'gradient-medium';
        return 'gradient-low';
    };

    const getRiskLabel = () => {
        if (score >= 75) return { text: 'HIGH RISK', color: 'text-red-600' };
        if (score >= 50) return { text: 'MEDIUM-HIGH', color: 'text-orange-600' };
        if (score >= 25) return { text: 'MEDIUM', color: 'text-yellow-600' };
        return { text: 'LOW RISK', color: 'text-green-600' };
    };

    const riskInfo = getRiskLabel();

    // Needle angle calculation (0 = left, 180 = right)
    const needleAngle = (displayScore / 100) * 180 - 180;

    return (
        <div ref={gaugeRef} className="flex flex-col items-center">
            <div className="relative" style={{ width: config.width, height: config.width / 2 + 40 }}>
                <svg
                    width={config.width}
                    height={config.width / 2 + 20}
                    viewBox={`0 0 ${config.width} ${config.width / 2 + 20}`}
                    className="transform -rotate-0"
                >
                    {/* Gradient Definitions */}
                    <defs>
                        <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#86efac" />
                        </linearGradient>
                        <linearGradient id="gradient-medium" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#fde047" />
                        </linearGradient>
                        <linearGradient id="gradient-high" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#fdba74" />
                        </linearGradient>
                        <linearGradient id="gradient-critical" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#dc2626" />
                            <stop offset="100%" stopColor="#f87171" />
                        </linearGradient>

                        {/* Background gradient */}
                        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                            <stop offset="33%" stopColor="#eab308" stopOpacity="0.2" />
                            <stop offset="66%" stopColor="#f97316" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#dc2626" stopOpacity="0.2" />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Drop shadow */}
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                        </filter>
                    </defs>

                    {/* Background Arc with gradient */}
                    <path
                        d={`M ${config.strokeWidth / 2} ${center} 
                A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${center}`}
                        fill="none"
                        stroke="url(#bg-gradient)"
                        strokeWidth={config.strokeWidth}
                        strokeLinecap="round"
                    />

                    {/* Tick marks */}
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const angle = (tick / 100) * 180 - 180;
                        const outerRadius = radius + config.strokeWidth / 2 + 4;
                        const innerRadius = radius + config.strokeWidth / 2 - 4;
                        const x1 = center + outerRadius * Math.cos((angle * Math.PI) / 180);
                        const y1 = center + outerRadius * Math.sin((angle * Math.PI) / 180);
                        const x2 = center + innerRadius * Math.cos((angle * Math.PI) / 180);
                        const y2 = center + innerRadius * Math.sin((angle * Math.PI) / 180);
                        return (
                            <line
                                key={tick}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#9ca3af"
                                strokeWidth={2}
                            />
                        );
                    })}

                    {/* Progress Arc */}
                    <path
                        d={`M ${config.strokeWidth / 2} ${center} 
                A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${center}`}
                        fill="none"
                        stroke={`url(#${getGradientId()})`}
                        strokeWidth={config.strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        filter="url(#glow)"
                        className="transition-all duration-300 ease-out"
                        style={{
                            transition: animated ? 'stroke-dashoffset 1.5s ease-out' : 'none'
                        }}
                    />

                    {/* Needle */}
                    <g
                        transform={`rotate(${needleAngle} ${center} ${center})`}
                        className="transition-transform duration-300 ease-out"
                        style={{
                            transition: animated ? 'transform 1.5s ease-out' : 'none'
                        }}
                    >
                        {/* Needle body */}
                        <polygon
                            points={`${center - 4},${center} ${center + 4},${center} ${center},${center - radius + 20}`}
                            fill="#1c1917"
                            filter="url(#shadow)"
                        />
                        {/* Needle center cap */}
                        <circle
                            cx={center}
                            cy={center}
                            r={10}
                            fill="#1c1917"
                            stroke="#f5f5f4"
                            strokeWidth={2}
                        />
                        <circle
                            cx={center}
                            cy={center}
                            r={4}
                            fill="#f5f5f4"
                        />
                    </g>

                    {/* Score labels */}
                    <text x={config.strokeWidth} y={center + 16} fontSize="10" fill="#9ca3af" fontWeight="500">0</text>
                    <text x={config.width - config.strokeWidth - 12} y={center + 16} fontSize="10" fill="#9ca3af" fontWeight="500">100</text>
                </svg>

                {/* Center Score Display */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                    <div className={`${config.fontSize} font-bold text-stone-900 tabular-nums leading-none`}>
                        {displayScore}
                    </div>
                    {showLabel && (
                        <div className={`${config.labelSize} font-bold uppercase tracking-wider mt-1 ${riskInfo.color}`}>
                            {riskInfo.text}
                        </div>
                    )}
                </div>
            </div>

            {/* Risk level indicator pills */}
            <div className="flex items-center gap-1 mt-4">
                {['Low', 'Medium', 'High', 'Critical'].map((level, idx) => {
                    const isActive = (idx === 0 && score < 25) ||
                        (idx === 1 && score >= 25 && score < 50) ||
                        (idx === 2 && score >= 50 && score < 75) ||
                        (idx === 3 && score >= 75);
                    const colors = [
                        'bg-green-500',
                        'bg-yellow-500',
                        'bg-orange-500',
                        'bg-red-500'
                    ];
                    return (
                        <div
                            key={level}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-500 ${isActive
                                    ? `${colors[idx]} text-white scale-110`
                                    : 'bg-stone-200 text-stone-500'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-stone-400'}`} />
                            {level}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
