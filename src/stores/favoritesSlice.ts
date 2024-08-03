import { StateCreator } from "zustand"
import { Recipe } from "../types"
import { createRecipesSlice, RecipesSliceType } from "./recipeSlice"
import { NotificationSliceType } from "./notificationSlice"
import { createNotificationSlice } from "./notificationSlice"

export type FavoriteSliceType = {
    favorites: Recipe[],
    handleClickFavorites: (recipe: Recipe) => void,
    favoriteExists: (id: Recipe['idDrink']) => boolean,
    loadFromStorage: () => void
}

export const createFavoriteSlice : StateCreator<FavoriteSliceType & RecipesSliceType & NotificationSliceType, [], [], FavoriteSliceType> = (set, get, api) => ({
    favorites: [],
    handleClickFavorites: (recipe) => {
        if (get().favoriteExists(recipe.idDrink)) {
            set((state) => ({
                favorites: state.favorites.filter(favorite => favorite.idDrink !== recipe.idDrink)
            }))
            createNotificationSlice(set, get, api).showNotification({
                text: 'Se eliminó de favoritos',
                error: false
            })
        } else {            
            set((state) => ({
                favorites: [...state.favorites, recipe]
                // favorites: [...get().favorites, recipe] (Segunda forma)
            }))
            createNotificationSlice(set, get, api).showNotification({
                text: 'Se agregó a favoritos',
                error: false
            })
        }
        createRecipesSlice(set, get, api).closeModal()
        localStorage.setItem('favorites', JSON.stringify(get().favorites))
    },
    favoriteExists: (id) => {
        return get().favorites.some(favorite => favorite.idDrink === id)
    },
    loadFromStorage: () => {
        const storedFavorites = localStorage.getItem('favorites')
        if (storedFavorites) {
            set({
                favorites: JSON.parse(storedFavorites)
            })
        }
    }
})