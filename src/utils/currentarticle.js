// currentArticle

import storage from './storage'

const TOKEN_KEY = 'HEIMA_TOUTIAO_CURRENTARTICLEID'

export const getId = () => storage.get(TOKEN_KEY)

export const setId = (token) => storage.set(TOKEN_KEY, token)

export const removeId = () => storage.remove(TOKEN_KEY)
