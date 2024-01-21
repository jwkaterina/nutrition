import styles from './utils.module.css'
import { Nutrient } from '@/app/types/types'
import { useEffect, useRef, useContext } from 'react'
import { CurrentRecipeContext } from '@/app/context/recipe-context'

interface CircleRowProps {
    vitamin: Nutrient,
    vitaminPercent: Nutrient,
    label: string,
    color: string,
    lightColor: string
}

const CircleRow = ({ vitamin, vitaminPercent, label, color, lightColor }: CircleRowProps): JSX.Element => {

    const currentRecipe = useContext(CurrentRecipeContext);
    const recipe = currentRecipe.currentRecipe.recipe;
    let servings: number = 1;
    if(recipe) servings = recipe.servings;

    const radius: number = 15;
    const arcRef = useRef<SVGCircleElement>(null);
    const circumreference: number = radius * 2 * Math.PI;

    useEffect(() => {
        const arc = arcRef.current;
        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const progressPercent = (): number => {
            if(!vitaminPercent || vitaminPercent.quantity == 0) {
                return circumreference
            } else if(vitaminPercent && vitaminPercent.quantity <=100 ) {
                return circumreference - (vitaminPercent.quantity / servings / 100 * circumreference) 
            } else {
                return 0
            }
        }

        const keyframes: Keyframe[] = [
            { strokeDashoffset: circumreference },
            { strokeDashoffset: `${progressPercent()}` }
        ];

        if(arc) {
            arcRef.current.animate(keyframes, options);
        }
    }, [vitaminPercent])

    const styleProgress = () => {

        return {
            strokeDasharray: circumreference,
            strokeDashoffset: circumreference,
        }
    }

    const styleArc = () => {

        return {
            strokeDasharray: circumreference,
        }
    }
    
    const strokeWidth = 5;
    const centerX = radius + strokeWidth;
    const centerY = radius + strokeWidth;
    const widthHeight = radius * 2 + strokeWidth * 2;

    if(!vitamin) return <></>

    return <div className={styles.circle_row}>
                <p>{label}</p>
                <span>{`${(vitamin.quantity / servings).toFixed(1)}${vitamin.unit}`}</span>
                <svg width={widthHeight} height={widthHeight}>
                    <circle  style={styleArc()}  cx={centerX} cy={centerY} r={radius} stroke={lightColor} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"/>
                    <circle ref={arcRef} style={styleProgress()}  cx={centerX} cy={centerY} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round"/>
                </svg>     
                {vitaminPercent ? <span>{`${(vitaminPercent.quantity / servings).toFixed(0)}${vitaminPercent.unit}`}</span> : <span>0%</span>}                
            </div>
}

export default CircleRow