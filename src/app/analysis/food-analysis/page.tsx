'use client'

import styles from './page.module.css'
import { parseQuery, autocomplete } from '@/app/services/fetch-data'
import { useState, useRef } from 'react' 
import NavBar from '@/app/analysis/components/nav-bar';
import Search from '@/app/analysis/components/search';
import PageGrid from '@/app/components/page-grid';
import Card from '@/app/components/card';

export const FoodSearch = (): JSX.Element => {

  type Option = string;
  interface Food {
    food: {
      foodId: string,
      label: string,
      image: string
    }  
  }

  const [foodArr, setFoodArr] = useState<Food[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [queryOptions, setQueryOptions] = useState<Option[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = async() => {
  
    const result: Option[] = await autocomplete(inputRef.current?.value || '');
    setQueryOptions(result);
  }

  const handleOptionClick = async(option: HTMLElement) => {

    setShowOptions(false);
    setQueryOptions(null);
    inputRef.current!.value = option.innerText;

    const result = await parseQuery(option.innerText);
    setFoodArr(result.hints);
  }

  const foodList = foodArr.map((hint, index) => {
    return (
        <Card title={hint.food.label} text={''} key={`${hint.food.foodId}-${hint.food.label}`} index={index + 1} imgUrl={hint.food.image}/>
    )
  })

  return (<>
      <NavBar header={'Food Analysis'} />
      <Search>
        <input type="text" className={showOptions ? `${styles.search} ${styles.expanded}` : styles.search } placeholder='search food' ref={inputRef} onClick={() => setShowOptions(true)} onInput={handleInput}/>
        {showOptions && <div className={styles.options}>
          <ul>
            <li onClick={(e) => handleOptionClick(e.target as HTMLElement)}>{queryOptions ? queryOptions[0] : 'apple'}</li>
            <li onClick={(e) => handleOptionClick(e.target as HTMLElement)}>{queryOptions ? queryOptions[1] : 'rice'}</li>
            <li onClick={(e) => handleOptionClick(e.target as HTMLElement)}>{queryOptions ? queryOptions[2] : 'broccoli'}</li>
          </ul>
        </div>}
        {foodArr.length > 0 && <PageGrid>{foodList}</PageGrid>}
      </Search>
    </>
  )
}

export default FoodSearch
