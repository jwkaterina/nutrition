export enum SlideType {
    FOOD,
    RECIPE,
    MENU
}

export enum CardState { 
    OPEN,
    CLOSING,
    CLOSED
}

export interface Food {
    food: FoodProp
    measures: MeasureProp[]
}

export type FoodProp = {
    foodId: string,
    label: string,
    image: string,
    category: string,
    categoryLabel: string,
    knownAs: string,
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

export type LoadedFood = {
    creator: string,
    food: Food,
    id: string
}

export type LoadedRecipe = {
    creator: string,
    recipe: Recipe,
    id: string
}

// export type LoadedMenu = {
//     creator: string,
//     menu: Menu,
//     id: string
// }

export type Nutrient = {
    label: string,
    quantity: number,
    unit: string
}

export type NutrientsProp = {
    CA: Nutrient,
    CHOCDF: Nutrient,
    CHOLE: Nutrient,
    ENERC_KCAL: Nutrient,
    FAMS: Nutrient,
    FAPU: Nutrient,
    FASAT: Nutrient,
    FAT: Nutrient,
    FATRN: Nutrient,
    FE: Nutrient,
    FIBTG: Nutrient,
    FOLAC: Nutrient,
    FOLDFE: Nutrient,
    FOLFD: Nutrient,
    K: Nutrient,
    MG: Nutrient,
    NA: Nutrient,
    NIA: Nutrient,
    P: Nutrient,
    PROCNT: Nutrient,
    RIBF: Nutrient,
    SUGAR: Nutrient,
    THIA: Nutrient,
    TOCPHA: Nutrient,
    VITA_RAE: Nutrient,
    VITB12: Nutrient,
    VITB6A: Nutrient,
    VITC: Nutrient,
    VITD: Nutrient,
    VITK1: Nutrient,
    WATER: Nutrient,
    ZN: Nutrient
}

export interface Nutrients {
    calories: number,
    totalNutrients: NutrientsProp,
    totalDaily: NutrientsProp,
    totalWeight: number
}

export interface Recipe {
    name: string,
    image: string,
    servings: number,
    ingredients: string[],
    nutrients: Nutrients,
}