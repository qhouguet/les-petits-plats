const sortFunction = (a, b) => a.localeCompare(b)

export const getRecipesOptions = (recipes) => {
    let ingredientsArray = []
    let appliancesArray = []
    let ustensilsArray = []

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i]

        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j].ingredient
            let isIngredientPresent = false

            for (let k = 0; k < ingredientsArray.length; k++) {
                if (ingredientsArray[k] === ingredient) {
                    isIngredientPresent = true
                    break
                }
            }

            if (!isIngredientPresent) {
                ingredientsArray.push(ingredient)
            }
        }

        if (recipe.appliance) {
            let isAppliancePresent = false
            for (let j = 0; j < appliancesArray.length; j++) {
                if (appliancesArray[j] === recipe.appliance) {
                    isAppliancePresent = true
                    break
                }
            }

            if (!isAppliancePresent) {
                appliancesArray.push(recipe.appliance)
            }
        }

        for (let j = 0; j < recipe.ustensils.length; j++) {
            const ustensil = recipe.ustensils[j]
            let isUstensilPresent = false

            for (let k = 0; k < ustensilsArray.length; k++) {
                if (ustensilsArray[k] === ustensil) {
                    isUstensilPresent = true
                    break
                }
            }

            if (!isUstensilPresent) {
                ustensilsArray.push(ustensil)
            }
        }
    }

    for (let i = 0; i < ingredientsArray.length - 1; i++) {
        for (let j = i + 1; j < ingredientsArray.length; j++) {
            if (sortFunction(ingredientsArray[i], ingredientsArray[j]) > 0) {
                ;[ingredientsArray[i], ingredientsArray[j]] = [ingredientsArray[j], ingredientsArray[i]]
            }
        }
    }

    for (let i = 0; i < appliancesArray.length - 1; i++) {
        for (let j = i + 1; j < appliancesArray.length; j++) {
            if (sortFunction(appliancesArray[i], appliancesArray[j]) > 0) {
                ;[appliancesArray[i], appliancesArray[j]] = [appliancesArray[j], appliancesArray[i]]
            }
        }
    }

    for (let i = 0; i < ustensilsArray.length - 1; i++) {
        for (let j = i + 1; j < ustensilsArray.length; j++) {
            if (sortFunction(ustensilsArray[i], ustensilsArray[j]) > 0) {
                ;[ustensilsArray[i], ustensilsArray[j]] = [ustensilsArray[j], ustensilsArray[i]]
            }
        }
    }

    return [ingredientsArray, appliancesArray, ustensilsArray]
}

export const getRecipesOptionsWithSearch = (array, search) => {
    const searchLower = search.toLowerCase()
    let result = []

    for (let i = 0; i < array.length; i++) {
        const elementLower = array[i].toLowerCase()
        let match = false

        for (let j = 0; j <= elementLower.length - searchLower.length; j++) {
            if (elementLower.substring(j, j + searchLower.length) === searchLower) {
                match = true
                break
            }
        }

        if (match) {
            result.push(array[i])
        }
    }

    return result
}
