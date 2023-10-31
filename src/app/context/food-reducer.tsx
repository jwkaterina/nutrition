import { FoodProp } from "@/app/types/types";

type ACTIONTYPE = { 
    type: 'delete',
    index: number
}

export const  FoodReducer = (food: FoodProp[], action: ACTIONTYPE) => {
    switch (action.type) {
        case 'delete': {
            const newFood = food.filter((food, i) => i != action.index);
            saveFood(newFood);
            return newFood;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const saveFood = (food: FoodProp[]) => {
    localStorage.setItem('food', JSON.stringify(food));
}