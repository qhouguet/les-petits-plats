const createRecipeArticle = () => {
    const article = document.createElement('article')
    article.className = 'shadow-custom relative rounded-xl bg-white'

    const recipeTime = document.createElement('mark')
    recipeTime.className = 'absolute px-3 py-1 top-4 right-4 bg-yellow-custom rounded-xl'
    recipeTime.id = 'recipeTime'
    article.appendChild(recipeTime)

    const recipeImage = document.createElement('img')
    recipeImage.className = 'h-60 w-full object-cover rounded-t-xl'
    recipeImage.id = 'recipeImage'
    article.appendChild(recipeImage)

    const divContent = document.createElement('div')
    divContent.className = 'rounded-b-xl px-6 py-7'

    const recipeTitle = document.createElement('h3')
    recipeTitle.className = 'font-anton mb-8'
    recipeTitle.id = 'recipeTitle'
    divContent.appendChild(recipeTitle)

    const descriptionContainer = document.createElement('div')
    const descriptionTitle = document.createElement('h4')
    descriptionTitle.className = 'text-neutral-500 mb-4'
    descriptionTitle.textContent = 'Recette'

    const recipeDescription = document.createElement('p')
    recipeDescription.className = 'mb-8 h-[7.5rem] overflow-hidden hover:overflow-auto'
    recipeDescription.id = 'recipeDescription'
    descriptionContainer.appendChild(descriptionTitle)
    descriptionContainer.appendChild(recipeDescription)
    divContent.appendChild(descriptionContainer)

    const ingredientsContainer = document.createElement('div')
    const ingredientsTitle = document.createElement('h4')
    ingredientsTitle.className = 'text-neutral-500 mb-4'
    ingredientsTitle.textContent = 'Ingrédients'

    const ingredientsList = document.createElement('ul')
    ingredientsList.className = 'grid grid-cols-2 gap-y-5 gap-x-2'
    ingredientsList.id = 'ingredientsList'
    ingredientsContainer.appendChild(ingredientsTitle)
    ingredientsContainer.appendChild(ingredientsList)
    divContent.appendChild(ingredientsContainer)

    article.appendChild(divContent)
    return article
}

export const renderRecipe = (recipe) => {
    const article = createRecipeArticle()

    const elTime = article.firstChild
    const elImage = elTime.nextSibling
    const divContent = elImage.nextSibling

    const elTitle = divContent.firstChild
    const descriptionContainer = elTitle.nextSibling
    const elDescription = descriptionContainer.lastChild
    const ingredientsContainer = divContent.lastChild
    const elList = ingredientsContainer.lastChild

    elTime.textContent = `${recipe.time}min`
    elTitle.textContent = recipe.name
    elImage.src = `./assets/recipes/${recipe.image}`
    elImage.alt = recipe.name
    elDescription.textContent = recipe.description

    const fragment = document.createDocumentFragment()

    for (let i = 0; i < recipe.ingredients.length; i++) {
        const item = recipe.ingredients[i]

        const elLi = document.createElement('li')
        const ingredientTitle = document.createElement('h5')
        ingredientTitle.className = 'font-semibold text-sm'
        ingredientTitle.textContent = item.ingredient

        elLi.appendChild(ingredientTitle)

        if (item.quantity) {
            const spanQuantity = document.createElement('span')
            spanQuantity.className = 'text-neutral-500'
            spanQuantity.textContent = `${item.quantity} ${item.unit || ''}`
            spanQuantity.setAttribute('aria-label', 'quantité')
            elLi.appendChild(spanQuantity)
        }

        fragment.appendChild(elLi)
    }

    elList.innerHTML = ''
    elList.appendChild(fragment)

    return article
}
