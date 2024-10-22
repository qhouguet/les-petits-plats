import {
    activeFilters,
    ustensilsSearchText,
    appliancesearchText,
    ingredientSearchText,
    optionIngredients,
    optionUstensils,
    optionKitchenAppliance,
    renderOptions,
    searchRecipes,
    ingredients,
    appliances,
    ustensils,
} from '../index.js'
import { getRecipesOptionsWithSearch } from './options.js'
import { formatString } from './string.js'

export const addTagToFilter = (tag, type) => {
    const formattedTag = tag.toLowerCase()
    const filterMapping = {
        ingredients: { list: activeFilters.ingredients, searchText: ingredientSearchText },
        appliances: { list: activeFilters.appliances, searchText: appliancesearchText },
        ustensils: { list: activeFilters.ustensils, searchText: ustensilsSearchText },
    }

    const filterData = filterMapping[type]
    if (!filterData) return

    let isAlreadyPresent = false
    for (let i = 0; i < filterData.list.length; i++) {
        if (filterData.list[i] === formattedTag) {
            isAlreadyPresent = true
            break
        }
    }

    if (!isAlreadyPresent) {
        filterData.list.push(formattedTag)
        filterDropdownTags(type, filterData.searchText)
        renderDropdownSelectedTag(tag, type)
        renderSelectedTag(tag, type)
        searchRecipes()
    }
}

export const renderSelectedTag = (tag, type) => {
    const divSelectedOption = document.getElementById('div-selected-option')

    const fragment = document.createDocumentFragment()

    const tagDiv = document.createElement('div')
    tagDiv.classList.add('flex', 'items-center', 'justify-between', 'p-4', 'bg-yellow-custom', 'min-w-52', 'rounded-lg')

    const tagName = document.createElement('span')
    tagName.textContent = formatString(tag)

    const closeIcon = document.createElement('i')
    closeIcon.classList.add('cursor-pointer', 'fa-solid', 'fa-xmark', 'font-bold')

    closeIcon.addEventListener('click', () => {
        removeTagFromFilter(tag, type)
        tagDiv.remove()
    })

    tagDiv.appendChild(tagName)
    tagDiv.appendChild(closeIcon)

    fragment.appendChild(tagDiv)

    divSelectedOption.appendChild(fragment)
}

export const removeTagFromFilter = (tag, type) => {
    const formattedTag = tag.toLowerCase()

    if (type === 'ingredients') {
        let newIngredients = []
        for (let i = 0; i < activeFilters.ingredients.length; i++) {
            if (activeFilters.ingredients[i] !== formattedTag) {
                newIngredients.push(activeFilters.ingredients[i])
            }
        }
        activeFilters.ingredients = newIngredients
        filterDropdownTags('ingredients', ingredientSearchText)
    } else if (type === 'appliances') {
        let newAppliances = []
        for (let i = 0; i < activeFilters.appliances.length; i++) {
            if (activeFilters.appliances[i] !== formattedTag) {
                newAppliances.push(activeFilters.appliances[i])
            }
        }
        activeFilters.appliances = newAppliances
        filterDropdownTags('appliances', appliancesearchText)
    } else if (type === 'ustensils') {
        let newUstensils = []
        for (let i = 0; i < activeFilters.ustensils.length; i++) {
            if (activeFilters.ustensils[i] !== formattedTag) {
                newUstensils.push(activeFilters.ustensils[i])
            }
        }
        activeFilters.ustensils = newUstensils
        filterDropdownTags('ustensils', ustensilsSearchText)
    }

    const divSelectedOption = document.getElementById('div-selected-option')
    const selectedDivs = divSelectedOption.querySelectorAll('div')
    for (let i = 0; i < selectedDivs.length; i++) {
        const div = selectedDivs[i]
        if (div.textContent.trim() === formatString(tag)) {
            div.remove()
        }
    }

    let dropdownSelected
    if (type === 'ingredients') {
        dropdownSelected = document.getElementById('dropdown-selected-options-ingredients')
    } else if (type === 'appliances') {
        dropdownSelected = document.getElementById('dropdown-selected-options-appliance')
    } else if (type === 'ustensils') {
        dropdownSelected = document.getElementById('dropdown-selected-options-ustensils')
    }

    const dropdownDivs = dropdownSelected.querySelectorAll('div')
    for (let i = 0; i < dropdownDivs.length; i++) {
        const div = dropdownDivs[i]
        if (div.textContent.trim() === formatString(tag)) {
            div.remove()
        }
    }

    searchRecipes()
}

export const renderDropdownSelectedTag = (tag, type) => {
    let dropdownSelected

    if (type === 'ingredients') {
        dropdownSelected = document.getElementById('dropdown-selected-options-ingredients')
    } else if (type === 'appliances') {
        dropdownSelected = document.getElementById('dropdown-selected-options-appliance')
    } else if (type === 'ustensils') {
        dropdownSelected = document.getElementById('dropdown-selected-options-ustensils')
    }

    const tagDiv = document.createElement('div')
    tagDiv.classList.add('bg-yellow-custom', 'px-4', 'py-3', 'relative', 'flex', 'justify-between')

    const tagName = document.createElement('span')
    tagName.textContent = formatString(tag)

    const closeIcon = document.createElement('i')
    closeIcon.classList.add(
        'cursor-pointer',
        'fa-solid',
        'fa-xmark',
        'absolute',
        '-translate-y-1/2',
        'top-1/2',
        'right-4',
        'px-1',
        'py-0.5',
        'rounded-full',
        'bg-black',
        'text-yellow-custom',
        'font-bold'
    )

    closeIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        removeTagFromFilter(tag, type)
        tagDiv.remove()
    })

    tagDiv.appendChild(tagName)
    tagDiv.appendChild(closeIcon)
    dropdownSelected.appendChild(tagDiv)
}

export const filterDropdownTags = (type, searchText) => {
    let options
    let selectedTags
    let domElement

    if (type === 'ingredients') {
        options = getRecipesOptionsWithSearch(ingredients, searchText)
        selectedTags = activeFilters.ingredients
        domElement = optionIngredients
    } else if (type === 'appliances') {
        options = getRecipesOptionsWithSearch(appliances, searchText)
        selectedTags = activeFilters.appliances
        domElement = optionKitchenAppliance
    } else if (type === 'ustensils') {
        options = getRecipesOptionsWithSearch(ustensils, searchText)
        selectedTags = activeFilters.ustensils
        domElement = optionUstensils
    }

    let filteredOptions = []
    for (let i = 0; i < options.length; i++) {
        let optionLower = options[i].toLowerCase()
        let isSelected = false

        for (let j = 0; j < selectedTags.length; j++) {
            if (selectedTags[j] === optionLower) {
                isSelected = true
                break
            }
        }

        if (!isSelected) {
            filteredOptions.push(options[i])
        }
    }

    renderOptions(filteredOptions, domElement, type)
}
