import BarColumn from './utils/bar_column';
import CircleRow from './utils/circle_row';
import { Nutrient, Nutrients } from '@/app/types/types';
import styles from './alanysis_card.module.css';

interface MineralsCardProps {
    content: Nutrients | null;
}

const MineralsCard = ({ content }: MineralsCardProps) => {

    let mediaQuery: MediaQueryList | null = null;

    if(typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(max-width: 500px)');
    }

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

   if(mediaQuery && (mediaQuery as MediaQueryList).matches) 
   return (
       <div className={styles.container} style={{gridArea: 'minerals', height: '100%'}}>
           <h3 className={styles.title}>Minerals</h3>
           <div>
               <CircleRow nutrient={sodium} nutrientPercent={sodiumPercent} label={'sodium'} color={'var(--primary-color)'} lightColor='var(--primary-light-color)'/>
               <CircleRow nutrient={calcium} nutrientPercent={calciumPercent} label={'calcium'} color={'var(--primary-color)'} lightColor='var(--primary-light-color)'/>
               <CircleRow nutrient={magnesium} nutrientPercent={magnesiumPercent} label={'magnesium'} color={'var(--secondary-color-color)'} lightColor='var(--primary-light-color)'/>
               <CircleRow nutrient={potassium} nutrientPercent={potassiumPercent} label={'potassium'} color={'var(--primary-color)'} lightColor='var(--primary-light-color)'/>
               <CircleRow nutrient={iron} nutrientPercent={ironPercent} label={'iron'} color={'var(--primary-color)'} lightColor='var(--primary-light-color)'/>
               <CircleRow nutrient={zinc} nutrientPercent={zincPercent} label={'zinc'} color={'var(--primary-color)'} lightColor='var(--primary-light-color)'/>
               <CircleRow nutrient={phosphorus} nutrientPercent={phosphorusPercent} label={'phosphorus'} color={'var(--primary-color)'} lightColor='var(--primary-light-color)'/>
           </div>
       </div>
   );
 
    return (
        <div className={styles.container} style={{gridArea: 'minerals'}}>
            <h3 className={styles.title}>Minerals</h3>
            <div className={styles.bar_chart}>
                <BarColumn 
                    nutrient={sodium} 
                    nutrientPercent={sodiumPercent} 
                    label={'sodium'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)'/>
                <BarColumn 
                    nutrient={calcium} 
                    nutrientPercent={calciumPercent} 
                    label={'calcium'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)'/>
                <BarColumn 
                    nutrient={magnesium} 
                    nutrientPercent={magnesiumPercent} 
                    label={'magnesium'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
                <BarColumn 
                    nutrient={potassium} 
                    nutrientPercent={potassiumPercent} 
                    label={'potassium'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
                <BarColumn 
                    nutrient={iron} 
                    nutrientPercent={ironPercent} 
                    label={'iron'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
                <BarColumn 
                    nutrient={zinc} 
                    nutrientPercent={zincPercent} 
                    label={'zinc'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
                <BarColumn 
                    nutrient={phosphorus} 
                    nutrientPercent={phosphorusPercent} 
                    label={'phosphorus'} 
                    color={'var(--primary-color)'} 
                    lightColor='var(--primary-light-color)' />
            </div>
        </div>
    );
}

export default MineralsCard;
    
