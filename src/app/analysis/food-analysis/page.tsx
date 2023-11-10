'use client'

import styles from './page.module.css'
import { parseQuery, autocomplete, findNutrients } from '@/app/services/fetch-data'
import { useState, useRef, useContext, useEffect } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import OpenAnalysisMenu from '@/app/components/nav-bar/menus/openanalysis-menu';
import AnalysisMenu from '@/app/components/nav-bar/menus/analysis-menu';
import Search from '@/app/analysis/components/search';
import PageGrid from '@/app/components/page-grid';
import Card from '@/app/components/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { CardOpenContext, SetCardOpenContext } from '@/app/context/card-context';
import { FoodProp } from '@/app/types/types';

export const FoodSearch = (): JSX.Element => {

	interface Food {
		food: FoodProp
  	}

	const cardOpen = useContext(CardOpenContext);
	const setCardOpen = useContext(SetCardOpenContext);

	const [foodArr, setFoodArr] = useState<Food[]>([]);
	const [showOptions, setShowOptions] = useState(false);
	const [queryOptions, setQueryOptions] = useState<string[] | null>(null);

	const inputRef = useRef<HTMLInputElement>(null);

	const handleInput = async() => {
	
		const result: string[] = await autocomplete(inputRef.current?.value || '');
		setShowOptions(true);
		setQueryOptions(result);
	}

	const handleOptionClick = async(option: HTMLLIElement) => {

		setShowOptions(false);
		setQueryOptions(null);
		setCardOpen(null);
		inputRef.current!.value = option.innerText;

		const result = await parseQuery(option.innerText);
		setFoodArr(result.hints);
		console.log(result);
		// const nutrients = await findNutrients(result.hints[4].food.foodId);
		// console.log(nutrients);
	}

	const handleBackclick = () => {
		setShowOptions(false);
		emptyInput();
	}

	const handleEnterKey = async(e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
		setShowOptions(false);
		setCardOpen(null);
		const result = await parseQuery(inputRef.current!.value);
		setFoodArr(result.hints);    }
	}

	const emptyInput = () => {
		inputRef.current!.value = '';
		setQueryOptions(null);
	}

	useEffect(() => {
		if(cardOpen) {
			setShowOptions(false);
		}
	}, [cardOpen])

	useEffect(() => {
		setCardOpen(null);
	}, [])


	const foodList = foodArr.map((hint, index) => {
		return (
			<Card title={hint.food.label}
				text={{
					kcal: Math.round(hint.food.nutrients.ENERC_KCAL),
					prot: Math.round(hint.food.nutrients.PROCNT),
					fat: Math.round(hint.food.nutrients.FAT),
					carb: Math.round(hint.food.nutrients.CHOCDF)
				}} 
				key={`${hint.food.foodId}-${hint.food.label}`} 
				index={index + 1} 
				imgUrl={hint.food.image}
			/>
		)
	})

	const Options = () => {
		if(!showOptions) return <></>
    
		return (
		<div className={styles.options}>
		<ul>
			<li onClick={(e) => handleOptionClick(e.target as HTMLLIElement)}>{queryOptions ? queryOptions[0] : 'apple'}</li>
			<li onClick={(e) => handleOptionClick(e.target as HTMLLIElement)}>{queryOptions ? queryOptions[1] : 'rice'}</li>
			<li onClick={(e) => handleOptionClick(e.target as HTMLLIElement)}>{queryOptions ? queryOptions[2] : 'broccoli'}</li>
		</ul>
		</div>
		)
	}

	return (<>
		<NavBar color={'var(--secondary-color)'}>
			{cardOpen ? 
			<OpenAnalysisMenu foodArray={foodArr}/> : 
			<AnalysisMenu title="Food"/>
			}
		</NavBar>
		<div style={cardOpen && cardOpen != 0 ? {overflow: 'hidden'} : {overflow: 'auto'}}>
		<Search>
			{!cardOpen && <div className={styles.input_container}>
				<input type="text" className={showOptions ? `${styles.search} ${styles.expanded}` : styles.search } placeholder='search food' ref={inputRef} onClick={() => setShowOptions(true)} onInput={handleInput} onKeyUp={handleEnterKey}/>
				{!showOptions && <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon}/>}
				{showOptions && <FontAwesomeIcon icon={faArrowLeft} className={styles.backIcon} onClick={handleBackclick}/>}
				{showOptions && <FontAwesomeIcon icon={faXmark} className={styles.deleteIcon} onClick={emptyInput}/>}
			</div>}
			<Options/>
			{foodArr.length > 0 && <PageGrid>{foodList}</PageGrid>}
		</Search>
		</div>
		</>
	)
}

export default FoodSearch
