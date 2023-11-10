import { Food } from "@/app/types/types";

type ACTIONTYPE = { 
    type: 'delete' | 'add',
    index: number,
    item: Food
}

export const  FoodReducer = (food: Food[], action: ACTIONTYPE) => {
    switch (action.type) {
        case 'delete': {
            const newFood = food.filter((food, i) => i != action.index);
            saveFood(newFood);
            return newFood;
        }
        case 'add': {
            const newFood = [...food, action.item];
            saveFood(newFood);
            return newFood;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const saveFood = (food: Food[]) => {
    localStorage.setItem('food', JSON.stringify(food));
}