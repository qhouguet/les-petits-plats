import { recipes } from './data/recipes.js'
import { getRecipesOptions, getRecipesOptionsWithSearch } from './utils/options.js'
import { formatString } from './utils/string.js'
import { renderRecipes } from './renderRecipes.js'
import { addTagToFilter, filterDropdownTags } from './utils/tags.js'

// our variables to store researchs / results / filters
let recipeList = recipes
let filteredRecipes = recipeList
let searchQuery = ''
export const activeFilters = {
    ingredients: [],
    kitchenAppliances: [],
    ustensils: [],
}

export let ingredientSearchText = ''
export let kitchenApplianceSearchText = ''
export let ustensilsSearchText = ''

const searchBar = document.getElementById('searchbar')

// dropdowns
export const optionIngredients = document.querySelector('[data-name = ingredients]')
export const optionKitchenAppliance = document.querySelector('[data-name = kitchen-appliance]')
export const optionUstensils = document.querySelector('[data-name = ustensils]')

optionIngredients.addEventListener('click', (e) => toggleOptions(e, 'ingredients', optionIngredients))
optionKitchenAppliance.addEventListener('click', (e) => toggleOptions(e, 'kitchen-appliance', optionKitchenAppliance))
optionUstensils.addEventListener('click', (e) => toggleOptions(e, 'ustensils', optionUstensils))

// search input for dropdowns
const ingredientInput = document.getElementById('input-option-ingredient')
const kitchenApplianceInput = document.getElementById('input-option-kitchen-appliance')
const ustensilsInput = document.getElementById('input-option-ustensils')

ingredientInput.addEventListener('input', () => {
    ingredientSearchText = ingredientInput.value
    filterDropdownTags('ingredients', ingredientSearchText)
})

kitchenApplianceInput.addEventListener('input', () => {
    kitchenApplianceSearchText = kitchenApplianceInput.value
    filterDropdownTags('kitchen-appliances', kitchenApplianceSearchText)
})

ustensilsInput.addEventListener('input', () => {
    ustensilsSearchText = ustensilsInput.value
    filterDropdownTags('ustensils', ustensilsSearchText)
})

export let [ingredients, kitchenAppliances, ustensils] = getRecipesOptions(recipeList)

// handle outside dropdown click to close itself
const closeOnClickOutside = (divElement, closeCallback, openButton) => {
    document.addEventListener('click', function (event) {
        if (!divElement.contains(event.target) && event.target !== openButton) {
            closeCallback()
        }
    })
}

const toggleOptions = (e, type, openButton) => {
    const domElement = document.getElementById(type)
    const isOpen = !domElement.classList.contains('hidden')

    // prevent dropdown closing when clicking on a tag
    e.stopPropagation()

    const dropdownElements = [optionIngredients, optionKitchenAppliance, optionUstensils]

    for (const dropdown of dropdownElements) {
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

    if (type === 'ingredients') {
        ingredientInput.value = ''
        ingredientSearchText = ''
        filterDropdownTags('ingredients', ingredientSearchText)
    } else if (type === 'kitchen-appliance') {
        kitchenApplianceInput.value = ''
        kitchenApplianceSearchText = ''
        filterDropdownTags('kitchen-appliances', kitchenApplianceSearchText)
    } else if (type === 'ustensils') {
        ustensilsInput.value = ''
        ustensilsSearchText = ''
        filterDropdownTags('ustensils', ustensilsSearchText)
    }
}

export const renderOptions = (options, domElement, selectedOptions = [], type) => {
    const ul = domElement?.parentElement?.querySelector('ul')

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }

    for (let i = 0; i < options.length; i++) {
        const option = options[i]

        const li = document.createElement('li')
        li.classList.add('hover:bg-yellow-custom', 'cursor-pointer', 'py-3', 'px-4', 'relative')
        li.textContent = formatString(option)

        li.addEventListener('click', (e) => {
            e.stopPropagation()
            addTagToFilter(option, type)
        })

        ul.appendChild(li)
    }
}

const updateOptions = () => {
    ;[ingredients, kitchenAppliances, ustensils] = getRecipesOptions(filteredRecipes)

    filterDropdownTags('ingredients', ingredientSearchText)
    filterDropdownTags('kitchen-appliances', kitchenApplianceSearchText)
    filterDropdownTags('ustensils', ustensilsSearchText)
}

// main research
export const searchRecipes = () => {
    searchQuery = searchBar.value.toLowerCase()
    filteredRecipes = []

    if (
        searchQuery.length === 0 &&
        activeFilters.ingredients.length === 0 &&
        activeFilters.kitchenAppliances.length === 0 &&
        activeFilters.ustensils.length === 0
    ) {
        for (let i = 0; i < recipeList.length; i++) {
            filteredRecipes.push(recipeList[i])
        }
        renderRecipes(filteredRecipes, searchQuery, filteredRecipes.length)
        updateOptions()
        return
    }

    if (
        searchQuery.length === 0 &&
        (activeFilters.ingredients.length > 0 ||
            activeFilters.kitchenAppliances.length > 0 ||
            activeFilters.ustensils.length > 0)
    ) {
        filteredRecipes = recipeList
        applyFilters()

        renderRecipes(filteredRecipes, searchQuery, filteredRecipes.length)
        updateOptions()
        return
    }

    if (searchQuery.length >= 3) {
        for (let i = 0; i < recipeList.length; i++) {
            const recipe = recipeList[i]
            let searchInTitle = false
            let searchInDescription = false
            let searchInIngredients = false

            for (let k = 0; k <= recipe.name.length - searchQuery.length; k++) {
                if (recipe.name.toLowerCase().substring(k, k + searchQuery.length) === searchQuery) {
                    searchInTitle = true
                    break
                }
            }

            for (let k = 0; k <= recipe.description.length - searchQuery.length; k++) {
                if (recipe.description.toLowerCase().substring(k, k + searchQuery.length) === searchQuery) {
                    searchInDescription = true
                    break
                }
            }

            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j].ingredient.toLowerCase()
                for (let k = 0; k <= ingredient.length - searchQuery.length; k++) {
                    if (ingredient.substring(k, k + searchQuery.length) === searchQuery) {
                        searchInIngredients = true
                        break
                    }
                }
                if (searchInIngredients) break
            }

            if (searchInTitle || searchInDescription || searchInIngredients) {
                filteredRecipes.push(recipe)
            }
        }

        applyFilters()
        renderRecipes(filteredRecipes, searchQuery, filteredRecipes.length)
        updateOptions()
    }
}

const applyFilters = () => {
    let tempRecipes = []

    for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i]
        let matchIngredients = true
        let matchAppliances = true
        let matchUstensils = true

        if (activeFilters.ingredients.length > 0) {
            for (let j = 0; j < activeFilters.ingredients.length; j++) {
                const filter = activeFilters.ingredients[j]
                let ingredientFound = false

                for (let k = 0; k < recipe.ingredients.length; k++) {
                    if (recipe.ingredients[k].ingredient.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
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

        if (activeFilters.kitchenAppliances.length > 0) {
            if (activeFilters.kitchenAppliances.indexOf(recipe.appliance.toLowerCase()) === -1) {
                matchAppliances = false
            }
        }

        if (activeFilters.ustensils.length > 0) {
            for (let j = 0; j < activeFilters.ustensils.length; j++) {
                const filter = activeFilters.ustensils[j]
                let ustensilFound = false

                for (let k = 0; k < recipe.ustensils.length; k++) {
                    if (recipe.ustensils[k].toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
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
renderOptions(ingredients, optionIngredients, activeFilters.ingredients, 'ingredients')
renderOptions(kitchenAppliances, optionKitchenAppliance, activeFilters.kitchenAppliances, 'kitchen-appliances')
renderOptions(ustensils, optionUstensils, activeFilters.ustensils, 'ustensils')

searchBar.addEventListener('input', searchRecipes)

renderRecipes(recipeList, '', recipeList.length)
