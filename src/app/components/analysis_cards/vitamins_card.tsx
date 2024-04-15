import BarColumn from './figures/bar_column';
import CircleRow from './figures/circle_row';
import { Nutrients, Nutrient } from '@/app/types/types';
import styles from './alanysis_card.module.css';

interface VitaminsCardProps {
    content: Nutrients | null;
}

const VitaminsCard = ({ content }: VitaminsCardProps): JSX.Element => {

    let mediaQuery: MediaQueryList | null = null;

    if(typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(max-width: 500px)');
    }

    const vitaminA: Nutrient = content!.totalNutrients.VITA_RAE;
    const vitaminC: Nutrient = content!.totalNutrients.VITC;
    const thiamin: Nutrient = content!.totalNutrients.THIA;
    const riboflavin: Nutrient = content!.totalNutrients.RIBF;
    const niacin: Nutrient = content!.totalNutrients.NIA;
    const vitaminB6: Nutrient = content!.totalNutrients.VITB6A;
    const folateDFE: Nutrient = content!.totalNutrients.FOLDFE;
    const folateFood: Nutrient = content!.totalNutrients.FOLFD;
    const folicAcid: Nutrient = content!.totalNutrients.FOLAC;
    const vitaminB12: Nutrient = content!.totalNutrients.VITB12;
    const vitaminD: Nutrient = content!.totalNutrients.VITD;
    const vitaminE: Nutrient = content!.totalNutrients.TOCPHA;
    const vitaminK: Nutrient = content!.totalNutrients.VITK1;

    const vitaminAPercent: Nutrient = content!.totalDaily.VITA_RAE;
    const vitaminCPercent: Nutrient = content!.totalDaily.VITC;
    const thiaminPercent: Nutrient = content!.totalDaily.THIA;
    const riboflavinPercent: Nutrient = content!.totalDaily.RIBF;
    const niacinPercent: Nutrient = content!.totalDaily.NIA;
    const vitaminB6Percent: Nutrient = content!.totalDaily.VITB6A;
    const folateDFEPercent: Nutrient = content!.totalDaily.FOLDFE;
    const folateFoodPercent: Nutrient = content!.totalDaily.FOLFD;
    const folicAcidPercent: Nutrient = content!.totalDaily.FOLAC;
    const vitaminB12Percent: Nutrient = content!.totalDaily.VITB12;
    const vitaminDPercent: Nutrient = content!.totalDaily.VITD;
    const vitaminEPercent: Nutrient = content!.totalDaily.TOCPHA;
    const vitaminKPercent: Nutrient = content!.totalDaily.VITK1;

    if(!vitaminA && !vitaminC && !thiamin && !riboflavin && !niacin && !vitaminB6 && !folateDFE && !folateFood && !folicAcid && !vitaminB12 && !vitaminD && !vitaminE && !vitaminK) return (
        <div className={styles.container} style={{gridArea: 'vitamins', height: '100%'}}>
            <h3 className={styles.title}>Vitamins</h3>
            <div className={styles.info}>No information available.</div>
        </div>
   )
  
    if(mediaQuery && (mediaQuery as MediaQueryList).matches) 
    return (
        <div className={styles.container} style={{gridArea: 'vitamins', height: '100%'}}>
            <h3 className={styles.title}>Vitamins</h3>
            <div>
                <CircleRow nutrient={vitaminA} nutrientPercent={vitaminAPercent} label={'vitaminA'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={vitaminC} nutrientPercent={vitaminCPercent} label={'vitaminC'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={thiamin} nutrientPercent={thiaminPercent} label={'thiamin'} color={'var(--secondary-color-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={riboflavin} nutrientPercent={riboflavinPercent} label={'riboflavin'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={niacin} nutrientPercent={niacinPercent} label={'niacin'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={vitaminB6} nutrientPercent={vitaminB6Percent} label={'vitaminB6'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={folateDFE} nutrientPercent={folateDFEPercent} label={'folateDFE'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={folateFood} nutrientPercent={folateFoodPercent} label={'folateFood'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={folicAcid} nutrientPercent={folicAcidPercent} label={'folicAcid'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={vitaminB12} nutrientPercent={vitaminB12Percent} label={'vitaminB12'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={vitaminD} nutrientPercent={vitaminDPercent} label={'vitaminD'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={vitaminE} nutrientPercent={vitaminEPercent} label={'vitaminE'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <CircleRow nutrient={vitaminK} nutrientPercent={vitaminKPercent} label={'vitaminK'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
            </div>
        </div>
    );

    return (
        <div className={styles.container} style={{gridArea: 'vitamins'}}>
            <h3 className={styles.title}>Vitamins</h3>
            <div className={styles.bar_chart}>
                <BarColumn nutrient={vitaminA} nutrientPercent={vitaminAPercent} label={'vitaminA'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={vitaminC} nutrientPercent={vitaminCPercent} label={'vitaminC'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={thiamin} nutrientPercent={thiaminPercent} label={'thiamin'} color={'var(--secondary-color-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={riboflavin} nutrientPercent={riboflavinPercent} label={'riboflavin'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={niacin} nutrientPercent={niacinPercent} label={'niacin'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={vitaminB6} nutrientPercent={vitaminB6Percent} label={'vitaminB6'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={folateDFE} nutrientPercent={folateDFEPercent} label={'folateDFE'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={folateFood} nutrientPercent={folateFoodPercent} label={'folateFood'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={folicAcid} nutrientPercent={folicAcidPercent} label={'folicAcid'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={vitaminB12} nutrientPercent={vitaminB12Percent} label={'vitaminB12'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={vitaminD} nutrientPercent={vitaminDPercent} label={'vitaminD'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={vitaminE} nutrientPercent={vitaminEPercent} label={'vitaminE'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
                <BarColumn nutrient={vitaminK} nutrientPercent={vitaminKPercent} label={'vitaminK'} color={'var(--secondary-color)'} lightColor='var(--secondary-light-color)'/>
            </div>
        </div>
    );
}

export default VitaminsCard;