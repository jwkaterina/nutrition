import styles from './alanysis_card.module.css';
import { Nutrients, NutrientsProp, Nutrient } from '@/app/types/types';
import Arc from './utils/arc';
import SmallCircle from './utils/small_circle';

interface CompositionCardProps {
    contentPercent: Nutrients | null;
}

const CompositionCard = ({ contentPercent }: CompositionCardProps): JSX.Element => {

    const composition: NutrientsProp = contentPercent!.totalNutrients;

    const protein: Nutrient = composition.PROCNT;
    const carbs: Nutrient = composition.CHOCDF;
    const fat: Nutrient = composition.FAT;

    let proteinPercent: number | null = null, 
    carbsPercent: number | null = null, 
    fatPercent: number | null = null, 
    waterPercent: number | null = null;
    if(protein) proteinPercent = protein.quantity;
    if(protein && protein.quantity == 0) proteinPercent = 0.1;
    if(carbs) carbsPercent = carbs.quantity;
    if(carbs && carbs.quantity == 0) carbsPercent = 0.1;
    if(fat) fatPercent = fat.quantity;
    if(fat && fat.quantity == 0) fatPercent = 0.1;
    if(protein && carbs && fat) waterPercent = 100 - (protein.quantity + carbs.quantity + fat.quantity);

    let waterDeg: number | null = null, 
    proteinDeg: number | null = null, 
    carbsDeg: number | null = null, 
    fatDeg: number | null = null;
    waterDeg = 0;
    if(waterPercent ) proteinDeg = waterPercent / 100 * 360;
    if(proteinPercent && waterPercent) carbsDeg = (proteinPercent + waterPercent!) / 100 * 360;
    if(proteinPercent && carbsPercent && waterPercent) fatDeg = (carbsPercent + proteinPercent + waterPercent) / 100 * 360;

    const radius: number = 60;
    const strokeWidth: number = 20;
    const widthHeight: number = 2 * radius + 2 * strokeWidth;
    
    if(!waterPercent || !proteinPercent || !carbsPercent || !fatPercent) return <></>

    return (
        <div className={styles.container} style={{gridArea: 'composition'}}>
            <h3 className={styles.title}>Composition</h3>
            <div className={styles.composition_grid}>
                <div className={styles.composition_donut} style={{width: widthHeight}}>
                    <Arc degree={waterDeg} percent={waterPercent} color='var(--gray-light)' radius={radius} strokeWidth={strokeWidth} />
                    <Arc degree={proteinDeg} percent={proteinPercent} color='var(--primary-color)' radius={radius} strokeWidth={strokeWidth} />
                    <Arc degree={carbsDeg} percent={carbsPercent} color='var(--secondary-color)' radius={radius} strokeWidth={strokeWidth} />
                    <Arc degree={fatDeg} percent={fatPercent} color='var(--tertiary-color)' radius={radius} strokeWidth={strokeWidth} />
                </div>
                <div className={styles.composition_column} style={{height: widthHeight}}>
                    <SmallCircle percent={waterPercent} color='var(--gray-light)' text='Water' heightWidth={20}/>
                    <SmallCircle percent={proteinPercent} color='var(--primary-color)' text='Protein' heightWidth={20}/>
                    <SmallCircle percent={carbsPercent} color='var(--secondary-color)' text='Carbs' heightWidth={20}/>
                    <SmallCircle percent={fatPercent} color='var(--tertiary-color)' text='Fat' heightWidth={20}/>
                </div>
            </div>
        </div>
    )
}

export default CompositionCard;