import {
    activeFilters,
    ustensilsSearchText,
    kitchenApplianceSearchText,
    ingredientSearchText,
    optionIngredients,
    optionUstensils,
    optionKitchenAppliance,
    renderOptions,
    searchRecipes,
    ingredients,
    kitchenAppliances,
    ustensils,
} from '../index.js'
import { getRecipesOptionsWithSearch } from './options.js'
import { formatString } from './string.js'

export const addTagToFilter = (tag, type) => {
    const formattedTag = tag.toLowerCase()
    let isAlreadyPresent = false

    const checkPresence = (array) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === formattedTag) {
                isAlreadyPresent = true
                break
            }
        }
    }

    if (type === 'ingredients') {
        checkPresence(activeFilters.ingredients)
        if (!isAlreadyPresent) {
            activeFilters.ingredients.push(formattedTag)
            filterDropdownTags('ingredients', ingredientSearchText)
        }
    } else if (type === 'kitchen-appliances') {
        checkPresence(activeFilters.kitchenAppliances)
        if (!isAlreadyPresent) {
            activeFilters.kitchenAppliances.push(formattedTag)
            filterDropdownTags('kitchen-appliances', kitchenApplianceSearchText)
        }
    } else if (type === 'ustensils') {
        checkPresence(activeFilters.ustensils)
        if (!isAlreadyPresent) {
            activeFilters.ustensils.push(formattedTag)
            filterDropdownTags('ustensils', ustensilsSearchText)
        }
    }

    if (!isAlreadyPresent) {
        renderDropdownSelectedTag(tag, type)
        renderSelectedTag(tag, type)
        searchRecipes()
    }
}

export const renderSelectedTag = (tag, type) => {
    const divSelectedOption = document.getElementById('div-selected-option')

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
    divSelectedOption.appendChild(tagDiv)
}

export const removeTagFromFilter = (tag, type) => {
    const formattedTag = tag.toLowerCase()

    if (type === 'ingredients') {
        activeFilters.ingredients = activeFilters.ingredients.filter((item) => item !== formattedTag)
        filterDropdownTags('ingredients', ingredientSearchText)
    } else if (type === 'kitchen-appliances') {
        activeFilters.kitchenAppliances = activeFilters.kitchenAppliances.filter((item) => item !== formattedTag)
        filterDropdownTags('kitchen-appliances', kitchenApplianceSearchText)
    } else if (type === 'ustensils') {
        activeFilters.ustensils = activeFilters.ustensils.filter((item) => item !== formattedTag)
        filterDropdownTags('ustensils', ustensilsSearchText)
    }

    const divSelectedOption = document.getElementById('div-selected-option')
    const tagDivs = divSelectedOption.querySelectorAll('div')
    for (const div of tagDivs) {
        if (div.textContent.trim() === formatString(tag)) {
            div.remove()
        }
    }

    let dropdownSelected
    if (type === 'ingredients') {
        dropdownSelected = document.getElementById('dropdown-selected-options-ingredients')
    } else if (type === 'kitchen-appliances') {
        dropdownSelected = document.getElementById('dropdown-selected-options-kitchen-appliance')
    } else if (type === 'ustensils') {
        dropdownSelected = document.getElementById('dropdown-selected-options-ustensils')
    }

    const dropdownTagDivs = dropdownSelected.querySelectorAll('div')
    for (const div of dropdownTagDivs) {
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
    } else if (type === 'kitchen-appliances') {
        dropdownSelected = document.getElementById('dropdown-selected-options-kitchen-appliance')
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
    } else if (type === 'kitchen-appliances') {
        options = getRecipesOptionsWithSearch(kitchenAppliances, searchText)
        selectedTags = activeFilters.kitchenAppliances
        domElement = optionKitchenAppliance
    } else if (type === 'ustensils') {
        options = getRecipesOptionsWithSearch(ustensils, searchText)
        selectedTags = activeFilters.ustensils
        domElement = optionUstensils
    }

    const filteredOptions = []

    for (let i = 0; i < options.length; i++) {
        const option = options[i].toLowerCase()
        let isSelected = false

        for (let j = 0; j < selectedTags.length; j++) {
            if (selectedTags[j] === option) {
                isSelected = true
                break
            }
        }

        if (!isSelected) {
            filteredOptions.push(options[i])
        }
    }

    renderOptions(filteredOptions, domElement, selectedTags, type)
}
