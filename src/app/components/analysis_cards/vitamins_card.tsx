import styles from './alanysis_card.module.css'
import { Nutrients, Nutrient } from '@/app/types/types';
import BarColumn from './utils/bar_column';

interface VitaminsCardProps {
    content: Nutrients | null;
}

const VitaminsCard = ({ content }: VitaminsCardProps): JSX.Element => {

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
  
    return <div className={styles.container}>
        <h3>Minerals</h3>
        <div style={{overflow: 'auto'}} className={styles.bar_chart}>
            <BarColumn vitamin={vitaminA} vitaminPercent={vitaminAPercent} label={'vitaminA'}/>
            <BarColumn vitamin={vitaminC} vitaminPercent={vitaminCPercent} label={'vitaminC'}/>
            <BarColumn vitamin={thiamin} vitaminPercent={thiaminPercent} label={'thiamin'}/>
            <BarColumn vitamin={riboflavin} vitaminPercent={riboflavinPercent} label={'riboflavin'}/>
            <BarColumn vitamin={niacin} vitaminPercent={niacinPercent} label={'niacin'}/>
            <BarColumn vitamin={vitaminB6} vitaminPercent={vitaminB6Percent} label={'vitaminB6'}/>
            <BarColumn vitamin={folateDFE} vitaminPercent={folateDFEPercent} label={'folateDFE'}/>
            <BarColumn vitamin={folateFood} vitaminPercent={folateFoodPercent} label={'folateFood'}/>
            <BarColumn vitamin={folicAcid} vitaminPercent={folicAcidPercent} label={'folicAcid'}/>
            <BarColumn vitamin={vitaminB12} vitaminPercent={vitaminB12Percent} label={'vitaminB12'}/>
            <BarColumn vitamin={vitaminD} vitaminPercent={vitaminDPercent} label={'vitaminD'}/>
            <BarColumn vitamin={vitaminE} vitaminPercent={vitaminEPercent} label={'vitaminE'}/>
            <BarColumn vitamin={vitaminK} vitaminPercent={vitaminKPercent} label={'vitaminK'}/>
        </div>
    </div>
}

export default VitaminsCard