import styles from './search.module.css'
import { parseQuery, autocomplete } from '@/app/services/fetch-data'
import { useState, useContext, useEffect, useRef, FormEvent, KeyboardEvent } from 'react' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMagnifyingGlass, faXmark, faSliders } from '@fortawesome/free-solid-svg-icons'
import { CardOpenContext } from '@/app/context/card-context';
import { Food, CardState, SortType} from '@/app/types/types';
import FoodList from './food-list';
import SortButtons from './sort_buttons';
import Options from './options';

interface FoodSearchProps {
	searchCleared: boolean,
	setClearSearch: (clearSearch: boolean) => void
}

const FoodSearch = ({ searchCleared, setClearSearch }: FoodSearchProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
	const [foodArr, setFoodArr] = useState<Food[]>([]);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [queryOptions, setQueryOptions] = useState<string[] | null>(null);
	const [input, setInput] = useState('');
	const [sort, setSort] = useState<SortType>(SortType.DEFAULT);

	const searchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setCardOpen(CardState.CLOSED);
	}, [])

	useEffect(() => {
		if(searchCleared) {
			setFoodArr([]);
			setInput('');
			setShowOptions(false);
			setQueryOptions(null);
			setClearSearch(false);
		}
	}, [searchCleared])

	const handleInput = async(e: FormEvent) => {
		const inputValue = (e.target as HTMLInputElement).value;
		setInput(inputValue);
	
		const result: string[] = await autocomplete(inputValue || '');
		setShowOptions(true);
		setQueryOptions(result);
	}

	const handleOptionClick = async(option: HTMLLIElement) => {

		setShowOptions(false);
		setQueryOptions(null);
		setCardOpen(CardState.CLOSED);
		setInput(option.innerText);

		const result = await parseQuery(option.innerText);
		if(result) addHintsToArray(result.hints);
	}

	const handleEnterKey = async(e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			setShowOptions(false);
			setCardOpen(CardState.CLOSED);
			const result = await parseQuery(input);
			if(result) addHintsToArray(result.hints);    
		}
	}

	const addHintsToArray = (hints: Food[]) => {
		let foodArr: Food[] = [];
		if(!hints) return;
		hints.forEach((hint: Food) => {
			// if(foodArr.find((food: Food) => food.food.foodId === hint.food.foodId) || hint.food.category !== "Generic foods") {
			// 	return;
			// } else {
				foodArr.push(hint);
			// }
		});
		setFoodArr(foodArr);
	}

	const handleBackclick = () => {
		setShowOptions(false);
		emptyInput();
	}

	const emptyInput = () => {
		setInput('');
		setQueryOptions(null);
	}

	useEffect(() => {
		if(cardOpen == CardState.OPEN && searchRef.current) {
			setShowOptions(false);
			(searchRef.current as HTMLElement).scrollTo({
                top: 0,
                left: 0,
                behavior: "auto",
            });
		}
	}, [cardOpen])

	const showFilter: boolean = cardOpen !== CardState.OPEN && !showOptions && foodArr.length != 0;

    const style = () => {
        if(cardOpen == CardState.OPEN) {
            return {overflow: 'hidden'}
        } else {
            return {overflow: 'auto'}
        }
    }

    return (
        <div className={styles.container} style={style()} ref={searchRef}>
            {cardOpen != CardState.OPEN && <div className={styles.input_container}>
                <input 
                    type="text" 
                    className={showOptions ? `${styles.search} ${styles.expanded}` : styles.search } placeholder='search food' 
                    onClick={() => setShowOptions(true)} 
                    onInput={e => handleInput(e)} 
                    value={input} 
                    onKeyUp={handleEnterKey}
				/>
                {!showOptions && <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className={styles.searchIcon}
				/>}
                {showOptions && <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className={styles.backIcon} 
                    onClick={handleBackclick}
				/>}
                {showOptions && <FontAwesomeIcon 
                    icon={faXmark} 
                    className={styles.deleteIcon} 
                    onClick={emptyInput}
				/>}
            </div>}
            {showOptions && <Options 
                queryOptions={queryOptions} 
                onclick={(e: any) => handleOptionClick(e.target as HTMLLIElement)}
			/>}
			{showFilter && <SortButtons sort={sort} setSort={setSort} />}
            {foodArr.length > 0 && <FoodList foodArr={foodArr} sort={sort}/>}
        </div>
    )
}

export default FoodSearch;