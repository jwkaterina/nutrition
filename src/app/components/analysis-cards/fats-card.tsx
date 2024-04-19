import Arc from './diagrams/arc';
import SmallCircle from './diagrams/small-circle';
import { Nutrients, Nutrient } from '@/app/types/types';
import styles from './alanysis-card.module.css';

interface FatsCardProps {
    content: Nutrients | null;
}

const FatsCard = ({ content }: FatsCardProps) => {

    const totalFat: Nutrient | undefined = content?.totalNutrients.FAT;
    const satFat: Nutrient | undefined = content?.totalNutrients.FASAT;
    const transFat: Nutrient | undefined = content?.totalNutrients.FATRN;
    const monounsatFat: Nutrient | undefined = content?.totalNutrients.FAMS;
    const polyunsatFat: Nutrient | undefined = content?.totalNutrients.FAPU;

    let  transfatPercent: number | null = null, 
    satfatPercent: number | null = null, 
    monounsatfatPercent: number | null = null, 
    polyunsatfatPercent: number | null = null, 
    restPercent: number | null = null;

    if(totalFat && transFat) transfatPercent = transFat.quantity * 100 / totalFat.quantity;
    if(transFat && transFat.quantity == 0) transfatPercent = 0.1;
    if(totalFat && satFat) satfatPercent = satFat.quantity * 100 / totalFat.quantity;
    if(satFat && satFat.quantity == 0) satfatPercent = 0.1;
    if(totalFat && monounsatFat) monounsatfatPercent = monounsatFat.quantity * 100 / totalFat.quantity;
    if(monounsatFat && monounsatFat.quantity == 0) monounsatfatPercent = 0.1;
    if(totalFat && polyunsatFat) polyunsatfatPercent = polyunsatFat.quantity * 100 / totalFat.quantity;
    if(polyunsatFat && polyunsatFat.quantity == 0) polyunsatfatPercent = 0.1;
    if(totalFat && satFat && transFat && monounsatFat && polyunsatFat) restPercent = 100 - (satFat.quantity + transFat.quantity + monounsatFat.quantity + polyunsatFat.quantity) * 100 / totalFat.quantity;


    if(!polyunsatfatPercent || !satfatPercent || !transfatPercent || !monounsatfatPercent || !restPercent) return (
        <div className={styles.container} style={{gridArea: 'fats'}}>
            <h3  className={styles.title}>Fatty acids</h3>
            <div className={styles.info}>No information available.</div>
        </div>
    );

    const transDeg = 0;

    const satDeg: number = transfatPercent / 100 * 360;
    const monounsatDeg: number = (satfatPercent + transfatPercent!) / 100 * 360;
    const polyunsatDeg: number = (monounsatfatPercent + satfatPercent + transfatPercent) / 100 * 360;
    const restDeg: number = (monounsatfatPercent + satfatPercent + transfatPercent + polyunsatfatPercent) / 100 * 360;

    const radius: number = 50;
    const strokeWidth: number = 15;
    const widthHeight: number = 2 * radius + 2 * strokeWidth;

    return (
        <div className={styles.container} style={{gridArea: 'fats'}}>
            <h3  className={styles.title}>Fatty acids</h3>
            <div className={styles.fats_grid}>
                <div className={styles.composition_donut}>
                    <Arc degree={transDeg} percent={transfatPercent} color='var(--tertiary-darker)' radius={radius} strokeWidth={strokeWidth} />
                    <Arc degree={satDeg} percent={satfatPercent} color='var(--tertiary-color)' radius={radius} strokeWidth={strokeWidth} />
                    <Arc degree={monounsatDeg} percent={monounsatfatPercent} color='var(--tertiary-lighter)' radius={radius} strokeWidth={strokeWidth} />
                    <Arc degree={polyunsatDeg} percent={polyunsatfatPercent} color='var(--tertiary-light)' radius={radius} strokeWidth={strokeWidth} />
                    <Arc degree={restDeg} percent={restPercent} color='var(--tertiary-lightest)' radius={radius} strokeWidth={strokeWidth} />
                </div>
                <div className={styles.composition_column} style={{height: widthHeight}}>
                    <SmallCircle percent={transfatPercent} color='var(--tertiary-darker)' text='trans' heightWidth={15}/>
                    <SmallCircle percent={satfatPercent} color='var(--tertiary-color)' text='saturated' heightWidth={15}/>
                    <SmallCircle percent={monounsatfatPercent} color='var(--tertiary-lighter)' text='monounsaturated' heightWidth={15}/>
                    <SmallCircle percent={polyunsatfatPercent} color='var(--tertiary-light)' text='polyunsaturated' heightWidth={15}/>
                    <SmallCircle percent={restPercent} color='var(--tertiary-lightest)' text='rest' heightWidth={15}/>
                </div>
            </div>
        </div>
    );
}

export default FatsCard;