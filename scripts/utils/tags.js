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

    const isAlreadyPresent = filterData.list.some((item) => item === formattedTag)
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
        activeFilters.ingredients = activeFilters.ingredients.filter((item) => item !== formattedTag)
        filterDropdownTags('ingredients', ingredientSearchText)
    } else if (type === 'appliances') {
        activeFilters.appliances = activeFilters.appliances.filter((item) => item !== formattedTag)
        filterDropdownTags('appliances', appliancesearchText)
    } else if (type === 'ustensils') {
        activeFilters.ustensils = activeFilters.ustensils.filter((item) => item !== formattedTag)
        filterDropdownTags('ustensils', ustensilsSearchText)
    }

    const divSelectedOption = document.getElementById('div-selected-option')
    divSelectedOption.querySelectorAll('div').forEach((div) => {
        if (div.textContent.trim() === formatString(tag)) {
            div.remove()
        }
    })

    let dropdownSelected
    if (type === 'ingredients') {
        dropdownSelected = document.getElementById('dropdown-selected-options-ingredients')
    } else if (type === 'appliances') {
        dropdownSelected = document.getElementById('dropdown-selected-options-appliance')
    } else if (type === 'ustensils') {
        dropdownSelected = document.getElementById('dropdown-selected-options-ustensils')
    }

    dropdownSelected.querySelectorAll('div').forEach((div) => {
        if (div.textContent.trim() === formatString(tag)) {
            div.remove()
        }
    })

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

    const filteredOptions = options.filter((option) => !selectedTags.includes(option.toLowerCase()))

    renderOptions(filteredOptions, domElement, type)
}
