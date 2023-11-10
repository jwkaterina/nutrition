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

export type MeasureProp = {
    uri: string
    label: string
    weight: number
}

export interface Food {
    food: FoodProp
    measures: MeasureProp[]
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