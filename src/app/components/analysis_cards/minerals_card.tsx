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
 
    return <div className={styles.container}>
        <div style={{overflow: 'auto'}}>
            <p>{`${sodium.label}: ${sodium.quantity} ${sodium.unit} `}</p>
            <p>{`${calcium.label}: ${calcium.quantity} ${calcium.unit}`}</p>
            <p>{`${magnesium.label}: ${magnesium.quantity} ${magnesium.unit}`}</p>
            <p>{`${potassium.label}: ${potassium.quantity} ${potassium.unit}`}</p>
            <p>{`${iron.label}: ${iron.quantity} ${iron.unit}`}</p>
            <p>{`${zinc.label}: ${zinc.quantity} ${zinc.unit}`}</p>
            <p>{`${phosphorus.label}: ${phosphorus.quantity} ${phosphorus.unit}`}</p>
        </div>
    </div>
}

export default MineralsCard