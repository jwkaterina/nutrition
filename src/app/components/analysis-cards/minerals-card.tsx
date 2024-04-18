import BarColumn from './diagrams/bar-column';
import CircleRow from './diagrams/circle-row';
import { Nutrient, Nutrients } from '@/app/types/types';
import styles from './alanysis-card.module.css';

interface MineralsCardProps {
    content: Nutrients | null;
}

const MineralsCard = ({ content }: MineralsCardProps) => {

    let mediaQuery: MediaQueryList | null = null;

    if(typeof window !== 'undefined') {
        mediaQuery = window.matchMedia('(max-width: 500px)');
    }

   const sodium: Nutrient | undefined = content?.totalNutrients.NA;
   const calcium: Nutrient | undefined = content?.totalNutrients.CA;
   const magnesium: Nutrient | undefined = content?.totalNutrients.MG;
   const potassium: Nutrient | undefined = content?.totalNutrients.K;
   const iron: Nutrient | undefined = content?.totalNutrients.FE;
   const zinc: Nutrient | undefined = content?.totalNutrients.ZN;
   const phosphorus: Nutrient | undefined = content?.totalNutrients.P;

   const sodiumPercent: Nutrient | undefined = content?.totalDaily.NA;
   const calciumPercent: Nutrient | undefined = content?.totalDaily.CA;
   const magnesiumPercent: Nutrient | undefined = content?.totalDaily.MG;
   const potassiumPercent: Nutrient | undefined = content?.totalDaily.K;
   const ironPercent: Nutrient | undefined = content?.totalDaily.FE;
   const zincPercent: Nutrient | undefined = content?.totalDaily.ZN;
   const phosphorusPercent: Nutrient | undefined = content?.totalDaily.P;

   if(!sodium && !calcium && !magnesium && !potassium && !iron && !zinc && !phosphorus) return (
        <div className={styles.container} style={{gridArea: 'minerals', height: '100%'}}>
            <h3 className={styles.title}>Minerals</h3>
            <div className={styles.info}>No information available.</div>
        </div>
   )

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
    
