import styles from './utils.module.css';
import { Nutrient } from '@/app/types/types';
import { useEffect, useRef, useContext } from 'react';
import { CurrentRecipeContext } from '@/app/context/recipe-context';

interface BarRowProps {
    nutrient: Nutrient;
    daily: Nutrient;
    title: string;
    color: string;
}

const BarRow = ({ title, color, nutrient, daily }: BarRowProps): JSX.Element => {

    const currentRecipe = useContext(CurrentRecipeContext);
    const recipe = currentRecipe.currentRecipe.recipe;
    let servings: number = 1;
    if(recipe) servings = recipe.servings;

    const lineRef = useRef<SVGLineElement>(null);
    const length: number = 70;

    useEffect(() => {
        const line = lineRef.current;
        const options: KeyframeAnimationOptions  = {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        const progressPercent = () => {
            if(!daily || daily.quantity == 0) {
                return length
            } else if(daily.quantity <=100 ) {
                return length - (daily.quantity/ servings / 100 * length) 
            } else {
                return 0
            }
        }

        const keyframes: Keyframe[] = [
            { strokeDashoffset: length },
            { strokeDashoffset: `${progressPercent()}` }
        ];

        if(line) {
            lineRef.current.animate(keyframes, options);
        }
    }, [daily])

    const styleProgress = () => {

        return {
            strokeDasharray: length,
            strokeDashoffset: length,
        }
    }

    const styleLine = () => {

        return {
            strokeDasharray: length,
        }
    }

    if(!nutrient) return <></>

    return (
        <div className={styles.bar_row}>
            <p>{title}</p>
            <span>{`${(nutrient.quantity / servings).toFixed(0)}${nutrient.unit}`}</span>
            <svg width='90px' height='40px'>
                <line x1="10" y1="20" x2="80" y2="20" stroke="var(--gray-light)" strokeWidth="6" strokeLinecap="round" style={styleLine()}/> 
                <line x1="10" y1="20" x2="80" y2="20" stroke={color} strokeWidth="6" strokeLinecap="round" style={styleProgress()} ref={lineRef}/> 
            </svg>
            {daily && <span>{`${(daily.quantity / servings).toFixed(0)}${daily.unit}`}</span>}
        </div>
    )
}

export default BarRow