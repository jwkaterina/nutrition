'use client'

import styles from './page.module.css'
import { parseQuery, autocomplete, findNutrients } from '@/app/services/fetch-data'
import { useState, useContext, useEffect, FormEvent } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import OpenAnalysisMenu from '@/app/components/nav-bar/menus/openanalysis-menu';
import AnalysisMenu from '@/app/components/nav-bar/menus/analysis-menu';
import PageGrid from '@/app/components/page-grid';
import Card from '@/app/components/cards/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { CardOpenContext, SetCardOpenContext } from '@/app/context/card-context';
import { Food } from '@/app/types/types';

export const FoodSearch = (): JSX.Element => {

	const cardOpen = useContext(CardOpenContext);
	const setCardOpen = useContext(SetCardOpenContext);

	const [foodArr, setFoodArr] = useState<Food[]>([]);
	const [showOptions, setShowOptions] = useState(false);
	const [queryOptions, setQueryOptions] = useState<string[] | null>(null);
	const [input, setInput] = useState('');

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
		setCardOpen(null);
		setInput(option.innerText);

		const result = await parseQuery(option.innerText);
		setFoodArr(result.hints);
		console.log(result.hints);
		// const nutrients = await findNutrients(result.hints[0].food.foodId, result.hints[0].measures[0].uri);
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
		const result = await parseQuery(input);
		setFoodArr(result.hints);    }
	}

	const emptyInput = () => {
		setInput('');
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

	const handleHeaderClick = () => {
		setCardOpen(null);
		emptyInput();
		setShowOptions(false);
		// console.log('header clicked');
		setFoodArr([]);
	}


	const foodList = foodArr.map((hint, index) => {
		return (
			<Card food={hint} index={index + 1} key={`${hint.food.foodId}-${hint.food.label}`} />
			// title={hint.food.label}
			// 	text={{
			// 		kcal: Math.round(hint.food.nutrients.ENERC_KCAL),
			// 		prot: Math.round(hint.food.nutrients.PROCNT),
			// 		fat: Math.round(hint.food.nutrients.FAT),
			// 		carb: Math.round(hint.food.nutrients.CHOCDF)
			// 	}} 
			// 	key={`${hint.food.foodId}-${hint.food.label}`} 
			// 	index={index + 1} 
			// 	imgUrl={hint.food.image}
			// 	measures={hint.measures}
			// />
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
			<AnalysisMenu title="Food" onHeaderClick={handleHeaderClick}/>
			}
		</NavBar>
		<div style={(cardOpen && cardOpen != 0) ? {overflow: 'hidden', height: '100vh'} : {overflow: 'auto'}}>
			{!cardOpen && <div className={styles.input_container}>
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
			<Options/>
			{foodArr.length > 0 && <PageGrid>{foodList}</PageGrid>}
		</div>
	</>)
}

export default FoodSearch
