import styles from './page.module.css'
import { parseQuery, autocomplete } from '@/app/services/fetch-data'
import { useState, useContext, useEffect, FormEvent, KeyboardEvent } from 'react' 
import PageGrid from '@/app/components/slider/page-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { CardOpenContext } from '@/app/context/card-context';
import { Food, CardState} from '@/app/types/types';
import FoodCard from '@/app/components/cards/food-cards/food-card';

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
			if(foodArr.find((food: Food) => food.food.foodId === hint.food.foodId) || hint.food.category !== "Generic foods") {
				return;
			} else {
				foodArr.push(hint);
			}
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
		if(cardOpen == CardState.OPEN) {
			setShowOptions(false);
		}
	}, [cardOpen])

    const foodList: JSX.Element[] = foodArr.map((hint, index) => {
		return (
			<FoodCard food={hint} index={index + 1} key={index + 1} id={null} open={false}/>
		)
	})

    const style = () => {
        if(cardOpen == CardState.OPEN) {
            return {overflow: 'hidden'}
        } else {
            return {overflow: 'auto'}
        }
    }

    return (
        <div className={styles.container} style={style()}>
            {cardOpen != CardState.OPEN && <div className={styles.input_container}>
                <input 
                    type="text" 
                    className={showOptions ? `${styles.search} ${styles.expanded}` : styles.search } placeholder='search food' 
                    onClick={() => setShowOptions(true)} 
                    onInput={e => handleInput(e)} 
                    value={input} 
                    onKeyUp={handleEnterKey}/>
                {!showOptions && <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    className={styles.searchIcon}/>}
                {showOptions && <FontAwesomeIcon 
                    icon={faArrowLeft} 
                    className={styles.backIcon} 
                    onClick={handleBackclick}/>}
                {showOptions && <FontAwesomeIcon 
                    icon={faXmark} 
                    className={styles.deleteIcon} 
                    onClick={emptyInput}/>}
            </div>}
            {showOptions && <Options 
                queryOptions={queryOptions} 
                onclick={(e: any) => handleOptionClick(e.target as HTMLLIElement)}/>}
            {foodArr.length > 0 && <PageGrid>{foodList}</PageGrid>}
        </div>
    )
}

export default FoodSearch;


interface OptionsProps {
	queryOptions: string[] | null;
	onclick: (e: any) => Promise<void>;
}

const Options = ({queryOptions, onclick}: OptionsProps): JSX.Element => {
    
	return (
	<div className={styles.options}>
        <ul>
            <li onClick={onclick}>{queryOptions ? queryOptions[0] : 'apple'}</li>
            <li onClick={onclick}>{queryOptions ? queryOptions[1] : 'rice'}</li>
            <li onClick={onclick}>{queryOptions ? queryOptions[2] : 'broccoli'}</li>
        </ul>
	</div>
	)
}