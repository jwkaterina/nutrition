export enum SlideType {
    FOOD,
    RECIPE,
    MENU
}

export enum CardState { 
    OPENING = 'OPENING',
    OPEN = 'OPEN',
    CLOSING = 'CLOSING',
    CLOSED = 'CLOSED'
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

export interface Recipe {
    name: string,
    image: string,
    servings: number,
    ingredients: string[],
    nutrients: Nutrients,
}

export interface MenuProp {
    name: string,
    ingredients: string[],
    nutrients: Nutrients,
    recipes: RecipeWithServings[]
}

export interface Nutrients {
    calories: number,
    totalNutrients: NutrientsProp,
    totalDaily: NutrientsProp,
    totalWeight: number
}

export interface NutrientsProp {
    [key: string]: Nutrient
}

export type Nutrient = {
    label: string,
    quantity: number,
    unit: string
}

// export type NutrientsProp = {
//     CA: Nutrient,
//     CHOCDF: Nutrient,
//     CHOLE: Nutrient,
//     ENERC_KCAL: Nutrient,
//     FAMS: Nutrient,
//     FAPU: Nutrient,
//     FASAT: Nutrient,
//     FAT: Nutrient,
//     FATRN: Nutrient,
//     FE: Nutrient,
//     FIBTG: Nutrient,
//     FOLAC: Nutrient,
//     FOLDFE: Nutrient,
//     FOLFD: Nutrient,
//     K: Nutrient,
//     MG: Nutrient,
//     NA: Nutrient,
//     NIA: Nutrient,
//     P: Nutrient,
//     PROCNT: Nutrient,
//     RIBF: Nutrient,
//     SUGAR: Nutrient,
//     THIA: Nutrient,
//     TOCPHA: Nutrient,
//     VITA_RAE: Nutrient,
//     VITB12: Nutrient,
//     VITB6A: Nutrient,
//     VITC: Nutrient,
//     VITD: Nutrient,
//     VITK1: Nutrient,
//     WATER: Nutrient,
//     ZN: Nutrient
// }

export interface RecipeWithServings {
    selectedRecipe: Recipe,
    selectedServings: number
}

export type LoadedFood = {
    creator: string,
    food: Food,
    id: string
}

export type LoadedRecipe = {
    creator: string,
    recipe: Recipe,
    id: string,
    image: string
}

export type LoadedMenu = {
    creator: string,
    menu: MenuProp,
    id: string
}

export enum SortType {
    ASC_Calories,
    DESC_Calories,
    ASC_Protein,
    DESC_Protein,
    ASC_Fat,
    DESC_Fat,
    ASC_Carbs,
    DESC_Carbs,
    DEFAULT
}

export enum AnalysisMode {
    VIEW,
    EDIT
}

export enum StatusType {
    SUCCESS = 'Success',
    ERROR = 'Error',
}