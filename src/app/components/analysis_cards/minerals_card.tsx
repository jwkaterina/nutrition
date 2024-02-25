import BarColumn from './utils/bar_column';
import { Nutrient, Nutrients } from '@/app/types/types';
import styles from './alanysis_card.module.css';

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
 
    return (
        <div className={styles.container} style={{gridArea: 'minerals'}}>
            <h3 className={styles.title}>Minerals</h3>
            <div className={styles.bar_chart}>
                <BarColumn 
                    vitamin={sodium} 
                    vitaminPercent={sodiumPercent} 
                    label={'sodium'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)'/>
                <BarColumn 
                    vitamin={calcium} 
                    vitaminPercent={calciumPercent} 
                    label={'calcium'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)'/>
                <BarColumn 
                    vitamin={magnesium} 
                    vitaminPercent={magnesiumPercent} 
                    label={'magnesium'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
                <BarColumn 
                    vitamin={potassium} 
                    vitaminPercent={potassiumPercent} 
                    label={'potassium'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
                <BarColumn 
                    vitamin={iron} 
                    vitaminPercent={ironPercent} 
                    label={'iron'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
                <BarColumn 
                    vitamin={zinc} 
                    vitaminPercent={zincPercent} 
                    label={'zinc'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
                <BarColumn 
                    vitamin={phosphorus} 
                    vitaminPercent={phosphorusPercent} 
                    label={'phosphorus'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
            </div>
        </div>
    );
}

export default MineralsCard;
    
