import hints from './test/hints.json';

describe("FoodSearch", () => {

    test("should render", () => {
        const filteredItems = ["Generic meals", "Fast foods", "Packaged foods"];
        const filteredHints = hints.filter(
            (hint) => {
                if (filteredItems.includes(hint.food.category)) {
                    return true;
                } else {
                    return false;
                }
            }
            );
        console.log(filteredHints);
    })
});