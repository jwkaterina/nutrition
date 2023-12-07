import styles from './alanysis_card.module.css'
import { Nutrient, Nutrients } from '@/app/types/types';
import BarColumn from './utils/bar_column';

interface MineralsCardProps {
    content: Nutrients | null;
}

const MineralsCard = ({ content }: MineralsCardProps) => {

   const sodium: Nutrient = content!.totalNutrients.NA;
   const calcium: Nutrient = content!.totalNutrients.CA;
   const magnesium: Nutrient = content!.totalNutrients.MG;
   const potassium: Nutrient = content!.totalNutrients.K;
   const iron: Nutrient = content!.totalNutrients.FE;
   const zinc: Nutrient = content!.totalNutrients.ZN;
   const phosphorus: Nutrient = content!.totalNutrients.P;

   const sodiumPercent: Nutrient = content!.totalDaily.NA;
   const calciumPercent: Nutrient = content!.totalDaily.CA;
   const magnesiumPercent: Nutrient = content!.totalDaily.MG;
   const potassiumPercent: Nutrient = content!.totalDaily.K;
   const ironPercent: Nutrient = content!.totalDaily.FE;
   const zincPercent: Nutrient = content!.totalDaily.ZN;
   const phosphorusPercent: Nutrient = content!.totalDaily.P;

   const barHeight = 100;
 
    return <div className={styles.container}>
        <h3>Minerals</h3>
        <div style={{overflow: 'auto'}} className={styles.bar_chart}>
            <BarColumn vitamin={sodium} vitaminPercent={sodiumPercent} label={'sodium'}/>
            <BarColumn vitamin={calcium} vitaminPercent={calciumPercent} label={'calcium'}/>
            <BarColumn vitamin={magnesium} vitaminPercent={magnesiumPercent} label={'magnesium'}/>
            <BarColumn vitamin={potassium} vitaminPercent={potassiumPercent} label={'potassium'}/>
            <BarColumn vitamin={iron} vitaminPercent={ironPercent} label={'iron'}/>
            <BarColumn vitamin={zinc} vitaminPercent={zincPercent} label={'zinc'}/>
            <BarColumn vitamin={phosphorus} vitaminPercent={phosphorusPercent} label={'phosphorus'}/>
        </div>
    </div>
}

export default MineralsCard
    
