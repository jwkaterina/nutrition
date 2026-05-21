'use client'

import { useState, useContext, useEffect, useRef, FormEvent, KeyboardEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import FoodList from './food-list';
import SortButtons from './sort-buttons';
import Options from './options';
import { CardOpenContext } from '@/app/context/card-context';
import { useHttpClient} from '@/app/hooks/http-hook';
import { Food, CardState, SortType, StatusType, FoodType } from '@/app/types/types';
import { StatusContext } from '@/app/context/status-context';

import styles from './search.module.css'

interface FoodSearchProps {
	topPad?: string
}

const FoodSearch = ({ topPad }: FoodSearchProps): JSX.Element => {

    const { cardOpen } = useContext(CardOpenContext);
	const { setMessage, setStatus } = useContext(StatusContext);
	const { sendRequest } = useHttpClient();
	const [hintsArr, setHintsArr] = useState<Food[]>([]);
	const [foodArr, setFoodArr] = useState<Food[]>([]);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [queryOptions, setQueryOptions] = useState<string[] | null>(null);
	const [input, setInput] = useState<string>('');
	const [sort, setSort] = useState<SortType>(SortType.DEFAULT);
	const [filter, setFilter] = useState<FoodType[]>([FoodType.FAST_FOODS, FoodType.GENERIC_FOODS, FoodType.GENERIC_MEALS, FoodType.PACKAGED_FOODS]);
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
	const searchRef = useRef<HTMLDivElement>(null);

	const showFilter: boolean = !showOptions;
	const searchVisible = cardOpen === CardState.CLOSED || cardOpen === CardState.CLOSING;

	useEffect(() => {
		if(!hintsArr || hintsArr.length == 0) return;
		const filteredHints = hintsArr.filter((hint: Food) => filter.includes(hint.food.category));
		setFoodArr(filteredHints);
	}, [filter, hintsArr]);

	useEffect(() => {
		if(cardOpen == CardState.OPENING && searchRef.current) {
			setShowOptions(false);
			(searchRef.current as HTMLElement).scrollTo({
                top: 0,
                left: 0,
                behavior: "auto",
            });
		};
	}, [cardOpen]);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleInput = (e: FormEvent) => {
		const inputValue = (e.target as HTMLInputElement).value;
		setInput(inputValue);
		if(debounceRef.current) clearTimeout(debounceRef.current);
		if(inputValue.length == 0) return;
		debounceRef.current = setTimeout(async () => {
			try {
				console.log(`[Edamam] autocomplete: "${inputValue}"`);
				const query: string[] = await sendRequest(
					`/api/query/${inputValue}`,
					'GET', null, {}, false, false
				);
				setShowOptions(true);
				setQueryOptions(query);
			} catch (err) {
				setMessage(null);
			}
		}, 300);
	}

	const handleOptionClick = async(option: HTMLLIElement) => {

		setShowOptions(false);
		setQueryOptions(null);
		setInput(option.innerHTML);

		try {
			console.log(`[Edamam] parseQuery (click): "${option.innerText}"`);
			const result = await sendRequest(
				`/api/ingr/${option.innerText}`,
				'GET', null, {}, true, false
			);
			if(result) setHintsArr(result.hints);
			if(result.hints.length == 0) {
				setMessage('Food not found.');
				setStatus(StatusType.ERROR);
			}
		} catch (err) {}
	}

	const handleEnterKey = async(e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			setShowOptions(false);
			try {
				console.log(`[Edamam] parseQuery (enter): "${input}"`);
				const result = await sendRequest(
					`/api/ingr/${input}`,
					'GET', null, {}, true, false
				);
				if(result) setHintsArr(result.hints);    
				if(result.hints.length == 0) {
					setMessage('Food not found.');
					setStatus(StatusType.ERROR);
				}
			} catch (err) {}
		}
	}

	const handleBackclick = () => {
		setShowOptions(false);
		emptyInput();
	}

	const emptyInput = () => {
		setInput('');
		setQueryOptions(null);
	}

    const style = (): React.CSSProperties => ({
        overflow: cardOpen == CardState.OPEN ? 'hidden' : 'auto',
        ...(topPad ? { paddingTop: topPad } : {}),
    });

    return (
        <div className={styles.container} style={style()} ref={searchRef}>
            <div className={styles.search_card} style={{
                opacity: searchVisible ? 1 : 0,
                transition: 'opacity 380ms ease',
                pointerEvents: searchVisible ? 'auto' : 'none'
            }}>
                <div className={styles.card_input_container}>
                    <input
                        type="text"
                        className={showOptions ? `${styles.card_input} ${styles.expanded}` : styles.card_input}
                        placeholder='search food'
                        onClick={() => setShowOptions(true)}
                        onInput={e => handleInput(e)}
                        value={input}
                        onKeyUp={handleEnterKey}
                    />
                    {!showOptions && <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className={styles.card_icon_left}
                    />}
                    {showOptions && <FontAwesomeIcon
                        icon={faArrowLeft}
                        className={`${styles.card_icon_left} ${styles.clickable}`}
                        onClick={handleBackclick}
                    />}
                    {showOptions && <FontAwesomeIcon
                        icon={faXmark}
                        className={styles.card_icon_right}
                        onClick={emptyInput}
                    />}
                </div>
                {showOptions && <Options
                    queryOptions={queryOptions}
                    onclick={(e: any) => handleOptionClick(e.target as HTMLLIElement)}
                    className={styles.card_options}
                />}
                {showFilter && <SortButtons
                    setSort={setSort}
                    setFilter={setFilter}
                    filter={filter}
                    isOpen={isFilterOpen}
                    setOpen={setIsFilterOpen}
                />}
            </div>
            {foodArr.length > 0 && <FoodList foodArr={foodArr} sort={sort}/>}
        </div>
    );
}

export default FoodSearch;