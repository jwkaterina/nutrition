'use client'

// export const fetchNutritionAnalysisAPI = async() => {

//     const appId= "8db7e817";
//     const appKey= "198f749fbaa82a2129cf6aba6d0b93f0";
    
    // //Full Recipe Analysis

    // const url = `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`;
    // const options = {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    // },
    //     body: JSON.stringify({
    //         "title": "Fresh Ham Roasted With Rye Bread and Dried Fruit Stuffing",
    //         "ingr": [
    //             "1 cup rice",
    //             "1 oz almonds",
    //         ]
    //     })
    // };
    // try {
    //     const response = await fetch(url, options);
    //     const result = await response.json();
    //     console.log(result);
    //     return result;
    // } catch (error) {
    //     console.error(error);
    // }

    // *********************************** */

    // //Individual Text Line Analysis
    
    // const type = 'cooking';
    // const ingr = '1%20cup%20rice';
    // const url = `https://api.edamam.com/api/nutrition-data?app_id=${appId}&app_key=${appKey}&nutrition-type=${type}&ingr=${ingr}`;
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'Accept': 'application/json'
    //     },
    // };
    // try {
    //     const response = await fetch(url, options);
    //     const result = await response.json();
    //     console.log(result);
    // } catch (error) {
    //     console.error(error);
    // }
// }

export const parseQuery = async (ingr: string) => {

    const appId= "1ed9471e";
    const appKey= "d596751a2948e390e2bcbd335e0564fa";

    //Food Request Step 1 - Parser

    // const ingr = "apple"
    const type = 'cooking';
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${ingr}&nutrition-type=${type}`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}

    // *********************************** */

    export const findNutrients = async (foodId: string, measure: string, quantity: number) => {

        const appId= "1ed9471e";
        const appKey= "d596751a2948e390e2bcbd335e0564fa";

    // Food Request Step 2 - Nutrients

    const url = `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${appId}&app_key=${appKey}`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "ingredients": [
              {
                "quantity": quantity,
                "measureURI": measure,         
                "foodId": foodId
              }
            ]
          })
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
    }

    // *********************************** */

    export const autocomplete = async (query: string) => {

        const appId= "1ed9471e";
        const appKey= "d596751a2948e390e2bcbd335e0564fa";

    //Food Search Autocomplete

    // const query = 'app';
    const url = `https://api.edamam.com/auto-complete?app_id=${appId}&app_key=${appKey}&q=${query}`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}