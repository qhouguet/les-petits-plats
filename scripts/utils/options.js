export const getRecipesOptions = (recipes) => {
    const ingredientsSet = new Set()
    const appliancesSet = new Set()
    const ustensilsSet = new Set()

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach(({ ingredient }) => {
            ingredientsSet.add(ingredient)
        })

        if (recipe.appliance) {
            appliancesSet.add(recipe.appliance)
        }

        recipe.ustensils.forEach((ustensil) => {
            ustensilsSet.add(ustensil)
        })
    })

    const ingredients = Array.from(ingredientsSet).sort((a, b) => a.localeCompare(b))
    const appliances = Array.from(appliancesSet).sort((a, b) => a.localeCompare(b))
    const ustensils = Array.from(ustensilsSet).sort((a, b) => a.localeCompare(b))

    return [ingredients, appliances, ustensils]
}

export const getRecipesOptionsWithSearch = (array, search) => {
    const searchLower = search.toLowerCase()

    return array.filter((element) => element.toLowerCase().includes(searchLower))
}
