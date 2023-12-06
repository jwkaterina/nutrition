import styles from './alanysis_card.module.css'
import { Nutrients, Nutrient } from '@/app/types/types';

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

   const sodiumPercent: number = content!.totalDaily.NA.quantity / 100;
   const calciumPercent: number = content!.totalDaily.CA.quantity / 100;
   const magnesiumPercent: number = content!.totalDaily.MG.quantity / 100;
   const potassiumPercent: number = content!.totalDaily.K.quantity / 100;
   const ironPercent: number = content!.totalDaily.FE.quantity / 100;
   const zincPercent: number = content!.totalDaily.ZN.quantity / 100;
   const phosphorusPercent: number = content!.totalDaily.P.quantity / 100;

   const barHeight = 100;
 
    return <div className={styles.container}>
        <h3>Minerals</h3>
        <div style={{overflow: 'auto'}} className={styles.bar_chart}>
            <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`}}>
                    <div className={styles.percent_bar} style={{height: `${sodiumPercent * barHeight}px`}}></div>
                </div>
                <p>sodium</p>
            </div>
            <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`}}>
                    <div className={styles.percent_bar} style={{height: `${calciumPercent * barHeight}px`}}></div>
                </div>                
                <p>calcium</p>
            </div>
            <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`}}>
                    <div className={styles.percent_bar} style={{height: `${magnesiumPercent * barHeight}px`}}></div>
                </div>                
                <p>magnesium</p>
            </div>
            <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`}}>
                    <div className={styles.percent_bar} style={{height: `${potassiumPercent * barHeight}px`}}></div>
                </div>                
                <p>potassium</p>
            </div>
            <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`}}>
                    <div className={styles.percent_bar} style={{height: `${ironPercent * barHeight}px`}}></div>
                </div>                
                <p>iron</p>
            </div>
            <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`}}>
                    <div className={styles.percent_bar} style={{height: `${zincPercent * barHeight}px`}}></div>
                </div>                
                <p>zinc</p>
            </div>
            <div className={styles.bar_column}>
                <div className={styles.bar} style={{height: `${barHeight}px`}}>
                    <div className={styles.percent_bar} style={{height: `${phosphorusPercent * barHeight}px`}}></div>
                </div>                
                <p>phosphorus</p>
            </div>
        </div>
    </div>
}

export default MineralsCard