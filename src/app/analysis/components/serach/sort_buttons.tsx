import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import Toggler from './toggler';
import { FoodType, SortType } from '@/app/types/types';
import styles from './search.module.css';
import { useRef, useEffect } from 'react';

interface SortButtonsProps {
	setSort: (sort: SortType) => void;
    setFilter: (filter: FoodType[]) => void;
    filter: FoodType[];
	isOpen: boolean;
	setOpen: (open: boolean) => void;
}

const SortButtons = ({ setSort, setFilter, filter, isOpen, setOpen }: SortButtonsProps): JSX.Element => {

	const ref = useRef(null);

	useEffect(() => {
		const checkIfClickedOutside = (e: MouseEvent) => {
			if (ref.current && !(ref.current as HTMLElement).contains(e.target as HTMLElement)) {
				setOpen(false)
			};
		}
		document.addEventListener("click", checkIfClickedOutside);
		return () => {
			document.removeEventListener("click", checkIfClickedOutside);
		}
	}, [isOpen]);

	const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const select = e.target;
        const selectedElement = select.children[select.selectedIndex];
		switch((selectedElement as HTMLSelectElement).value) {
			case 'More Calories':
				setSort(SortType.ASC_Calories);
				break;
			case 'Less Calories':
				setSort(SortType.DESC_Calories);
				break;
			case 'More Protein':
				setSort(SortType.ASC_Protein);
				break;
			case 'Less Protein':
				setSort(SortType.DESC_Protein);
				break;
			case 'More Fat':
				setSort(SortType.ASC_Fat);
				break;
			case 'Less Fat':
				setSort(SortType.DESC_Fat);
				break;
			case 'More Carbs':
				setSort(SortType.ASC_Carbs);
				break;
			case 'Less Carbs':
				setSort(SortType.DESC_Carbs);
				break;
			default:
				setSort(SortType.DEFAULT);
				break;
		};	
	}

	return (
		<div className={styles.sort_buttons}>
			<div className={styles.filter_dropdown} ref={ref}>
				<button className={styles.dropbtn} onClick={() => setOpen(!isOpen)}>
                    Filter <FontAwesomeIcon icon={faSliders} className={styles.filter_icon}/>
                </button>
                {isOpen && (
                    <div className={styles.dropdown_content}>
                        <Toggler foodType={FoodType.GENERIC_FOODS} setFilter={setFilter} filter={filter}/>
                        <Toggler foodType={FoodType.PACKAGED_FOODS} setFilter={setFilter} filter={filter}/>
                        <Toggler foodType={FoodType.GENERIC_MEALS} setFilter={setFilter} filter={filter}/>
                        <Toggler foodType={FoodType.FAST_FOODS} setFilter={setFilter} filter={filter}/>
                    </div>
                )}
			</div>
			<div className={styles.sort_select}>
				<select onChange={(e) => handleOptionChange(e)}>
					<option key={0}>Sort</option>
					<option key={1}>More Calories</option>
					<option key={2}>Less Calories</option>
					<option key={3}>More Protein</option>
					<option key={4}>Less Protein</option>
					<option key={5}>More Fat</option>
					<option key={6}>Less Fat</option>
					<option key={7}>More Carbs</option>
					<option key={8}>Less Carbs</option>
				</select>				
			</div>
		</div>
	);
}

export default SortButtons;