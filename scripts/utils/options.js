export const getRecipesOptions = (recipes) => {
    const ingredientsSet = new Set()
    const kitchenAppliancesSet = new Set()
    const ustensilsSet = new Set()

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i]

        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j].ingredient
            ingredientsSet.add(ingredient)
        }

        if (recipe.appliance) {
            kitchenAppliancesSet.add(recipe.appliance)
        }

        for (let k = 0; k < recipe.ustensils.length; k++) {
            const ustensil = recipe.ustensils[k]
            ustensilsSet.add(ustensil)
        }
    }

    const ingredients = Array.from(ingredientsSet).sort((a, b) => a.localeCompare(b))
    const kitchenAppliances = Array.from(kitchenAppliancesSet).sort((a, b) => a.localeCompare(b))
    const ustensils = Array.from(ustensilsSet).sort((a, b) => a.localeCompare(b))

    return [ingredients, kitchenAppliances, ustensils]
}

export const getRecipesOptionsWithSearch = (array, search) => {
    const updateOptions = []
    const searchLower = search.toLowerCase()

    for (let i = 0; i < array.length; i++) {
        const element = array[i].toLowerCase()
        let isMatch = false

        for (let j = 0; j <= element.length - searchLower.length; j++) {
            if (element.substring(j, j + searchLower.length) === searchLower) {
                isMatch = true
                break
            }
        }

        if (isMatch) {
            updateOptions.push(array[i])
        }
    }

    return updateOptions
}
