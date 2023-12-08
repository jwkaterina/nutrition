import styles from './alanysis_card.module.css'
import { Nutrients, Nutrient } from '@/app/types/types';
import Arc from './utils/arc';
import SmallCircle from './utils/small_circle';

interface FatsCardProps {
    content: Nutrients | null;
}

const FatsCard = ({ content }: FatsCardProps) => {

    const totalFat: Nutrient = content!.totalNutrients.FAT;
    const satFat: Nutrient = content!.totalNutrients.FASAT;
    const transFat: Nutrient = content!.totalNutrients.FATRN;
    const monounsatFat: Nutrient = content!.totalNutrients.FAMS;
    const polyunsatFat: Nutrient = content!.totalNutrients.FAPU;

    let  transfatPercent = null, satfatPercent = null, monounsatfatPercent = null, polyunsatfatPercent = null, restPercent = null;
    if(totalFat && transFat) transfatPercent = transFat.quantity * 100 / totalFat.quantity;
    if(transFat && transFat.quantity == 0) transfatPercent = 0.1;
    if(totalFat && satFat) satfatPercent = satFat.quantity * 100 / totalFat.quantity;
    if(satFat && satFat.quantity == 0) satfatPercent = 0.1;
    if(totalFat && monounsatFat) monounsatfatPercent = monounsatFat.quantity * 100 / totalFat.quantity;
    if(monounsatFat && monounsatFat.quantity == 0) monounsatfatPercent = 0.1;
    if(totalFat && polyunsatFat) polyunsatfatPercent = polyunsatFat.quantity * 100 / totalFat.quantity;
    if(polyunsatFat && polyunsatFat.quantity == 0) polyunsatfatPercent = 0.1;
    if(totalFat && satFat && transFat && monounsatFat && polyunsatFat) restPercent = 100 - (satFat.quantity + transFat.quantity + monounsatFat.quantity + polyunsatFat.quantity) * 100 / totalFat.quantity;

    let transDeg = null, satDeg = null, monounsatDeg = null, polyunsatDeg = null, restDeg = null;
    transDeg = 0;
    if(transfatPercent ) satDeg = transfatPercent / 100 * 360;
    if(satfatPercent && transfatPercent) monounsatDeg = (satfatPercent + transfatPercent!) / 100 * 360;
    if(satfatPercent && monounsatfatPercent && transfatPercent) polyunsatDeg = (monounsatfatPercent + satfatPercent + transfatPercent) / 100 * 360;
    if(satfatPercent && monounsatfatPercent && polyunsatfatPercent && transfatPercent) restDeg = (monounsatfatPercent + satfatPercent + transfatPercent + polyunsatfatPercent) / 100 * 360;

    const radius = 50;
    const strokeWidth = 15;
    const widthHeight = 2 * radius + 2 * strokeWidth;

    console.log(transfatPercent, satfatPercent, monounsatfatPercent, polyunsatfatPercent, restPercent, totalFat.quantity);

    if(!polyunsatfatPercent || !satfatPercent || !transfatPercent || !monounsatfatPercent || !restPercent) return <></>

    return (
        <div className={styles.container} style={{gridArea: 'fats'}}>
            <h3>Fatty acids</h3>
            <div className={styles.fats_grid}>
                <div className={styles.composition_donut} style={{width: widthHeight}}>
                    <Arc degree={transDeg} percent={transfatPercent} color='var(--tertiary-darker)' radius={50} strokeWidth={15} />
                    <Arc degree={satDeg} percent={satfatPercent} color='var(--tertiary-color)' radius={50} strokeWidth={15} />
                    <Arc degree={monounsatDeg} percent={monounsatfatPercent} color='var(--tertiary-lighter)' radius={50} strokeWidth={15} />
                    <Arc degree={polyunsatDeg} percent={polyunsatfatPercent} color='var(--tertiary-light)' radius={50} strokeWidth={15} />
                    <Arc degree={restDeg} percent={restPercent} color='var(--tertiary-lightest)' radius={50} strokeWidth={15} />
                </div>
                <div className={styles.composition_column} style={{height: widthHeight}}>
                    <SmallCircle percent={transfatPercent} color='var(--tertiary-darker)' text='trans'/>
                    <SmallCircle percent={satfatPercent} color='var(--tertiary-color)' text='saturated'/>
                    <SmallCircle percent={monounsatfatPercent} color='var(--tertiary-lighter)' text='monounsaturated'/>
                    <SmallCircle percent={polyunsatfatPercent} color='var(--tertiary-light)' text='polyunsaturated'/>
                    <SmallCircle percent={restPercent} color='var(--tertiary-lightest)' text='rest'/>
                </div>
            </div>
        </div>
    )
}

export default FatsCard