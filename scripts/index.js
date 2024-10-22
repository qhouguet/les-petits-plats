import { recipes } from './data/recipes.js'
import { getRecipesOptions } from './utils/options.js'
import { formatString } from './utils/string.js'
import { renderRecipes } from './renderRecipes.js'
import { addTagToFilter, filterDropdownTags } from './utils/tags.js'

// our variables to store researchs / results / filters
let recipeList = recipes
let filteredRecipes = recipeList
export const activeFilters = {
    ingredients: [],
    appliances: [],
    ustensils: [],
}

export let ingredientSearchText = ''
export let appliancesearchText = ''
export let ustensilsSearchText = ''

const searchBar = document.getElementById('searchbar')

// dropdowns
export const optionIngredients = document.querySelector('[data-name = ingredients]')
export const optionKitchenAppliance = document.querySelector('[data-name = appliances]')
export const optionUstensils = document.querySelector('[data-name = ustensils]')

optionIngredients.addEventListener('click', (e) => toggleOptions(e, 'ingredients', optionIngredients))
optionKitchenAppliance.addEventListener('click', (e) => toggleOptions(e, 'appliances', optionKitchenAppliance))
optionUstensils.addEventListener('click', (e) => toggleOptions(e, 'ustensils', optionUstensils))

// search input for dropdowns
const ingredientInput = document.getElementById('input-option-ingredient')
const kitchenApplianceInput = document.getElementById('input-option-appliance')
const ustensilsInput = document.getElementById('input-option-ustensils')

ingredientInput.addEventListener('input', () => {
    ingredientSearchText = ingredientInput.value
    filterDropdownTags('ingredients', ingredientSearchText)
})

kitchenApplianceInput.addEventListener('input', () => {
    appliancesearchText = kitchenApplianceInput.value
    filterDropdownTags('appliances', appliancesearchText)
})

ustensilsInput.addEventListener('input', () => {
    ustensilsSearchText = ustensilsInput.value
    filterDropdownTags('ustensils', ustensilsSearchText)
})

export let [ingredients, appliances, ustensils] = getRecipesOptions(recipeList)

// handle outside dropdown click to close itself
const closeOnClickOutside = (divElement, closeCallback, openButton) => {
    document.addEventListener('click', (e) => {
        if (!divElement.contains(e.target) && e.target !== openButton) {
            closeCallback()
        }
    })
}

// open the options dropdown
const toggleOptions = (e, type, openButton) => {
    const domElement = document.getElementById(type)
    const isOpen = !domElement.classList.contains('hidden')

    // prevent dropdown closing when clicking on a tag
    e.stopPropagation()

    const dropdownElements = [optionIngredients, optionKitchenAppliance, optionUstensils]

    // closes other opened dropdowns
    for (let i = 0; i < dropdownElements.length; i++) {
        const dropdown = dropdownElements[i]
        const dropdownContentId = dropdown.getAttribute('data-name')
        const dropdownContentElement = document.getElementById(dropdownContentId)

        if (dropdownContentElement && dropdownContentElement !== domElement) {
            dropdownContentElement.classList.add('hidden')
        }
    }

    if (isOpen) {
        closeOptions(type)
    } else {
        domElement.classList.remove('hidden')
        closeOnClickOutside(domElement, () => closeOptions(type), openButton)
    }
}

const closeOptions = (type) => {
    const domElement = document.getElementById(type)

    domElement.classList.add('hidden')

    const inputMap = {
        ingredients: ingredientInput,
        appliances: kitchenApplianceInput,
        ustensils: ustensilsInput,
    }

    const input = inputMap[type]

    if (input) {
        input.value = ''
        filterDropdownTags(type, '')
    }
}

export const renderOptions = (options, domElement, type) => {
    const ul = domElement?.parentElement?.querySelector('ul')

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }

    const fragment = document.createDocumentFragment()

    for (let i = 0; i < options.length; i++) {
        const option = options[i]
        const li = document.createElement('li')
        li.classList.add('hover:bg-yellow-custom', 'cursor-pointer', 'py-3', 'px-4', 'relative')
        li.textContent = formatString(option)

        li.addEventListener('click', (e) => {
            e.stopPropagation()
            addTagToFilter(option, type)
        })

        fragment.appendChild(li)
    }

    ul.appendChild(fragment)
}

const updateOptions = () => {
    ;[ingredients, appliances, ustensils] = getRecipesOptions(filteredRecipes)

    filterDropdownTags('ingredients', ingredientSearchText)
    filterDropdownTags('appliances', appliancesearchText)
    filterDropdownTags('ustensils', ustensilsSearchText)
}

// main research
export const searchRecipes = () => {
    const searchQuery = searchBar.value.toLowerCase()

    filteredRecipes = recipeList

    const filtersAreEmpty =
        activeFilters.ingredients.length === 0 &&
        activeFilters.appliances.length === 0 &&
        activeFilters.ustensils.length === 0

    if (!searchQuery && filtersAreEmpty) {
        renderRecipes(filteredRecipes, searchQuery)
        updateOptions()
        return
    }

    if (!searchQuery) {
        applyFilters()
        renderRecipes(filteredRecipes, searchQuery)
        updateOptions()
        return
    }

    if (searchQuery.length >= 3) {
        const tempFilteredRecipes = []

        for (let i = 0; i < recipeList.length; i++) {
            const recipe = recipeList[i]
            const searchInTitle = recipe.name.toLowerCase().indexOf(searchQuery) !== -1
            const searchInDescription = recipe.description.toLowerCase().indexOf(searchQuery) !== -1

            let searchInIngredients = false
            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredientObj = recipe.ingredients[j]
                if (ingredientObj.ingredient.toLowerCase().indexOf(searchQuery) !== -1) {
                    searchInIngredients = true
                    break
                }
            }

            if (searchInTitle || searchInDescription || searchInIngredients) {
                tempFilteredRecipes.push(recipe)
            }
        }

        filteredRecipes = tempFilteredRecipes
    }

    applyFilters()
    renderRecipes(filteredRecipes, searchQuery)
    updateOptions()
}

const applyFilters = () => {
    let tempRecipes = []

    for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i]

        let matchIngredients = true
        if (activeFilters.ingredients.length > 0) {
            for (let j = 0; j < activeFilters.ingredients.length; j++) {
                let ingredientFound = false
                const filter = activeFilters.ingredients[j].toLowerCase()

                for (let k = 0; k < recipe.ingredients.length; k++) {
                    const ingredient = recipe.ingredients[k].ingredient.toLowerCase()
                    if (ingredient.indexOf(filter) !== -1) {
                        ingredientFound = true
                        break
                    }
                }

                if (!ingredientFound) {
                    matchIngredients = false
                    break
                }
            }
        }

        let matchAppliances = true
        if (activeFilters.appliances.length > 0) {
            matchAppliances = false
            const appliance = recipe.appliance.toLowerCase()
            for (let j = 0; j < activeFilters.appliances.length; j++) {
                if (appliance === activeFilters.appliances[j].toLowerCase()) {
                    matchAppliances = true
                    break
                }
            }
        }

        let matchUstensils = true
        if (activeFilters.ustensils.length > 0) {
            for (let j = 0; j < activeFilters.ustensils.length; j++) {
                let ustensilFound = false
                const filter = activeFilters.ustensils[j].toLowerCase()

                for (let k = 0; k < recipe.ustensils.length; k++) {
                    const ustensil = recipe.ustensils[k].toLowerCase()
                    if (ustensil.indexOf(filter) !== -1) {
                        ustensilFound = true
                        break
                    }
                }

                if (!ustensilFound) {
                    matchUstensils = false
                    break
                }
            }
        }

        if (matchIngredients && matchAppliances && matchUstensils) {
            tempRecipes.push(recipe)
        }
    }

    filteredRecipes = tempRecipes
}

// initialisation
renderOptions(ingredients, optionIngredients, 'ingredients')
renderOptions(appliances, optionKitchenAppliance, 'appliances')
renderOptions(ustensils, optionUstensils, 'ustensils')

searchBar.addEventListener('input', searchRecipes)

renderRecipes(recipeList, '')
