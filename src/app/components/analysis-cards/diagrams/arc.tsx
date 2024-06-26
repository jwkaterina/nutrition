import { useEffect, useRef } from 'react';

interface ArcProps {
    degree: number,
    percent: number,
    color: string,
    radius: number,
    strokeWidth: number
}

const Arc = ({ degree, percent, color, radius, strokeWidth }: ArcProps): JSX.Element => {

    const arcRef = useRef<SVGCircleElement>(null);

    useEffect(() => {

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference },
            { strokeDashoffset: circumreference - (percent / 100 * circumreference) }
        ];

        if(arcRef.current) {
            arcRef.current.animate(keyframes, options);
        }
    }, []);

    const circumreference: number = radius * 2 * Math.PI;
    const widthHeight: number = 2 * radius + 2 * strokeWidth;
    const center: number = widthHeight / 2;

    return  (
        <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${degree}deg)`}}>
            <circle  style={{strokeDasharray: circumreference}} ref={arcRef} cx={center} cy={center} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"/>
        </svg>
    );
}

export default Arc;