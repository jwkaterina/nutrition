import styles from './search.module.css'
import { useState, useContext, useEffect, useRef, FormEvent, KeyboardEvent } from 'react' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { CardOpenContext } from '@/app/context/card-context';
import { Food, CardState, SortType} from '@/app/types/types';
import { useHttpClient} from '@/app/hooks/http-hook';
import { StatusContext } from '@/app/context/status-context';
import FoodList from './food-list';
import SortButtons from './sort_buttons';
import Options from './options';

interface FoodSearchProps {
	searchCleared: boolean,
	setClearSearch: (clearSearch: boolean) => void
}

const FoodSearch = ({ searchCleared, setClearSearch }: FoodSearchProps): JSX.Element => {

    const { cardOpen, setCardOpen } = useContext(CardOpenContext);
	const [hintsArr, setHintsArr] = useState<Food[]>([]);
	const [foodArr, setFoodArr] = useState<Food[]>([]);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [queryOptions, setQueryOptions] = useState<string[] | null>(null);
	const [input, setInput] = useState('');
	const [sort, setSort] = useState<SortType>(SortType.DEFAULT);
	const [filter, setFilter] = useState<string[]>(['Generic foods']);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const { setMessage } = useContext(StatusContext);
	const { sendRequest } = useHttpClient();

	const searchRef = useRef<HTMLDivElement>(null);

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
	
		try {
			const query: string[] = await sendRequest(
			`http://localhost:5001/api/query/${inputValue || ''}`,
			'GET'
			);
			setShowOptions(true);
			setQueryOptions(query);
		} catch (err) {
			console.log(err);
		}
	}

	const handleOptionClick = async(option: HTMLLIElement) => {

		setShowOptions(false);
		setQueryOptions(null);
		setInput(option.innerText);

		try {
			const result = await sendRequest(
				`http://localhost:5001/api/ingr/${option.innerText}`,
				'GET'
			);
			if(result) setHintsArr(result.hints);
		} catch (err) {
			setMessage('Food not found.');
		}
	}

	const handleEnterKey = async(e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			setShowOptions(false);
			try {
				const result = await sendRequest(
					`http://localhost:5001/api/ingr/${input}`,
					'GET'
				);
				if(result) setHintsArr(result.hints);    
			} catch (err) {
				setMessage('Food not found.');
			}
		}
	}

	useEffect(() => {
		if(hintsArr.length == 0) return;
		const filteredHints = hintsArr.filter((hint: Food) => filter.includes(hint.food.category));
		setFoodArr(filteredHints);
	}, [filter, hintsArr])

	const handleBackclick = () => {
		setShowOptions(false);
		emptyInput();
	}

	const emptyInput = () => {
		setInput('');
		setQueryOptions(null);
	}

	useEffect(() => {
		if(cardOpen == CardState.OPENING && searchRef.current) {
			setShowOptions(false);
			(searchRef.current as HTMLElement).scrollTo({
                top: 0,
                left: 0,
                behavior: "auto",
            });
		}
	}, [cardOpen])

	const showFilter: boolean = cardOpen !== CardState.OPEN && !showOptions;

    const style = () => {
        if(cardOpen == CardState.OPENING) {
            return {overflow: 'hidden'}
        } else {
            return {overflow: 'auto'}
        }
    }

    return (
        <div className={styles.container} style={style()} ref={searchRef} onClick={() => {isFilterOpen && setIsFilterOpen(false)}}>
            {cardOpen == CardState.CLOSED && <div className={styles.input_container}>
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
			{showFilter && <SortButtons 
				setSort={setSort} 
				setFilter={setFilter} 
				filter={filter} 
				isOpen={isFilterOpen} 
				setOpen={setIsFilterOpen}/>}
            {foodArr.length > 0 && <FoodList foodArr={foodArr} sort={sort}/>}
        </div>
    )
}

export default FoodSearch;