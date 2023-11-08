'use client'

import styles from './page.module.css'
import NavbarStyles from '@/app/components/nav-bar/nav-bar.module.css'
import { parseQuery, autocomplete } from '@/app/services/fetch-data'
import { useState, useRef, useContext } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import AnalysisMenu from '@/app/components/nav-bar/analysis-menu';
import Search from '@/app/analysis/components/search';
import PageGrid from '@/app/components/page-grid';
import Card from '@/app/components/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'
import { CardOpenContext } from '@/app/context/card-context';

export const FoodSearch = (): JSX.Element => {

  interface Food {
    food: {
      foodId: string,
      label: string,
      image: string
    }  
  }

  const cardOpen = useContext(CardOpenContext);

  const [foodArr, setFoodArr] = useState<Food[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [queryOptions, setQueryOptions] = useState<string[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = async() => {
  
    const result: string[] = await autocomplete(inputRef.current?.value || '');
    setQueryOptions(result);
  }

  const handleOptionClick = async(event: MouseEvent) => {

    const option = event.target as HTMLLIElement;
    setShowOptions(false);
    setQueryOptions(null);
    inputRef.current!.value = option.innerText;

    const result = await parseQuery(option.innerText);
    setFoodArr(result.hints);
  }

  const handleBackclick = () => {
    setShowOptions(false);
    emptyInput();
  }

  const handleEnterKey = async(e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowOptions(false);
      const result = await parseQuery(inputRef.current!.value);
      setFoodArr(result.hints);    }
  }

  const emptyInput = () => {
    inputRef.current!.value = '';
    setQueryOptions(null);
  }

  const foodList = foodArr.map((hint, index) => {
    return (
        <Card title={hint.food.label} text={''} key={`${hint.food.foodId}-${hint.food.label}`} index={index + 1} imgUrl={hint.food.image}/>
    )
  })

  return (<>
      <NavBar color={'var(--secondary-color)'}>
        {cardOpen ? 
          <AnalysisMenu cardOpen={cardOpen}/>: 
          <div className={NavbarStyles.header}>Food Analysis</div>
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
        {showOptions && <div className={styles.options}>
          <ul>
            <li onClick={(e) => handleOptionClick(e)}>{queryOptions ? queryOptions[0] : 'apple'}</li>
            <li onClick={(e) => handleOptionClick(e)}>{queryOptions ? queryOptions[1] : 'rice'}</li>
            <li onClick={(e) => handleOptionClick(e)}>{queryOptions ? queryOptions[2] : 'broccoli'}</li>
          </ul>
        </div>}
        {foodArr.length > 0 && <PageGrid>{foodList}</PageGrid>}
      </Search>
      </div>
    </>
  )
}

export default FoodSearch
