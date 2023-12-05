import styles from './alanysis_card.module.css'
import { Nutrients, Nutrient } from '@/app/types/types';
import { useState, useRef, useEffect } from 'react'

interface FatsCardProps {
    content: Nutrients | null;
}

const FatsCard = ({ content }: FatsCardProps) => {

    const [satPercent, setsatPercent] = useState<number | null>(null);
    const [transPercent, settransPercent] = useState<number | null>(null);
    const [monounsatPercent, setmonounsatPercent] = useState<number | null>(null);
    const [polyunsatPercent, setpolyunsatPercent] = useState<number | null>(null);
    const [restPercent, setrestPercent] = useState<number | null>(null);

    const [satDeg, setsatDeg] = useState<number>(0);
    const [transDeg, settransDeg] = useState<number>(0);
    const [monounsatDeg, setmonounsatDeg] = useState<number>(0);
    const [polyunsatDeg, setpolyunsatDeg] = useState<number>(0);
    const [restDeg, setrestDeg] = useState<number>(0);

    const satRef = useRef<SVGCircleElement>(null);
    const transRef = useRef<SVGCircleElement>(null);
    const monounsatRef = useRef<SVGCircleElement>(null);
    const polyunsatRef = useRef<SVGCircleElement>(null);
    const restRef = useRef<SVGCircleElement>(null);

    const radius = 50;
    const circumreference = radius * 2 * Math.PI;

   const totalFat: number = content!.totalNutrients.FAT.quantity;
   const satFat: number = content!.totalNutrients.FASAT.quantity * 100 / totalFat ;
   const transFat: number = content!.totalNutrients.FATRN.quantity * 100  / totalFat;
   const monounsatFat: number = content!.totalNutrients.FAMS.quantity * 100  / totalFat;
   const polyunsatFat: number = content!.totalNutrients.FAPU.quantity * 100  / totalFat;

   useEffect(() => {

        setsatPercent(satFat);
        if(satFat === 0) setsatPercent(0.1);
        settransPercent(transFat);
        if(transFat === 0) settransPercent(0.1);
        setmonounsatPercent(monounsatFat);
        if(monounsatFat === 0) setmonounsatPercent(0.1);
        setpolyunsatPercent(polyunsatFat);
        if(polyunsatFat === 0) setpolyunsatPercent(0.1);
        setrestPercent(100 - (satFat + monounsatFat + polyunsatFat + transFat));
    }, [])

    useEffect(() => {

        if(satPercent && transPercent && monounsatPercent && polyunsatPercent)  {

            showComposition(polyunsatPercent, polyunsatRef.current);
            showComposition(satPercent, satRef.current);
            showComposition(transPercent, transRef.current);
            showComposition(monounsatPercent, monounsatRef.current);
            showComposition(restPercent!, restRef.current);

            setsatDeg(0);
            settransDeg(satPercent / 100 * 360);
            setmonounsatDeg((satPercent + transPercent) / 100 * 360);
            setpolyunsatDeg((transPercent + satPercent + monounsatPercent) / 100 * 360);
            setrestDeg((transPercent + satPercent + polyunsatPercent + monounsatPercent) / 100 * 360)
        }
    }, [polyunsatPercent, satPercent, transPercent, monounsatPercent])

    const showComposition = (percent: number, ref: SVGCircleElement | null) => {

        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference },
            { strokeDashoffset: circumreference - (percent / 100 * circumreference) }
        ];

        if(ref) {
            ref.animate(keyframes, options);
        }
    }

    const strokeWidth = 15;
    const widthHeight = 2 * radius + 2 * strokeWidth;
    const center = widthHeight / 2;

    return (
        <div className={styles.container}>
            <h3>Fatty acids</h3>
            <div className={styles.fats_grid}>
                <div className={styles.composition_donut} style={{width: widthHeight}}>
                    <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${satDeg}deg)`}}>
                        <circle  style={{strokeDasharray: circumreference}} ref={satRef} cx={center} cy={center} r={radius} stroke='var(--tertiary-darker)' strokeWidth={strokeWidth} fill="none"/>
                    </svg>
                    <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${transDeg}deg)`}}>
                        <circle style={{strokeDasharray: circumreference}} ref={transRef} cx={center} cy={center} r={radius} stroke='var(--tertiary-color)' strokeWidth={strokeWidth} fill="none"/>
                    </svg>
                    <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${monounsatDeg}deg)`}}>
                        <circle style={{strokeDasharray: circumreference}} ref={monounsatRef} cx={center} cy={center} r={radius} stroke='var(--tertiary-lighter)' strokeWidth={strokeWidth} fill="none"/>
                    </svg>
                    <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${polyunsatDeg}deg)`}}>
                        <circle style={{strokeDasharray: circumreference}} ref={polyunsatRef} cx={center} cy={center} r={radius} stroke='var(--tertiary-light)' strokeWidth={strokeWidth} fill="none"/>
                    </svg>
                    <svg width={widthHeight} height={widthHeight} style={{ transform: `rotate(${restDeg}deg)`}}>
                        <circle style={{strokeDasharray: circumreference}} ref={restRef} cx={center} cy={center} r={radius} stroke='var(--tertiary-lightest)' strokeWidth={strokeWidth} fill="none"/>
                    </svg>
                </div>
                <div className={styles.composition_column} style={{height: widthHeight}}>
                    <div className={styles.composition_cell}>
                        <div className={`${styles.circle} ${styles.sat_circle}`}></div>
                        <p>{`${Math.round(satPercent)} % saturated`}</p>
                    </div>
                    <div className={styles.composition_cell}>
                        <div className={`${styles.circle} ${styles.trans_circle}`}></div>
                        <p>{`${Math.round(transPercent)} % trans`}</p>
                    </div>
                    <div className={styles.composition_cell}>
                        <div className={`${styles.circle} ${styles.monounsat_circle}`}></div>
                        <p>{`${Math.round(monounsatPercent)} % monounsaturated`}</p>
                    </div>
                    <div className={styles.composition_cell}>
                        <div className={`${styles.circle} ${styles.polyunsat_circle}`}></div>
                        <p>{`${Math.round(polyunsatPercent)} % polyunsaturated`}</p>
                    </div>
                    <div className={styles.composition_cell}>
                        <div className={`${styles.circle} ${styles.rest_circle}`}></div>
                        <p>{`${Math.round(restPercent)} % rest`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FatsCard