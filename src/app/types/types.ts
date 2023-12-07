export enum SlideType {
    FOOD,
    RECIPE,
    MENU
}

export type FoodProp = {
    foodId: string,
    label: string,
    image: string,
    category: string,
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

export type Nutrient = {
    label: string,
    quantity: number,
    unit: string
}

// type Daily = {
//     CA: Nutrient,
//     CHOCDF: Nutrient,
//     CHOLE: Nutrient,
//     ENERC_KCAL: Nutrient,
//     FASAT: Nutrient,
//     FAT: Nutrient,
//     FE: Nutrient,
//     FIBTG: Nutrient,
//     FOLDFE: Nutrient,
//     K: Nutrient,
//     MG: Nutrient,
//     NA: Nutrient,
//     NIA: Nutrient,
//     P: Nutrient,
//     PROCNT: Nutrient,
//     RIBF: Nutrient,
//     THIA: Nutrient,
//     TOCPHA: Nutrient,
//     VITA_RAE: Nutrient,
//     VITB12: Nutrient,
//     VITB6A: Nutrient,
//     VITC: Nutrient,
//     VITD: Nutrient,
//     VITK1: Nutrient,
//     ZN: Nutrient
// };

type NutrientsProp = {
    CA: Nutrient,
    CHOCDF: Nutrient,
    // 'CHOCDF.net': Nutrient,
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

export type Measure = {
    label: string,
    uri: string,
    weight: number
}