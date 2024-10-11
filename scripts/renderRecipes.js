import { renderRecipe } from './components/recipe.js'

const recipesSection = document.getElementById('recipes-section')
const recipesCount = document.getElementById('recipes-count')
const recipesCountLabel = document.getElementById('recipes-count-label')

export const renderRecipes = (data, value, index) => {
    recipesSection.innerHTML = ''
    recipesCount.textContent = data.length
    recipesCountLabel.textContent = data.length > 1 ? 'recettes' : 'recette'

    let error = document.querySelector('#error')
    if (error) error.remove()

    if (data.length === 0) {
        const errorElement = document.createElement('p')
        errorElement.className = 'text-xl font-bold text-center'
        errorElement.textContent = `Aucune recette ne contient "${value}". Vous pouvez essayer « tarte aux pommes », « poisson », etc.`
        errorElement.id = 'error'
        recipesSection.after(errorElement)
    } else {
        for (let i = 0; i < data.slice(0, index).length; i++) {
            const recipeElement = renderRecipe(data[i])
            recipesSection.appendChild(recipeElement)
        }
    }
}
