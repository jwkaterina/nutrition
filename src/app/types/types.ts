export enum SlideType {
    FOOD,
    RECIPE,
    MENU
}

export type FoodProp = {
    foodId: string,
    label: string,
    image: string,
    nutrients: {
        ENERC_KCAL: number,
        PROCNT: number,
        FAT: number,
        CHOCDF: number,
        FIBTG: number
    }
}

export type MenuProp = {
    id: number,
    name: string,
}

export type RecipeProp =     {
    id: number,
    name: string,
    description: string,
    imagePath: string,
    ingredients: Ingredient[]
}

type Ingredient = {
    name: string,
    amount: number
}