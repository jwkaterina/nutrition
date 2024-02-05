import FoodCard from '@/app/components/cards/food-cards/food-card';
import PageGrid from '@/app/components/slider/page-grid';
import { SortType, Food } from '@/app/types/types';

interface FoodListProps {
	foodArr: Food[];
	sort: SortType;
}

const FoodList = ({ foodArr, sort }: FoodListProps): JSX.Element => {

	const foodList: JSX.Element[] = foodArr
	.sort((a, b) => {
		switch(sort) {
			case SortType.ASC_Calories:
				return b.food.nutrients.ENERC_KCAL - a.food.nutrients.ENERC_KCAL;
			case SortType.DESC_Calories:
				return a.food.nutrients.ENERC_KCAL - b.food.nutrients.ENERC_KCAL;
			case SortType.ASC_Protein:
				return b.food.nutrients.PROCNT - a.food.nutrients.PROCNT;
			case SortType.DESC_Protein:
				return a.food.nutrients.PROCNT - b.food.nutrients.PROCNT;
			case SortType.ASC_Fat:
				return b.food.nutrients.FAT - a.food.nutrients.FAT;
			case SortType.DESC_Fat:
				return a.food.nutrients.FAT - b.food.nutrients.FAT;
			case SortType.ASC_Carbs:
				return b.food.nutrients.CHOCDF - a.food.nutrients.CHOCDF;
			case SortType.DESC_Carbs:
				return a.food.nutrients.CHOCDF - b.food.nutrients.CHOCDF;
			case SortType.DEFAULT:
				return 0;
			default:
				return 0;
		}
	}).map((hint, index) => {
		return (
			<FoodCard food={hint} index={index + 1} key={index + 1} id={null} open={false}/>
		)
	});

	return <PageGrid>{foodList}</PageGrid>
}

export default FoodList;