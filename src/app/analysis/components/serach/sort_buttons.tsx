import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { SortType } from '@/app/types/types';
import styles from './search.module.css';

interface SortButtonsProps {
	sort: SortType;
	setSort: (sort: SortType) => void;
}

const SortButtons = ({ sort, setSort }: SortButtonsProps): JSX.Element => {

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
		}	
	}

	return (
		<div className={styles.sort_buttons}>
			<div className={styles.filter_button}>
				<p>Filter</p>
				<FontAwesomeIcon icon={faSliders} />
			</div>
			<div className={styles.sort_button}>
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
	)
}

export default SortButtons;