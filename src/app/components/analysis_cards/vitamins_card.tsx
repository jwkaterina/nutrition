import styles from './alanysis_card.module.css'
import { Nutrients, Nutrient } from '@/app/types/types';

interface VitaminsCardProps {
    content: Nutrients | null;
}

const VitaminsCard = ({ content }: VitaminsCardProps) => {

    // const TotalNutrients = () => {
    //     let nutrientsArr: Nutrient[] = [];
    //     const nutrients: any = content!.totalNutrients;
    //     for(const key in content!.totalNutrients) {
    //         nutrientsArr.push(nutrients[key]);
            
    //     }
    //     // console.log(nutrientsArr.length)
    //     return nutrientsArr.map((nutrient, index) => {
    //         return <p key={index}>{`${nutrient.label}: ${nutrient.quantity} ${nutrient.unit} `}</p>
    //     })
    // }

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
 
    return <div className={styles.container}>
        <div style={{overflow: 'auto'}}>
            {/* <TotalNutrients /> */}
            <p>{`${vitaminA.label}: ${vitaminA.quantity} ${vitaminA.unit} `}</p>
            <p>{`${vitaminC.label}: ${vitaminC.quantity} ${vitaminC.unit}`}</p>
            <p>{`${thiamin.label}: ${thiamin.quantity} ${thiamin.unit}`}</p>
            <p>{`${riboflavin.label}: ${riboflavin.quantity} ${riboflavin.unit}`}</p>
            <p>{`${niacin.label}: ${niacin.quantity} ${vitaminC.unit}`}</p>
            <p>{`${vitaminB6.label}: ${vitaminB6.quantity} ${vitaminB6.unit}`}</p>
            <p>{`${folateDFE.label}: ${folateDFE.quantity} ${folateDFE.unit}`}</p>
            <p>{`${folateFood.label}: ${folateFood.quantity} ${folateFood.unit}`}</p>
            <p>{`${folicAcid.label}: ${folicAcid.quantity} ${folicAcid.unit}`}</p>
            <p>{`${vitaminB12.label}: ${vitaminB12.quantity} ${vitaminB12.unit}`}</p>
            <p>{`${vitaminD.label}: ${vitaminD.quantity} ${vitaminD.unit}`}</p>
            <p>{`${vitaminE.label}: ${vitaminE.quantity} ${vitaminE.unit}`}</p>
            <p>{`${vitaminK.label}: ${vitaminK.quantity} ${vitaminK.unit}`}</p>
        </div>
    </div>
}

export default VitaminsCard