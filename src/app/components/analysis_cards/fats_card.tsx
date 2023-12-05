import styles from './alanysis_card.module.css'
import { Nutrients, Nutrient } from '@/app/types/types';

interface FatsCardProps {
    content: Nutrients | null;
}

const FatsCard = ({ content }: FatsCardProps) => {

   const fat: Nutrient = content!.totalNutrients.FAT;
   const satFat: Nutrient = content!.totalNutrients.FASAT;
   const transFat: Nutrient = content!.totalNutrients.FATRN;
   const monounsatFat: Nutrient = content!.totalNutrients.FAMS;
   const polyunsatFat: Nutrient = content!.totalNutrients.FAPU;
 
    return <div className={styles.container}>
        <div style={{overflow: 'auto'}}>
            <p>{`${fat.label}: ${fat.quantity} ${fat.unit} `}</p>
            <p>{`${satFat.label}: ${satFat.quantity} ${satFat.unit}`}</p>
            <p>{`${transFat.label}: ${transFat.quantity} ${transFat.unit}`}</p>
            <p>{`${monounsatFat.label}: ${monounsatFat.quantity} ${monounsatFat.unit}`}</p>
            <p>{`${polyunsatFat.label}: ${polyunsatFat.quantity} ${polyunsatFat.unit}`}</p>
        </div>
    </div>
}

export default FatsCard