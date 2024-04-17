import { FoodType } from '@/app/types/types';
import styles from './search.module.css';

interface TogglerProps {
    foodType: FoodType;
    setFilter: (filter: FoodType[]) => void;
    filter: FoodType[];
}

const Toggler = ({ foodType, setFilter, filter }: TogglerProps): JSX.Element => {

    const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked) {
            setFilter([...filter, foodType])
        } else {
            setFilter(filter.filter(item => item !== foodType));
        }
    }

    return (
        <div className={styles.dropdown_row}>
            <span>{foodType}</span>
            <label className={styles.toggler_wrapper}>
            <input type="checkbox" checked={filter.includes(foodType)} onChange={handleCheckboxClick}></input>
                <div className={styles.toggler_slider}>
                    <div className={styles.toggler_knob}></div>
                </div>
            </label>
        </div>
    );
}

export default Toggler;