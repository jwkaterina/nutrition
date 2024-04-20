import Arc from './diagrams/arc';
import SmallCircle from './diagrams/small-circle';
import styles from './alanysis-card.module.css';

interface CompositionCardProps {
    protein: number | null;
    carbs: number | null;
    fat: number | null;
}

const CompositionCard = ({ protein, carbs, fat }: CompositionCardProps): JSX.Element => {

    let proteinPercent: number | null = null, 
    carbsPercent: number | null = null, 
    fatPercent: number | null = null, 
    waterPercent: number | null = null;
    if(protein) proteinPercent = protein;
    if(protein == 0) proteinPercent = 0.1;
    if(carbs) carbsPercent = carbs;
    if(carbs == 0) carbsPercent = 0.1;
    if(fat) fatPercent = fat;
    if(fat == 0) fatPercent = 0.1;
    if(proteinPercent && carbsPercent && fatPercent) waterPercent = 100 - (proteinPercent + carbsPercent + fatPercent);
    
    if(!waterPercent || !proteinPercent || !carbsPercent || !fatPercent) return (
        <div className={styles.container} style={{gridArea: 'composition'}}>
            <h3 className={styles.title}>Composition</h3>
            <div className={styles.info}>No information available.</div>
        </div>
    );

 
    const waterDeg: number = 0;
    const proteinDeg: number = waterPercent / 100 * 360;
    const carbsDeg: number = (proteinPercent + waterPercent) / 100 * 360;
    const fatDeg: number = (carbsPercent + proteinPercent + waterPercent) / 100 * 360;

    const radius: number = 60;
    const strokeWidth: number = 20;
    const widthHeight: number = 2 * radius + 2 * strokeWidth;
    
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
    );
}

export default CompositionCard;