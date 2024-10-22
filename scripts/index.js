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
    dropdownElements.forEach((dropdown) => {
        const dropdownContentId = dropdown.getAttribute('data-name')
        const dropdownContentElement = document.getElementById(dropdownContentId)

        if (dropdownContentElement && dropdownContentElement !== domElement) {
            dropdownContentElement.classList.add('hidden')
        }
    })

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

    Array.from(ul.childNodes).forEach((child) => ul.removeChild(child))

    const fragment = document.createDocumentFragment()

    options.map((option) => {
        const li = document.createElement('li')
        li.classList.add('hover:bg-yellow-custom', 'cursor-pointer', 'py-3', 'px-4', 'relative')
        li.textContent = formatString(option)

        li.addEventListener('click', (e) => {
            e.stopPropagation()
            addTagToFilter(option, type)
        })

        fragment.appendChild(li)
    })

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
        filteredRecipes = recipeList.filter((recipe) => {
            const searchInTitle = recipe.name.toLowerCase().includes(searchQuery)
            const searchInDescription = recipe.description.toLowerCase().includes(searchQuery)
            const searchInIngredients = recipe.ingredients.some((ingredientObj) =>
                ingredientObj.ingredient.toLowerCase().includes(searchQuery)
            )

            return searchInTitle || searchInDescription || searchInIngredients
        })
    }

    applyFilters()
    renderRecipes(filteredRecipes, searchQuery)
    updateOptions()
}

const applyFilters = () => {
    let tempRecipes = []

    filteredRecipes.forEach((recipe) => {
        const matchIngredients =
            activeFilters.ingredients.length === 0 ||
            activeFilters.ingredients.every((filter) =>
                recipe.ingredients.some((ingredient) =>
                    ingredient.ingredient.toLowerCase().includes(filter.toLowerCase())
                )
            )

        const matchAppliances =
            activeFilters.appliances.length === 0 || activeFilters.appliances.includes(recipe.appliance.toLowerCase())

        const matchUstensils =
            activeFilters.ustensils.length === 0 ||
            activeFilters.ustensils.every((filter) =>
                recipe.ustensils.some((ustensil) => ustensil.toLowerCase().includes(filter.toLowerCase()))
            )

        if (matchIngredients && matchAppliances && matchUstensils) {
            tempRecipes.push(recipe)
        }
    })

    filteredRecipes = tempRecipes
}

// initialisation
renderOptions(ingredients, optionIngredients, 'ingredients')
renderOptions(appliances, optionKitchenAppliance, 'appliances')
renderOptions(ustensils, optionUstensils, 'ustensils')

searchBar.addEventListener('input', searchRecipes)

renderRecipes(recipeList, '')
